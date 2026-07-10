import { useEffect, useRef, useState } from "react";
import { getConversation, sendMessage as sendMsg, getChatJobById } from "../services/Chatapi";
import { socket } from "../services/socket.js";

export function useChat(datasetId) {
  const [messages, setMessages] = useState([]);
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const pendingJobIdRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!datasetId) return;
    pendingJobIdRef.current = null;
    setLoading(false);

    getConversation(datasetId)
      .then((conv) => {
        setMessages(conv.messages || []);
        if (conv.dataset) setDataset(conv.dataset);
      })
      .catch(console.error);
  }, [datasetId]);

  useEffect(() => {
    const handleChatProgress = (data) => {
      //  console.log("[chat:progress] received:", data);
      const { jobId, status, result, error, datasetId: jobDatasetId } = data;

      if (jobId !== pendingJobIdRef.current) return;
      if (jobDatasetId && jobDatasetId !== datasetId) return;

      if (status === "completed") {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result?.answer ?? "No answer returned." },
        ]);
        pendingJobIdRef.current = null;
        setLoading(false);
        return;
      }

      if (status === "failed") {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Something went wrong. Please try again." },
        ]);
        pendingJobIdRef.current = null;
        setLoading(false);
        return;
      }

      // status === "active" — still processing, TypingIndicator already covers this
    };

    socket.on("chat:progress", handleChatProgress);
    return () => socket.off("chat:progress", handleChatProgress);
  }, [datasetId]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading || !datasetId) return;

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const { jobId } = await sendMsg(datasetId, text);
      pendingJobIdRef.current = jobId;

      try {
        const jobStatus = await getChatJobById(jobId);

        if (jobStatus.status === "completed") {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: jobStatus.result?.answer ?? "No answer returned." },
          ]);
          pendingJobIdRef.current = null;
          setLoading(false);
        } else if (jobStatus.status === "failed") {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "Something went wrong. Please try again." },
          ]);
          pendingJobIdRef.current = null;
          setLoading(false);
        }
      
      } catch (err) {
        console.error("Failed to sync chat job status:", err);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
      pendingJobIdRef.current = null;
      setLoading(false);
    }
  };

  return { messages, dataset, loading, sendMessage, bottomRef };
}
import { useEffect, useRef, useState } from "react";
import { getConversation, sendMessage as sendMsg } from "../services/Chatapi"; 

export function useChat(datasetId) {
  const [messages, setMessages] = useState([]);
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Load conversation on mount
  useEffect(() => {
    if (!datasetId) return;
    getConversation(datasetId)
      .then((conv) => {
        setMessages(conv.messages || []);
        if (conv.dataset) setDataset(conv.dataset);
      })
      .catch(console.error);
  }, [datasetId]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const result = await sendMsg(datasetId, text);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, dataset, loading, sendMessage, bottomRef };
}
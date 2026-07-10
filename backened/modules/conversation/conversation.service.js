import { chatService } from "../chat/chat.service.js"
import Conversation from "./conversation.model.js"
import JobModel from "../../bullmq/Job.model.js"// adjust path to match your actual location

import { chatQueue } from "../../bullmq/chat/chatQueue.js"

const createError = (message, statusCode) => {
    const error = new Error(message)
    error.statusCode = statusCode
    return error
}

export const conversationService = {
    getConversation: async (req, res) => {
        let conversation = await Conversation.findOne({
            userId: req.user.userId,
            datasetId: req.params.id,
        })
        if (!conversation) {
            conversation = await Conversation.create({
                userId: req.user.userId,
                datasetId: req.params.id,
                messages: []
            })
        }
        return conversation
    },

    SendUserMessage: async (req) => {
        const { message } = req.body;
        const question = message?.trim();

        if (!question) {
            throw createError("Message is required", 400);
        }

        const conversation = await Conversation.findOneAndUpdate(
            { userId: req.user.userId, datasetId: req.params.id },
            { $push: { messages: { role: "user", content: question } } },
            { new: true, upsert: true }
        );

        // Create the Mongo job doc first — same pattern as dataset upload
        const jobDoc = await JobModel.create({
            userId: req.user.userId,
            datasetId: req.params.id,
            type: "chat-processing",
            status: "pending",
        });

        await chatQueue.add(
            "process-question",
            {
                jobId: jobDoc._id.toString(),
                datasetId: req.params.id,
                question,
                history: conversation.messages,
                userId: req.user.userId
            },
            {
                attempts: 2,
                backoff: { type: "exponential", delay: 2000 },
            }
        );

        return { jobId: jobDoc._id };
    }
}

import { chatService } from "../chat/chat.service.js"
import conversation from "./conversation.model.js"
import Conversation from "./conversation.model.js"
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

  await Conversation.findOneAndUpdate(
    {
      userId: req.user.userId,
      datasetId: req.params.id,
    },
    {
      $push: {
        messages: {
          role: "user",
          content: question,
        },
      },
    },
    {
      new: true,
      returnDocument: "after",
    }
  );

  const result = await chatService.processQuestion({
    datasetId: req.params.id,
    question,
    history: conversation.messages,
  });

          const data = await Conversation.findOneAndUpdate(
            { userId: req.user.userId,
              datasetId: req.params.id,
            },{
                $push :{
                    messages : {
                        role : "assistant",
                        content : result.answer
                    }
                }
            },{
                new : true
            })

  return result;
}
}
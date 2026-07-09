
import { chatService } from "../chat/chat.service.js"
import conversation from "./conversation.model.js"
import Conversation from "./conversation.model.js"

import { chatQueue , chatQueueEvents } from "../../bullmq/chat/chatQueue.js"
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

  const job = await chatQueue.add(
    "process-question",
    {
      datasetId: req.params.id,
      question,
      history: conversation.messages,
    },
    {
      attempts: 2,
      backoff: { type: "exponential", delay: 2000 },
    }
  );

  const result = await job.waitUntilFinished(chatQueueEvents);

  const data = await Conversation.findOneAndUpdate(
    { userId: req.user.userId, datasetId: req.params.id },
    { $push: { messages: { role: "assistant", content: result.answer } } },
    { new: true }
  );

  return result;
}
}


// SendUserMessage: async (req) => {
//   const { message } = req.body;

//   const question = message?.trim();

//   if (!question) {
//     throw createError("Message is required", 400);
//   }

//   await Conversation.findOneAndUpdate(
//     {
//       userId: req.user.userId,
//       datasetId: req.params.id,
//     },
//     {
//       $push: {
//         messages: {
//           role: "user",
//           content: question,
//         },
//       },
//     },
//     {
//       new: true,
//       returnDocument: "after",
//     }
//   );

//   // const result = await chatService.processQuestion({
//   //   datasetId: req.params.id,
//   //   question,
//   //   history: conversation.messages,
//   // });
// const job = await chatQueue.add("process-question",{
//   datasetId: req.params.id,
//     question,
//      history: conversation.messages,
// },
//   {
//     attempts: 2,
//     backoff: { type: "exponential", delay: 2000 },
//   })

//   const result = await job.waitUntilFinished(chatQueueEvents)

//           const data = await Conversation.findOneAndUpdate(
//             { userId: req.user.userId,
//               datasetId: req.params.id,
//             },{
//                 $push :{
//                     messages : {
//                         role : "assistant",
//                         content : result.answer
//                     }
//                 }
//             },{
//                 new : true ,upsert :true
//             })

//   return result;
// }


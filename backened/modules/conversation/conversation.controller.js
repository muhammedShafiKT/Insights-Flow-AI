import { asyncWrapper } from "../../middlewares/asyncWrapper.js";
import { conversationService } from "./conversation.service.js";

export const getConversation = asyncWrapper(async(req,res)=>{
    const result = await conversationService.getConversation(req,res)
    res.status(200).json({
        success : true,
        result
    })
})

export const SendUserMessage = asyncWrapper(async(req,res)=>{
    const result = await conversationService.SendUserMessage(req,res)
    res.status(200).json({
        success : true,
        result
    })
})


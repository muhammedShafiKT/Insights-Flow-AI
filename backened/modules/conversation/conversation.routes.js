import express from "express"
import verifytoken from '../../middlewares/verifytoken.js'
import { getConversation,  SendUserMessage } from "./conversation.controller.js"

const router = express.Router()

router.get("/:id/chat",verifytoken,getConversation)
router.post("/:id/chat",verifytoken,SendUserMessage)

export default router
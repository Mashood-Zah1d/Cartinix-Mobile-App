import express from 'express'
import { chatbot } from '../Controller/Chatbot.Controller.js'

const router = express.Router()

router.route("/query").post(chatbot)

export default router
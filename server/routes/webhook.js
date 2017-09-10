import express from "express"
import BotFrameWork from "../controller/handleWebhook"
const router = express.Router();
const bot = new BotFrameWork({
	verify_token: "SEND_NUDE"
})

router.use("/", bot.middleware())

export default router

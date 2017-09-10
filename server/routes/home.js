import express from "express"
const router = express.Router()

router.get("/", (req, res) => {
	res.sendFile("../../public/index.html" , { root : __dirname})
})

export default router
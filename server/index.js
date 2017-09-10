import express from "express"
import bodyParser from "body-parser"
import router from "./routes"
import mongoose from "mongoose"

const app = express()

mongoose.connect("mongodb://localhost:27017/chatbot")
const db = mongoose.connection
db.on("error", () => console.log("Failed to connect to DB."))
	.once("open", () => console.log("Connected to DB. "))

app.set("port", (process.env.PORT || 5000))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json())
app.use(express.static("public"))
app.use(router)

// spin spin sugar
app.listen(app.get("port"), () => {
	console.log("running on port", app.get("port"))
})

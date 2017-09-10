import mongoose from "mongoose"

mongoose.Promise = Promise

const Schema = mongoose.Schema

const messagesSchema = new Schema({
	pageId: {
		type: Number,
		required: true
	},
	message: {
		type: String,
		text: true,
		required: true
	},
	messagelowcase: {
		type: String,
		text: true,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	payload: {
		type: String
	}
}, { collection: "messages", timestamps: true } )

export default mongoose.model("messages", messagesSchema)
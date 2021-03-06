import mongoose from "mongoose"

mongoose.Promise = Promise

const Schema = mongoose.Schema

const messagesSchema = new Schema(
	{
		fanpageId: {
			type: Number,
			required: true
		},
		type: {
			type: String
		},
		method: {
			type: String,
			required: true
		},
		receive: {
			type: String,
			text: true,
			required: true
		},
		receivelowcase: {
			type: String,
			text: true,
			required: true
		},
		text: {
			type: String,
			required: true
		},
		image: {
			type: String
		},
		payload: {
			type: Array
		}
	},
	{ collection: "messages", timestamps: true }
)

export default mongoose.model("messages", messagesSchema)

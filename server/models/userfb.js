import mongoose from "mongoose"

mongoose.Promise = Promise

const Schema = mongoose.Schema

const userfbSchema = new Schema({
	fanpageId: {
		type: Number,
		required: true
	},
	firstName: {
	 	type: String,
		required: true
	},
	lastName: {
	 	type: String,
		required: true
	},
	avatar: {
		type: String,
	},
	locale: {
		type: String,
		required: true
	},
	gender: {
		type: String,
		required: true
	},
	userId: {
		type: Number,
		required: true
	},
}, { collection: "usersfb", timestamps: true } )

export default mongoose.model("userfb", userfbSchema)
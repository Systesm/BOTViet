import mongoose from "mongoose"

mongoose.Promise = Promise

const Schema = mongoose.Schema

const UsersSchema = new Schema(
	{
		fanpageId: {
			type: Number,
			required: true
		},
		token: {
			type: String,
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
		}
	},
	{ collection: "users", timestamps: true }
)

export default mongoose.model("users", UsersSchema)

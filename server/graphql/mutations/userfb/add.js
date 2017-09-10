import {
	GraphQLNonNull,
} from "graphql"

import { userfbType, postInputType } from "../../types/userfb"
import UserfbModel from "../../../models/userfb"

export default {
	type: userfbType,
	args: {
		data: {
			name: "data",
			type: new GraphQLNonNull(postInputType)
		}
	},
	resolve(root, params) {
		const pModel = new UserfbModel(params.data)
		const newPost = pModel.save()
		if (!newPost) {
			throw new Error("Error adding post")
		}
		return newPost
	}
}
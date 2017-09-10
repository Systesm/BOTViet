import {
	GraphQLList
} from "graphql"
import { userfbType } from "../../types/userfb"
import userfbModel from "../../../models/userfb"

export default {
	type: new GraphQLList(userfbType),
	resolve() {
		const users = userfbModel.find().exec()
		if (!users) {
			throw new Error("Error getting users")
		}
		return users
	}
}
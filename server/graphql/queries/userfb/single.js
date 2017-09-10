import {
	GraphQLID,
	GraphQLNonNull
} from "graphql"
import { userfbType } from "../../types/userfb"
import userfbModel from "../../../models/userfb"
  
export default {
	type: userfbType,
	args: {
		thisUserId: {
			name: "userId",
			type: new GraphQLNonNull(GraphQLID)
		}
	},
	resolve(root, params) {
		return userfbModel.findOne({
			"thisUserId": params.thisUserId
		}).exec()
	}
}
import {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLID,
	GraphQLList
} from "graphql"

export const userfbType = new GraphQLObjectType({
	name: "Userfb",
	fields: () => ({
		_id: {
			type: new GraphQLNonNull(GraphQLID)
		},
		fanpageId: {
			type: GraphQLString,
			required: true
		},
		firstName: {
			type: GraphQLString
		},
		lastName: {
			type: GraphQLString
		},
		avatar: {
			type: GraphQLString
		},
		locale: {
			type: GraphQLString
		},
		gender: {
			type: GraphQLString
		},
		thisUserId: {
			type: GraphQLString
		},
	})
})


export const postInputType = new GraphQLInputObjectType({
	name: "UserfbInput",
	fields: () => ({
		fanpageId: {
			type: GraphQLString,
			required: true
		},
		firstName: {
			type: GraphQLString
		},
		lastName: {
			type: GraphQLString
		},
		avatar: {
			type: GraphQLString
		},
		locale: {
			type: GraphQLString
		},
		gender: {
			type: GraphQLString
		},
		thisUserId: {
			type: GraphQLString
		},
	})
})




import express from "express"
import GraphQLHTTP from "express-graphql"
import index from "./home.js"
import webhooks from "./webhook.js"
import schema from "../graphql"
const router = express.Router()

router.use("/", index)

router.use("/graphql",GraphQLHTTP(() => ({
	schema,
	graphiql: true    
})))

router.use("/webhook", webhooks)


export default router
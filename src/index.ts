import "reflect-metadata"
import { ApolloServer } from "apollo-server-express"
import express = require("express")
import { buildSchema } from "type-graphql"
import { createConnection } from "typeorm"
import { ProductResolver } from "./resolvers/ProductResolver"
import { BookResolver } from "./resolvers/BookResolver"

const main = async () => {
	await createConnection()

	const schema = await buildSchema({
		resolvers: [ProductResolver, BookResolver],
	})

	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res }) => ({ req, res }),
	})
	await apolloServer.start()
	const app = express()
	apolloServer.applyMiddleware({ app })

	app.listen(3002, () => {
		console.log("Server port 3002 http://localhost:3002/graphql")
	})
}

main()

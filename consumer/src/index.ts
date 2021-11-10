import "reflect-metadata"
//APOLLO SERVER
import { ApolloServer } from "apollo-server-express"
import express = require("express")
import { buildSchema } from "type-graphql"
import { createConnection } from "typeorm"
import { BookResolver } from "./resolvers/BookResolver"

const main = async () => {
	await createConnection()

	const schema = await buildSchema({
		resolvers: [BookResolver],
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

//APOLLO CLIENT
import fetch from "cross-fetch"
import {
	ApolloClient,
	InMemoryCache,
	// ApolloProvider,
	// useQuery,
	gql,
	HttpLink,
} from "@apollo/client"

const client = new ApolloClient({
	link: new HttpLink({ uri: "http://localhost:3002/graphql", fetch }),
	cache: new InMemoryCache(),
})

function mutationBook(name: string, numberOfPages: Number) {
	client
		.mutate({
			mutation: gql`
				mutation Mutation($numberOfPages: Float!, $name: String!) {
					addBook(numberOfPages: $numberOfPages, name: $name) {
						id
						name
						numberOfPages
					}
				}
			`,
			variables: { name, numberOfPages },
		})
		.then((result) => console.log(result.data))
}

//KAFKA CONSUMER
import Kafka from "node-rdkafka"

var consumer = new Kafka.KafkaConsumer(
	{
		"group.id": "kafka",
		"metadata.broker.list": "localhost:9092",
	},
	{}
)

consumer.connect()

consumer
	.on("ready", () => {
		console.log("consumer ready..")
		consumer.subscribe(["test"])
		consumer.consume()
	})
	.on("data", function (data) {
		if (data.value?.toString()) {
			const book = JSON.parse(data.value?.toString())
			mutationBook(book.name, book.numberOfPages)
		}
	})

main()

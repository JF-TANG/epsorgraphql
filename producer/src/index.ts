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
main()
import fetch from "cross-fetch"

async function getBooks() {
	var query = `query{ 
		books {
			id
			name
			numberOfPages
		}
	}`
	fetch("http://localhost:3002/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			query,
		}),
	})
		.then((r) => r.json())
		.then((data) => console.log("data returned:", data.data.books))
}

//KAFKA PRODUCER
import Kafka from "node-rdkafka"
const producer = new Kafka.HighLevelProducer({
	"metadata.broker.list": "localhost:9092",
	dr_cb: true,
})
producer.connect()

//KAFKA EVENT
function eventAddBook(name: string, numberOfPages: number) {
	producer.produce(
		"test",
		null,
		Buffer.from(JSON.stringify({ name, numberOfPages })),
		null,
		Date.now(),
		async (err, offset) => {
			if (err) {
				console.log(err)
			} else if (offset) {
				try {
					await getBooks()
				} catch {
					console.log("Can't get books")
				}
			}
		}
	)
}

producer.on("event.error", function (err) {
	console.error("Error from producer")
	console.error(err)
})

producer.setPollInterval(1000)

setInterval(() => {
	eventAddBook("Un nom de livre", 150)
}, 3000)

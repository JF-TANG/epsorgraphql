//APOLLO CLIENT

// import {
// 	ApolloClient,
// 	InMemoryCache,
// 	// ApolloProvider,
// 	// useQuery,
// 	gql,
// 	HttpLink,
// } from "@apollo/client"

// const client = new ApolloClient({
// 	link: new HttpLink({ uri: "http://localhost:3002/graphql", fetch }),
// 	cache: new InMemoryCache(),
// })

// function mutationBook(name: string, numberOfPages: Number) {
// 	client
// 		.mutate({
// 			mutation: gql`
// 				mutation Mutation($numberOfPages: Float!, $name: String!) {
// 					addBook(numberOfPages: $numberOfPages, name: $name) {
// 						id
// 						name
// 						numberOfPages
// 					}
// 				}
// 			`,
// 			variables: { name, numberOfPages },
// 		})
// 		.then((result) => console.log(result.data))
// }

import fetch from "cross-fetch"

async function mutationBook(name: string, numberOfPages: Number) {
	var query = `mutation Mutation($numberOfPages: Float!, $name: String!) {
		addBook(numberOfPages: $numberOfPages, name: $name) {
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
			variables: { name, numberOfPages },
		}),
	})
		.then((r) => r.json())
		.then((data) => console.log("data returned:", data.data.addBook))
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

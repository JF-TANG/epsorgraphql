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

function queryBooks() {
	client
		.query({
			query: gql`
				query Books {
					books {
						id
						name
						numberOfPages
					}
				}
			`,
		})
		.then((result) => console.log(result.data))
}

queryBooks()

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
		(err, offset) => {
			if (err) {
				console.log(err)
			}
			// The offset if our acknowledgement level allows us to receive delivery offsets
			console.log(offset)
		}
	)
}

producer.on("event.error", function (err) {
	console.error("Error from producer")
	console.error(err)
})

producer.setPollInterval(1000)

setInterval(() => {
	eventAddBook("Nom de livre", 150)
}, 3000)

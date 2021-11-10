//Je garde le code pour les streams au cas ou

//KAFKA PRODUCER
import Kafka from "node-rdkafka"
const stream = Kafka.Producer.createWriteStream(
	{
		"metadata.broker.list": "localhost:9092",
	},
	{},
	{
		topic: "test",
	}
)

stream.on("error", function (err) {
	console.error("Error in our kafka stream")
	console.error(err)
})

//KAFKA EVENT
function eventAddBook(name: string, numberOfPages: number) {
	const success = stream.write(
		Buffer.from(JSON.stringify({ name, numberOfPages }).toString())
	)
	if (success) {
		console.log(JSON.stringify({ name, numberOfPages }).toString())
	} else {
		console.log("Error")
	}
}

setInterval(() => {
	eventAddBook("Nom de livre", 150)
}, 3000)

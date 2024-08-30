const { getCurrentFormattedTime } = require('./hepler/helper');
const kafka1           = require('./config/kafka');

const consumer = kafka1.consumer({ groupId: 'group_test_topic' });
const producer  = kafka1.producer();

const run1 = async () => { // Consumer
    // Consuming
    await consumer.connect();
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

    await consumer.run({
        partitionsConsumedConcurrently: 30,
        eachMessage: async ({ topic, partition, message }) => {
            const messageValue = JSON.stringify(message.value.toString());
            try {
                console.log(`Received message from topic ${topic} partition ${partition} at ${getCurrentFormattedTime()}`);
                console.log(messageValue);
            } catch (err) {
                console.error(`Failed to parse message as JSON: ${messageValue}`);
                console.error(`Error: ${err.message}`);
            }
        },
    });
};

const run2 = async () => { // Producer
    await producer.connect();

    setInterval(async () => {
        const formattedTime = getCurrentFormattedTime();

        await producer.send({
            topic: 'test-topic',
            messages: [
                {
                    key: 'key1',
                    value: `This is a message produced at ${formattedTime}`
                }
            ],
        });
    }, 5000); // Gửi message mỗi 5000 milliseconds (5 giây)
};

// Chạy cả consumer và producer
Promise.all([run1(), run2()])
    .catch((err) => {
        console.error('Error caught in KafkaJS', err);
        consumer.disconnect();
        producer.disconnect();
        process.exit(1);
    });

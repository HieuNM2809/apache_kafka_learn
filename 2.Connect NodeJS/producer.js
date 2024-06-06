const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'cem-survey',
  brokers: ['localhost:9092'],
  retry: {
    retries: 10,
    initialRetryTime: 30000,
    maxRetryTime: 30000,
  },
  // ssl, sasl nếu cần thiết
});

const consumer = kafka.consumer({ groupId: 'group_test_topic' });
const producer = kafka.producer();

const getCurrentFormattedTime = () => {
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
    const day = currentTime.getDate().toString().padStart(2, '0');
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedTime;
};

const run1 = async () => { // Consumer
    // Consuming
    await consumer.connect();
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

    await consumer.run({
        partitionsConsumedConcurrently: 30,
        eachMessage: async ({ topic, partition, message }) => {
            const messageValue = message.value.toString();
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

const run2 = async () => { // Producer (đã chỉnh sửa)
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

module.exports = kafka;

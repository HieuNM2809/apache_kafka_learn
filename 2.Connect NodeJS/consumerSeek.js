const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "cem-survey",
  brokers: ["localhost:9093"],
  retry: {
    retries: 10,
    initialRetryTime: 30000,
    maxRetryTime: 30000,
  },
});


// Thay đổi group id để consumer lại
const consumer = kafka.consumer({ groupId: "group_test_2" });

const getCurrentFormattedTime = () => {
  const currentTime = new Date();
  const year = currentTime.getFullYear();
  const month = (currentTime.getMonth() + 1).toString().padStart(2, "0");
  const day = currentTime.getDate().toString().padStart(2, "0");
  const hours = currentTime.getHours().toString().padStart(2, "0");
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const seconds = currentTime.getSeconds().toString().padStart(2, "0");
  const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedTime;
};

// Retry limit
const MAX_RETRY_ATTEMPTS = 5;

const run1 = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "test", fromBeginning: true });

  await consumer.run({
    partitionsConsumedConcurrently: 30,
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      const messageValue = message.value.toString();

      try {
        console.log(
          `Received message from topic ${topic} partition ${partition} at ${getCurrentFormattedTime()}`
        );
        console.log(messageValue); // Giả sử có thể gặp lỗi trong quá trình xử lý

        if (Math.random() > 0.7) {
          // Giả lập lỗi
          throw new Error("Processing error");
        }
    
      } catch (err) {

        console.error(
          `Error processing message. Error: ${err.message}`
        );

        await consumer.seek({
          topic,
          partition,
          offset: message.offset,
        });
      }
    },
  });

  // Sử dụng seek để set offset cho partition
  // await consumer.seek({
  //   topic: "test",
  //   partition: 0, // Đặt partition bạn muốn, ví dụ 0
  //   offset: "2", // Offset bạn muốn bắt đầu, ở đây là 2
  // });
};

run1().catch((err) => {
  console.error("Error caught in the KafkaJS consumer", err);
  consumer.disconnect();
  process.exit(1);
});

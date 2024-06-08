//https://kafka.js.org/docs/producing

const kafka           = require('./config/kafka.config');
const {Message, CompressionTypes, IHeaders} = require("kafkajs");

// ---------------------------------------------------------  producer -----------------------------
const producer = kafka.producer({
    //createPartitioner: "MyPartitioner",     // Hàm partitioner tùy chỉnh.
    // retry: {
    //     initialRetryTime: 100,            // Giá trị ban đầu để tính toán thời gian thử lại
    //     retries: 8,                       // Số lần thử lại tối đa cho mỗi cuộc gọi
    //     maxRetryTime: 30000,              // Thời gian chờ tối đa cho mỗi lần thử lại
    //     factor: 0.2,                      // Yếu tố ngẫu nhiên
    //     multiplier: 2                     // Yếu tố mũ
    // },
    // //compression: CompressionTypes.GZIP, // Loại nén sử dụng
    // metadataMaxAge: 300000,               // Thời gian tối đa cho metadata (mặc định: 300000ms).
    // allowAutoTopicCreation: false,        // Cho phép tự động tạo topic (mặc định: true).
    // transactionTimeout: 30000,            // Thời gian chờ giao dịch (mặc định: 60000ms).
    // idempotent: false,                    // Đảm bảo mỗi tin nhắn được ghi chính xác một lần.
    // maxInFlightRequests: null             // Số lượng yêu cầu tối đa đang tiến hành cùng một lúc.
});

const run2 = async () => { // Producer
    await producer.connect();

    setInterval(async () => {

        await producer.send({
            topic: 'test-topic',
            messages: [
                { key: 'key1', value: 'hello world', partition: 1}
                // {
                //     key?: Buffer | string | null
                //     value: Buffer | string | null
                //     partition?: number
                //     headers?: IHeaders
                //     timestamp?: string
                // }
            ],
            // acks?: number
            // timeout?: number
            // compression?: CompressionTypes
        });
    }, 5000); // Gửi message mỗi 5000 milliseconds (5 giây)
};

// ---------------------------------------------------------  consumer -----------------------------
const consumer = kafka.consumer({ groupId: 'group_test_topic' });
const run1 = async () => {
    // Consuming
    await consumer.connect();
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

    await consumer.run({
        partitionsConsumedConcurrently: 30,
        eachMessage: async ({ topic, partition, message }) => {
            const messageValue = JSON.stringify(message.value.toString());
            try {
                console.log(`Received message from topic ${topic} partition ${partition} at `);
                console.log(messageValue);
            } catch (err) {
                console.error(`Failed to parse message as JSON: ${messageValue}`);
                console.error(`Error: ${err.message}`);
            }
        },
    });
};

Promise.all([run1(), run2()])
    .catch((err) => {
        console.error('Error caught in KafkaJS', err);
        consumer.disconnect();
        producer.disconnect();
    });


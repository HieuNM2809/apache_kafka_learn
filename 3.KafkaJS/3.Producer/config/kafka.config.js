const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: 'cem-survey',
    brokers: ['localhost:9092'],
    retry: {
        retries: 10,
        initialRetryTime: 30000,
        maxRetryTime: 30000,
    },
});
module.exports = kafka;
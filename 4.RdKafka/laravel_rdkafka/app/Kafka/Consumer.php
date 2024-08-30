<?php

namespace App\Kafka;

use RdKafka\KafkaConsumer;
use RdKafka\Message;

class Consumer extends Connector
{
    /**
     * Kafka Consumer.
     *
     * @var \RdKafka\Conf
     */
    protected $consumer;

    /**
     * Decode kafka message.
     *
     * {
     *     "headers"    => "message-headers",
     *     "key"        => "message-key",
     *     "body"       => "message-body"
     * }
     *
     * @return object
     */
    public function decodeKafkaMessage(Message $kafkaMessage)
    {
        $message = json_decode($kafkaMessage->payload, true);

        if (isset($message['body']) && \is_string($message['body'])) {
            $message['body'] = json_decode($message['body'], true);
        }

        return [
            'headers' => $kafkaMessage->headers,
            'data' => $message,
            'key' => $kafkaMessage->key,
            'raw' => $kafkaMessage,
        ];
    }

    /**
     * Kafka Consumer.
     *
     * @param mixed $handler Instance of Consumer Handler
     * @param mixed $params
     */
    public function createConsumer($params, $handler)
    {
        // Configure the group.id. All consumer with the same group.id will consume
        // different partitions.

        $this->conf->set('group.id', $params['groupId']);

        $this->consumer = new KafkaConsumer($this->conf);

        $topic = !\is_array($params['topic']) ? [$params['topic']] : $params['topic'];

        $this->consumer->subscribe($topic);

        // Run the Consumer
        while (true) {
            $message = $this->consumer->consume(120 * 1000);

            switch ($message->err) {
                case RD_KAFKA_RESP_ERR_NO_ERROR:
                    $handler($this->decodeKafkaMessage($message));

                    break;
                    // case RD_KAFKA_RESP_ERR__PARTITION_EOF:
                    //     \Log::debug('Error', ['No more messages; will wait for more ' . $topic[0]]);

                    //     break;

                    // case RD_KAFKA_RESP_ERR__TIMED_OUT:
                    //     \Log::debug('Error', ['Timed out ' . $topic[0]]);

                    //     break;

                    // default:
                    //     throw new \Exception($message->errstr(), $message->err);

                    //     break;
            }
        }
    }
}

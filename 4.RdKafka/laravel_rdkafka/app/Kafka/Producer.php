<?php

namespace App\Kafka;

class Producer extends Connector
{
    /**
     * @var \RdKafka\Producer
     */
    protected $producer;

    /**
     * @param array  $payload
     * @param string $key
     * @param string $topic
     */
    public function createProducer($payload = [], $key = '', $topic = '')
    {
        $this->conf->set('bootstrap.servers', config('services.kafka_config.inside_kafka_broker'));

        $topicConf = new \RdKafka\TopicConf();
        $topicConf->set('message.timeout.ms', (string) 30000);
        $topicConf->set('request.required.acks', (string) -1);
        $topicConf->set('request.timeout.ms', (string) 5000);

        $this->producer = new \RdKafka\Producer($this->conf);
        $topic = $this->producer->newTopic($topic, $topicConf);

        $topic->produce(RD_KAFKA_PARTITION_UA, 0, json_encode($payload, JSON_UNESCAPED_UNICODE), $key);

        $result = $this->producer->flush(5000);

        if (RD_KAFKA_RESP_ERR__TIMED_OUT === $result) {
            $logError = [];
            $logError[] = 'KafkaProducerSendMessageTimeOut';
            $logError[] = 'Failed to flush producer. Messages might not have been delivered.';
            // dispatch((new \Modules\Schedule\Jobs\LogSlackQueue(implode("\n", $logError)))->onQueue('logs'));
        }
    }

    /**
     * Setup configs for Kafka Producer.
     *
     * @return void
     */
    protected function setupKafkaConfig()
    {
        $this->conf->set('socket.timeout.ms', (string) 50);
        $this->conf->set('queue.buffering.max.messages', (string) 1000);
        $this->conf->set('max.in.flight.requests.per.connection', (string) 1);
        $this->conf->setDrMsgCb(function (\RdKafka\Producer $kafka, \RdKafka\Message $message) {
            if (RD_KAFKA_RESP_ERR_NO_ERROR !== $message->err) {
                $logError = [];
                $logError[] = 'KAFKA PRODUCER SEND MESSAGE FAILED';
                $logError[] = sprintf('Message FAILED (%s, %s) to send with payload => %s', $message->err, rd_kafka_err2str($message->err), $message->payload);
                // dispatch((new \Modules\Schedule\Jobs\LogSlackQueue(implode("\n", $logError)))->onQueue('logs'));
            } else {
                $logError = [];
                $logError[] = 'KAFKA PRODUCER SEND MESSAGE SUCCESSFULLY';
                $logError[] = sprintf('Message sent SUCCESSFULLY with payload => %s', $message->payload);
                // dispatch((new \Modules\Schedule\Jobs\LogSlackQueue(implode("\n", $logError)))->onQueue('logs'));
            }
        });
    }
}

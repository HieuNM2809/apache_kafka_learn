<?php

namespace App\Kafka;

use RdKafka\Conf;

abstract class Connector
{
    /**
     * Kafka Consumer Configuration.
     *
     * @var \RdKafka\Conf
     */
    protected $conf;

    public function __construct()
    {
        $this->conf = new Conf();
        $this->setupKafkaConfig();
    }

    /**
     * Setup configs for Kafka Consumer.
     *
     * @return void
     */
    protected function setupKafkaConfig()
    {
        $this->conf->setRebalanceCb(function (\RdKafka\KafkaConsumer $kafka, $err, array $partitions = null) {
            switch ($err) {
                case RD_KAFKA_RESP_ERR__ASSIGN_PARTITIONS:
                    echo 'Assign: ';
                    var_dump($partitions);
                    $kafka->assign($partitions);

                    break;

                case RD_KAFKA_RESP_ERR__REVOKE_PARTITIONS:
                    echo 'Revoke: ';
                    var_dump($partitions);
                    $kafka->assign(null);

                    break;

                default:
                    throw new \Exception($err);
            }
        });

        // Initial list of Kafka brokers
        $this->conf->set('metadata.broker.list', config('services.kafka_config.inside_kafka_broker'));

        // Set where to start consuming messages when there is no initial offset in
        // offset store or the desired offset is out of range.
        // 'smallest': start from the beginning
        // 'end': start from the end of topic
        // 'latest' : end of topic
        $this->conf->set('auto.offset.reset', config('services.kafka_config.offset_reset'));

        // Emit EOF event when reaching the end of a partition
        $this->conf->set('enable.partition.eof', config('services.kafka_config.partition_eof'));

        // Automatically and periodically commit offsets in the background
        $this->conf->set('enable.auto.commit', config('services.kafka_config.auto_commit'));
    }
}

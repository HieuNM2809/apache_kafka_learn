<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Kafka\Consumer;
use Illuminate\Support\Facades\Log;

class ConsumerKafka extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:consumer-kafka';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(Consumer $consumer)
    {
         $params['topic'] = ['test'];
         $params['groupId'] = 'group_1';
         $consumer->createConsumer($params, static function ($message) {
             $payload = !empty($message['data']) ? $message['data'] : null;
             Log::info("message: ", [json_encode($payload)]);

             echo 'message';
             echo json_encode($message['data']);
         });
    }
}

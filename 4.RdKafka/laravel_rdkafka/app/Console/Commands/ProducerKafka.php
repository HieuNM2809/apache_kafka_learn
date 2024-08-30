<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Kafka\Consumer;
use Illuminate\Support\Facades\Log;
use App\Kafka\Producer;

class ProducerKafka extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:producer-kafka';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(Producer $producer)
    {
        $actionNames = [ 'create', 'update', 'delete' ];
        $projects    = [ 'NOW', 'LATER', 'SOMEDAY' ];

        $producer->createProducer(
            [
                'action_name' => $actionNames[array_rand($actionNames)],
                'email'       => rand().'@gmail.com',
                'title'       => rand().'title',
                'project'     => $projects[array_rand($projects)],
                'time'        => time(),
                'created_at'  => \Carbon\Carbon::now(),
            ],
            rand(),      // key
            'test'       // topic
        );
    }
}

<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],
    'kafka_config' => [
        'inside_kafka_broker' => env('INSIDE_KAFKA_BROKER', true),
        'auto_commit' => env('AUTO_COMMIT', true),
        'offset_reset' => env('OFFSET_RESET', 'latest'),
        'partition_eof' => env('PARTITION_EOF', true),
        'topic' => [
            'order_stock_revoked' => env('KAFKA_TOPIC_ORDER_STOCK_REVOKED', ''),
        ],
        'consumer' => [
            'staff_consumer' => env('KAFKA_CONSUMER_INSIDE_STAFF', ''),
        ],
    ],

];

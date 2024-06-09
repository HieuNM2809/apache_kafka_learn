const { Kafka } = require("kafkajs");

const runAdmin = async () => {
    try {
        const kafka = new Kafka({
            clientId: 'clientId',
            brokers: ['localhost:9092']
        });
        const admin = kafka.admin();
        await admin.connect();

        // 1. Liệt kê tất cả các chủ đề
        console.log('List of topics:', await admin.listTopics());
        //----------------------------------------------------------------------------------

        // 2. Tạo topic mới
        const newTopic = {
            topic: 'new-topic1',
            numPartitions: 1, // Số lượng partitions
            replicationFactor: 1, // Hệ số sao chép
            // bạn có thể thêm các cài đặt cấu hình khác tại đây
        };
        const topicCreationResult = await admin.createTopics({
            validateOnly: false, // Chỉ validate mà không tạo thực sự
            waitForLeaders: true, // Chờ leader cho tất cả các partitions
            timeout: 1000, // Thời gian chờ (ms)
            topics: [newTopic], // Danh sách các topic để tạo
        });

        if (topicCreationResult) {
            console.log('Topic created successfully:', newTopic.topic);
        } else {
            console.log('Topic creation failed or topic already exists:', newTopic.topic);
        }
        //----------------------------------------------------------------------------------

        // 3. Xoá topic
        console.log(await admin.deleteTopics({
            topics: ['new-topic1'],
            timeout: 5000, // default: 5000
        }))
        //----------------------------------------------------------------------------------














        await admin.disconnect();
    } catch (error) {
        console.error('Error running admin:', error);
    }
};

runAdmin();

Doc: https://docs.kafka-ui.provectus.io/

Dưới đây là một số ví dụ về các lệnh tương tác với Kafka từ command line, bao gồm cả việc sử dụng `group-id`:

**1. Tạo topic:**

```bash
/opt/bitnami/kafka/bin/kafka-topics.sh --create --topic ten_topic --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
```

* Tạo topic `ten_topic` với 3 phân vùng và hệ số sao chép là 1.

**2. Liệt kê các topic:**

```bash
/opt/bitnami/kafka/bin/kafka-topics.sh --list --bootstrap-server localhost:9092
```

* Liệt kê tất cả các topic hiện có trong Kafka.

**3. Mô tả chi tiết về topic:**

```bash
/opt/bitnami/kafka/bin/kafka-topics.sh --describe --topic ten_topic --bootstrap-server localhost:9092
```

* Hiển thị thông tin chi tiết về topic `ten_topic`, bao gồm các partition, leader, replicas, v.v.

**4. Tạo producer và gửi tin nhắn:**

```bash
/opt/bitnami/kafka/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic ten_topic
```

* Tạo một producer để gửi tin nhắn đến topic `ten_topic`. Bạn có thể nhập tin nhắn trực tiếp vào terminal sau khi chạy lệnh này.

**5. Tạo consumer và nhận tin nhắn:**

```bash
/opt/bitnami/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic ten_topic --from-beginning --group nhom_tieu_dung
```

* Tạo một consumer thuộc nhóm `nhom_tieu_dung` để nhận tin nhắn từ topic `ten_topic`, bắt đầu từ đầu topic.
* Nếu dùng group thì có thể chia ra nhiều app để consumer NHƯNG server sẽ quản lý offset.

**6. Tạo consumer và nhận tin nhắn từ offset cụ thể:**

```bash
/opt/bitnami/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic ten_topic --partition 0 --offset 5
```

* Tạo một consumer thuộc nhóm `nhom_tieu_dung` để nhận tin nhắn từ partition 0 của topic `ten_topic`, bắt đầu từ offset 5.
* Nếu dùng `--partition` và `--offset` không thể sử dụng chung với `--group`, do Kafka không cho phép bạn chỉ định offset thủ công trong khi sử dụng một consumer group. Khi sử dụng group, Kafka sẽ tự động quản lý offset cho các partition.

**7. Xóa topic:**

```bash
/opt/bitnami/kafka/bin/kafka-topics.sh --delete --topic ten_topic --bootstrap-server localhost:9092
```

* Xóa topic `ten_topic`.

**Lưu ý:**

* 
* Thay thế `ten_topic` và `nhom_tieu_dung` bằng tên topic và tên nhóm consumer thực tế của bạn.
* Hãy chắc chắn rằng bạn đã truy cập vào container Kafka trước khi chạy các lệnh này (xem lại phần trước về cách truy cập container).
* Các lệnh này cung cấp các chức năng cơ bản để tương tác với Kafka từ command line. Trong môi trường production, bạn thường sẽ sử dụng các thư viện Kafka trong ứng dụng của mình.

Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu cụ thể hơn, hãy cứ hỏi nhé! 

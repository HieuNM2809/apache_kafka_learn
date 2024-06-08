// https://kafka.js.org/docs/configuration
//
// 1/ SASL - (Simple Authentication and Security Layer)
//     SASL là một framework để thêm cơ chế xác thực vào các giao thức kết nối.
//     Nó không phải là một giao thức cụ thể mà là một lớp trung gian cho phép các ứng dụng hỗ trợ
//     nhiều cơ chế xác thực mà không cần phải biết chi tiết từng cơ chế cụ thể.
//
// 2/ SSL - (Secure Sockets Layer)
//     SSL là một tiêu chuẩn công nghệ bảo mật để thiết lập kết nối được mã hóa giữa máy chủ và máy khách
//     (ví dụ: trình duyệt web và máy chủ web) nhằm đảm bảo rằng tất cả dữ liệu truyền giữa chúng đều được bảo mật và riêng tư.
//     Mặc dù SSL đã bị thay thế phần lớn bởi TLS (Transport Layer Security), tên gọi "SSL" vẫn thường được sử dụng để chỉ cả hai công nghệ này.

// 3. Config all
const kafka = new Kafka({
  clientId: 'my-app',                                    // Định danh cho Kafka client. Hữu ích cho việc ghi log và giám sát.
  brokers: ['kafka1:9092', 'kafka2:9092'],               // Một mảng địa chỉ broker theo định dạng host:port.
  ssl: {
    rejectUnauthorized: false,                           // Tùy chọn, để bỏ qua xác nhận chứng chỉ
    // Các thuộc tính con của ssl
    key: null,                                           // Khóa riêng cho SSL.
    cert: null,                                          // Chứng chỉ cho SSL.
    ca: null,                                            // Chuỗi chứng chỉ của tổ chức cấp chứng chỉ.
    passphrase: null                                     // Cụm mật khẩu cho khóa.
  },                                                     // Một đối tượng hoặc boolean để kích hoạt kết nối SSL.
  sasl: {
    mechanism: null,                                      // Cơ chế SASL (plain, scram-sha-256, scram-sha-512).
    username: null,                                       // Tên người dùng cho SASL.
    password: null                                        // Mật khẩu cho SASL.
  },                                                      // Thông tin xác thực SASL. Có thể bao gồm các cơ chế như plain, scram-sha-256, scram-sha-512, v.v.
  connectionTimeout: 1000,                                // Thời gian chờ kết nối tính bằng mili giây (mặc định: 1000ms).
  authenticationTimeout: 1000,                            // Thời gian chờ xác thực tính bằng mili giây (mặc định: 1000ms).
  retry: {
    initialRetryTime: 100,                                 // Giá trị ban đầu được sử dụng để tính toán thời gian thử lại tính bằng mili giây (vẫn được ngẫu nhiên hóa theo yếu tố ngẫu nhiên).
    retries: 8,                                            // Số lần thử lại tối đa cho mỗi cuộc gọi
    maxRetryTime: 30000,                                   // Thời gian chờ tối đa cho mỗi lần thử lại tính bằng mili giây
    factor: 0.2,                                           // Yếu tố ngẫu nhiên
    multiplier: 2,                                         // Yếu tố mũ
    restartOnFailure: async () => true    // Chỉ sử dụng trong consumer. Xem restartOnFailure
  },                                                       // Đối tượng để cấu hình chiến lược kết nối lại, bao gồm thời gian chờ và số lần thử lại.
  requestTimeout: 30000,                                   // Thời gian chờ yêu cầu (mặc định: 30000ms).
  enforceRequestTimeout: false                             // Boolean để bắt buộc thời gian chờ yêu cầu. Mặc định là false.
})


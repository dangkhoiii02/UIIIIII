# SuperShip - MODULE ORDER - FOLDER STRUCTURE

## 1. Mục đích

Tài liệu này quy định cấu trúc thư mục và package chuẩn cho **Order Service** khi triển khai bằng **Java / Spring Boot** theo mô hình Microservice.

Tài liệu tập trung vào cách tổ chức source code, không cố định danh sách Feature/Component nghiệp vụ cụ thể. Các Feature của Module Order có thể thay đổi theo từng giai đoạn phát triển, nhưng nguyên tắc tổ chức thư mục vẫn được giữ ổn định.

Trong kiến trúc **SuperPlatform**, mỗi **Module** được triển khai thành một **Microservice** độc lập. Vì vậy:

```text
SuperPlatform
└── Module Order = Order Service = một Microservice độc lập
    └── <feature> = nhóm nghiệp vụ nội bộ của Order Service
```

Order Service là một đơn vị có source code, build, test, version, database migration, contract và deployment độc lập. Các `<feature>` bên trong chỉ dùng để tổ chức các nhóm nghiệp vụ thuộc Order Service; chúng không phải Microservice hoặc Module độc lập.

Order Service không chứa source code, Domain Model, Repository hoặc Database Model nội bộ của Module khác. Việc giao tiếp với các Module/Microservice khác của SuperPlatform phải thông qua contract và adapter phù hợp như HTTP, gRPC hoặc messaging.

Mục tiêu của cấu trúc này:

- Giúp Developer dễ xác định một đoạn code thuộc nghiệp vụ nào.
- Tách rõ Business Logic khỏi phần phụ thuộc Framework và Infrastructure.
- Giảm việc đặt code theo kiểu “thư mục kỹ thuật toàn cục” như `controller`, `service`, `repository`, `entity`.
- Giúp codebase tiếp tục dễ quản lý khi số lượng chức năng tăng.
- Cho phép mỗi Microservice build, test, version và deploy độc lập.
- Tạo nền tảng để sau này có thể tách Gradle Multi-module nếu Service trở nên lớn hơn mà không cần thay đổi toàn bộ cách tổ chức code.

Nguyên tắc chính:

> **Feature-first, Layer-second.**

Tức là source code được chia theo **nhóm nghiệp vụ trước**, sau đó bên trong mỗi nhóm mới chia thành các layer như `api`, `application`, `domain`, `infrastructure`.

Ví dụ tổng quát:

```text
<feature>/
├── api/
├── application/
├── domain/
└── infrastructure/
```

`<feature>` chỉ là tên đại diện cho một nhóm nghiệp vụ. Tài liệu này không quy định trước Feature nào bắt buộc phải tồn tại.

---

## 2. Cấu trúc tổng thể và Feature

```text
order-service/
├── build.gradle                                 # Khai báo plugin, dependency và tác vụ build
├── settings.gradle                              # Khai báo tên project và Gradle module nếu có
├── gradle.properties                            # Thuộc tính dùng cho Gradle build
├── gradlew                                      # Gradle Wrapper cho Linux/macOS
├── gradlew.bat                                  # Gradle Wrapper cho Windows
├── Dockerfile                                   # Đóng gói Order Service thành container image
├── README.md                                    # Hướng dẫn build, chạy, test và phát triển service
├── .gitignore                                   # Loại trừ file không được quản lý bởi Git
├── .editorconfig                                # Chuẩn hóa format cơ bản giữa các IDE
│
├── src/                                          # Source code và resource của ứng dụng
│   ├── main/                                     # Thành phần được đóng gói vào application
│   │   ├── java/                                 # Java source code
│   │   │   └── com/supership/order/              # Root package của Order Service
│   │   │       ├── OrderServiceApplication.java          # Điểm khởi động Spring Boot
│   │   │       │
│   │   │       ├── <feature>/                    # Một nhóm nghiệp vụ độc lập trong Order Service
│   │   │       │   ├── api/                      # Entry point và API contract của Feature
│   │   │       │   ├── application/              # Use Case và điều phối luồng xử lý
│   │   │       │   ├── domain/                   # Business Model, invariant và Business Rule
│   │   │       │   └── infrastructure/           # Adapter phụ thuộc framework/công nghệ
│   │   │       │
│   │   │       ├── shared/                       # Code thực sự dùng chung giữa nhiều Feature
│   │   │       └── config/                       # Configuration áp dụng toàn Order Service
│   │   │
│   │   └── resources/                            # Cấu hình và resource không phải Java code
│   │       ├── application.yml                   # Cấu hình mặc định của ứng dụng
│   │       ├── application-local.yml             # Override cho môi trường local
│   │       └── db/                               # Resource liên quan đến database
│   │           └── migration/                    # Database migration của Order Service
│   │
│   └── test/                                     # Automated test source set
│       ├── java/                                 # Unit, integration, API và architecture test
│       └── resources/                            # Dữ liệu/cấu hình chỉ dùng khi test
│
├── contracts/                                    # Contract giao tiếp do service quản lý
│   ├── openapi/                                  # REST API specification
│   ├── asyncapi/                                 # Async/message API specification
│   └── proto/                                    # Protocol Buffer/gRPC definition
├── http/                                         # Request mẫu để test API thủ công
├── docs/                                         # Tài liệu kỹ thuật gắn với implementation
│   ├── architecture/                             # Sơ đồ và mô tả kiến trúc
│   ├── adr/                                      # Architecture Decision Record
│   └── runbooks/                                 # Hướng dẫn vận hành và xử lý sự cố
├── scripts/                                      # Script hỗ trợ local development và CI/CD
└── deploy/                                       # Manifest/template triển khai nếu quản lý cùng repo
```

Cấu trúc trên chia Order Service thành ba nhóm lớn:

1. **Source code của ứng dụng**
   - nằm trong `src/main/java`.

2. **Configuration và Resource**
   - nằm trong `src/main/resources`.

3. **Các tài nguyên hỗ trợ phát triển và triển khai**
   - `contracts`, `http`, `docs`, `scripts`, `deploy`.

Mỗi nhóm có trách nhiệm riêng để tránh việc mọi loại file bị trộn chung vào source code.

---

### 2.1. Cấu trúc bên trong một Feature

Mỗi nhóm nghiệp vụ được tổ chức thành một Feature riêng.

Cấu trúc tiêu chuẩn:

```text
<feature>/
├── api/                         # Nhận input và chuyển đổi API contract
├── application/                 # Thực thi Use Case và điều phối nghiệp vụ
├── domain/                      # Chứa Business Logic cốt lõi
└── infrastructure/              # Hiện thực persistence, messaging và external integration
```

Không bắt buộc Feature nào cũng phải có đủ toàn bộ các thư mục con.

Ví dụ:

- Feature chỉ có logic nghiệp vụ nội bộ có thể chưa cần `api`.
- Feature chưa có integration ra ngoài có thể chưa cần `client`.
- Feature không dùng persistence riêng có thể chưa cần `persistence`.

Nguyên tắc là:

> **Chỉ tạo thư mục khi thật sự có code thuộc trách nhiệm đó.**

Không tạo cây thư mục rỗng chỉ để “đủ mẫu”.

Các cấu trúc con trong tài liệu này là **vị trí chuẩn khi loại code tương ứng xuất hiện**, không phải danh sách thư mục bắt buộc phải tạo cho mọi Feature. Tên `<feature>` phải phản ánh một nhóm nghiệp vụ, không dùng tên technical layer như `controller`, `repository`, `service` hoặc tên tạm như `misc`, `other`.

---

## 3. Layer `api`

### 3.1. Mục đích

`api` là nơi tiếp nhận request đồng bộ đi vào Feature, chủ yếu là REST API, và chuyển input sang Application Layer.

Đây là lớp gần với bên ngoài nhất của Feature.

Ví dụ:

- REST API.
- HTTP Request.
- HTTP Response.
- Validation thuộc contract đầu vào.
- Mapping giữa API Model và Application Model.

Cấu trúc tham khảo:

```text
api/
├── controller/
├── request/
├── response/
└── mapper/
```

Nếu một Feature có nhiều loại inbound entry point, có thể làm rõ transport bằng cấu trúc:

```text
api/
├── rest/
│   ├── controller/
│   ├── request/
│   ├── response/
│   └── mapper/
├── messaging/
└── internal/
```

Không bắt buộc thêm lớp `rest` nếu Feature chỉ có HTTP API. Trong cùng một Feature phải dùng nhất quán một cách tổ chức. Message consumer đặt trong `infrastructure/messaging/consumer` vẫn được xem là inbound adapter và chỉ chịu trách nhiệm nhận message rồi gọi Application Layer.

---

### 3.2. `controller`

Chứa các REST Controller hoặc entry point tương tự.

Ví dụ:

```text
controller/
└── XxxController.java
```

Controller nên làm các việc:

1. Nhận HTTP request.
2. Lấy path/query/header/body.
3. Validate input ở mức API contract.
4. Chuyển request sang Command hoặc Query.
5. Gọi Application Layer.
6. Chuyển kết quả thành HTTP response.

Controller **không nên chứa Business Rule**.

Không nên:

```java
if (order.getStatus().equals("XXX")) {
    // xử lý business phức tạp
}
```

trực tiếp trong Controller.

Controller nên giữ mỏng để API có thể thay đổi mà ít ảnh hưởng Business Logic.

---

### 3.3. `request`

Chứa DTO nhận dữ liệu từ bên ngoài.

Ví dụ:

```text
request/
├── CreateXxxRequest.java
└── UpdateXxxRequest.java
```

Request DTO đại diện cho contract API, không phải Domain Model.

Không nên sử dụng trực tiếp JPA Entity làm Request.

Ví dụ không nên:

```java
@PostMapping
public void create(@RequestBody OrderJpaEntity entity)
```

Vì như vậy API contract bị phụ thuộc trực tiếp vào cấu trúc persistence.

---

### 3.4. `response`

Chứa DTO trả dữ liệu ra ngoài.

Ví dụ:

```text
response/
├── XxxResponse.java
└── XxxDetailResponse.java
```

Response DTO cho phép:

- kiểm soát field nào được expose;
- tránh trả trực tiếp Domain Model;
- tránh trả trực tiếp JPA Entity;
- hỗ trợ version API độc lập với Database.

---

### 3.5. `mapper`

Chứa mapping giữa:

```text
API Model
   ↕
Application Model
```

Ví dụ:

```text
CreateXxxRequest
      ↓
CreateXxxCommand
```

hoặc:

```text
Application Result
      ↓
XxxResponse
```

Mapper ở `api` chỉ chịu trách nhiệm cho boundary API, không nên chứa Business Rule.

---

## 4. Layer `application`

### 4.1. Mục đích

`application` mô tả **hệ thống có thể làm gì**.

Nó tổ chức các Use Case và điều phối luồng xử lý.

Ví dụ tổng quát:

```text
application/
├── command/
├── query/
├── handler/
├── dto/
└── port/
    ├── in/
    └── out/
```

Application Layer đứng giữa:

```text
API
 ↓
Application
 ↓
Domain
```

và sử dụng các Port khi cần truy cập Infrastructure.

---

### 4.2. `command`

Command đại diện cho một yêu cầu làm thay đổi trạng thái hệ thống.

Ví dụ:

```text
CreateXxxCommand
UpdateXxxCommand
CancelXxxCommand
```

Command nên mô tả **ý định nghiệp vụ**, không mô tả chi tiết công nghệ.

Tốt:

```text
CreateOrderCommand
```

Không tốt:

```text
InsertOrderToPostgresCommand
```

vì Application không nên biết persistence technology đang dùng là PostgreSQL.

---

### 4.3. `query`

Query đại diện cho yêu cầu đọc dữ liệu.

Ví dụ:

```text
GetXxxQuery
SearchXxxQuery
GetXxxDetailQuery
```

Việc tách `command` và `query` giúp Developer dễ nhận biết:

- operation nào thay đổi dữ liệu;
- operation nào chỉ đọc.

Không bắt buộc phải triển khai CQRS hoàn chỉnh mới được dùng cách tổ chức này.

---

### 4.4. `handler`

Handler thực hiện Use Case.

Ví dụ:

```text
CreateXxxHandler
GetXxxHandler
UpdateXxxHandler
```

Handler thường chịu trách nhiệm:

1. nhận Command/Query;
2. load dữ liệu cần thiết;
3. gọi Domain Model hoặc Domain Service;
4. gọi Port nếu cần giao tiếp Infrastructure;
5. lưu kết quả;
6. trả Application Result.

Handler nên tập trung vào **orchestration**.

Business Rule cốt lõi vẫn ưu tiên đặt trong Domain.

Transaction boundary của một use case thường được quản lý tại Application Handler hoặc Application Service, không đặt trong Controller hay Domain Model.

---

### 4.5. `dto`

Chứa các object phục vụ Application Layer.

Đây có thể là:

- Application Result.
- Data structure dùng giữa các Use Case.
- Data nhận từ Port.

Application DTO không nhất thiết giống API DTO.

Việc tách hai loại DTO giúp Application không phụ thuộc vào HTTP contract.

---

### 4.6. `port`

`port` định nghĩa ranh giới giao tiếp của Application và giúp Application không phụ thuộc trực tiếp vào implementation.

Ví dụ:

```text
port/
├── in/
│   └── ExecuteXxxUseCase.java
└── out/
    ├── ExternalServiceGateway.java
    └── EventPublisher.java
```

- `port/in` chứa contract use case mà Controller, Consumer hoặc caller khác có thể gọi. Nếu Handler được gọi trực tiếp và team không dùng input-port interface, thư mục này có thể không cần tạo.
- `port/out` chứa contract mà Application cần từ database, external service, clock, message broker hoặc hạ tầng khác.

Ví dụ:

```java
public interface ExternalServiceGateway {
    ExternalResult execute(...);
}
```

Application chỉ biết interface này.

Implementation cụ thể:

```text
HTTP
gRPC
Kafka
Database
```

được đặt trong `infrastructure`.

Nhờ đó Application không bị coupling với công nghệ cụ thể.

### 4.7. Cách tổ chức Application khi Feature lớn

Cấu trúc `command/query/handler/dto` phù hợp với Feature nhỏ và vừa. Khi số lượng use case tăng, có thể nhóm theo use case để các class liên quan nằm gần nhau:

```text
application/
├── create/
│   ├── CreateXxxCommand.java
│   ├── CreateXxxHandler.java
│   └── CreateXxxResult.java
├── cancel/
└── search/
```

Không trộn lẫn tùy tiện hai cách tổ chức trong cùng một Feature. Team chọn cách phù hợp với kích thước Feature và giữ nhất quán.

---

## 5. Layer `domain`

### 5.1. Mục đích

`domain` chứa Business Logic cốt lõi của Feature.

Đây là phần code nên phản ánh rõ nhất:

- khái niệm nghiệp vụ;
- trạng thái nghiệp vụ;
- invariant;
- rule;
- hành vi của domain.

Cấu trúc tham khảo:

```text
domain/
├── model/
├── valueobject/
├── repository/
├── service/
├── event/
└── exception/
```

Domain nên là layer ít phụ thuộc Framework nhất.

---

### 5.2. `model`

Chứa các Domain Entity, Aggregate hoặc Model nghiệp vụ.

Ví dụ tổng quát:

```text
model/
├── Xxx.java
└── Yyy.java
```

Khi số lượng model tăng, có thể chia nhỏ theo vai trò:

```text
model/
├── aggregate/
├── entity/
└── enumeration/
```

Không cần tạo các thư mục con này khi Feature còn nhỏ. Aggregate Root chịu trách nhiệm bảo vệ invariant của Aggregate; Entity có identity; Value Object được đặt riêng tại `valueobject`.

Domain Model không nên tồn tại chỉ như một object chứa getter/setter.

Nó có thể chứa hành vi và rule liên quan trực tiếp đến đối tượng nghiệp vụ.

Ví dụ tư duy:

```text
order.cancel()
order.applyChange()
order.validateSomething()
```

thay vì đưa toàn bộ logic vào một `XxxService` khổng lồ.

---

### 5.3. `valueobject`

Chứa các Value Object.

Value Object phù hợp cho các giá trị:

- có ý nghĩa nghiệp vụ;
- không cần identity riêng;
- thường được so sánh bằng giá trị.

Ví dụ tổng quát:

```text
OrderId
Money
Address
TimeRange
```

Việc dùng Value Object giúp Domain Model rõ nghĩa hơn so với việc sử dụng quá nhiều kiểu primitive như `String`, `Long`, `BigDecimal` ở mọi nơi.

---

### 5.4. `repository`

`domain/repository` chứa Repository contract dùng để truy xuất và lưu Domain Aggregate.

Ví dụ:

```java
public interface XxxRepository {
    Optional<Xxx> findById(XxxId id);
    void save(Xxx xxx);
}
```

Repository tại Domain chỉ là **contract**.

Nó không chứa:

```text
JpaRepository
EntityManager
SQL
Hibernate annotation
```

Implementation persistence được đặt trong `infrastructure`.

Quy ước phân biệt:

- Repository thao tác với Domain Aggregate đặt tại `domain/repository`.
- Gateway gọi service/module bên ngoài đặt tại `application/port/out`.
- Spring Data/JPA Repository đặt tại `infrastructure/persistence/repository`.

Không đặt cùng một Repository contract đồng thời ở Domain và Application. Nếu team chọn biến thể đặt toàn bộ output port tại `application/port/out`, phải áp dụng nhất quán trong toàn Order Service và ghi nhận bằng ADR.

---

### 5.5. `service`

Chứa Domain Service khi một Business Rule:

- thực sự thuộc Domain;
- nhưng không phù hợp để đặt vào một Entity hoặc Value Object cụ thể.

Không nên tạo `service` như nơi chứa mọi Business Logic.

Trước khi tạo Domain Service, nên kiểm tra xem logic có thể thuộc chính Domain Model hay không.

---

### 5.6. `event`

Chứa Domain Event.

Domain Event mô tả một sự kiện nghiệp vụ đã xảy ra.

Ví dụ tổng quát:

```text
XxxCreated
XxxChanged
XxxCompleted
```

Domain Event khác với Integration Event và Kafka message.

Domain Event là khái niệm nghiệp vụ bên trong Domain.

Integration Event là contract phát ra ngoài Feature hoặc ngoài Service. Kafka message là representation phụ thuộc transport. Việc chuyển Domain Event thành Integration Event và message thuộc Application/Infrastructure tùy thiết kế; không đặt Kafka annotation, topic hoặc serialization schema trong `domain/event`.

---

### 5.7. `exception`

Chứa exception mang ý nghĩa nghiệp vụ.

Ví dụ:

```text
InvalidXxxStateException
XxxNotAllowedException
```

Không nên đặt exception thuần kỹ thuật như:

```text
DatabaseConnectionException
KafkaPublishException
```

trong Domain.

---

## 6. Layer `infrastructure`

### 6.1. Mục đích

`infrastructure` chứa implementation phụ thuộc công nghệ.

Ví dụ:

- PostgreSQL.
- JPA / Hibernate.
- Kafka.
- Redis.
- REST Client.
- gRPC Client.
- File Storage.
- Scheduler.
- Outbox Worker.

Cấu trúc cơ bản:

```text
infrastructure/
├── persistence/
├── messaging/
├── client/
├── cache/
├── scheduler/
├── storage/
├── inbox/
└── outbox/
```

Trong đó `cache`, `scheduler`, `storage`, `inbox`, `outbox` là các extension point tùy chọn. Chỉ tạo khi Feature thực sự có trách nhiệm tương ứng.

---

### 6.2. `persistence`

Chứa implementation liên quan Database.

```text
persistence/
├── entity/
├── repository/
├── adapter/
└── mapper/
```

#### 6.2.1. `entity`

Chứa JPA Entity.

Ví dụ:

```java
@Entity
@Table(name = "xxx")
public class XxxJpaEntity {
}
```

JPA Entity là persistence model, không mặc định là Domain Model.

Việc tách hai loại model giúp Database schema có thể thay đổi mà hạn chế ảnh hưởng trực tiếp tới Domain.

#### 6.2.2. `repository`

Chứa Spring Data Repository.

Ví dụ:

```java
interface XxxJpaRepository
        extends JpaRepository<XxxJpaEntity, UUID> {
}
```

#### 6.2.3. `adapter`

Adapter implement Repository Port hoặc Gateway mà Application/Domain định nghĩa.

Luồng điển hình:

```text
Application
    ↓
Repository Port
    ↑
Persistence Adapter
    ↓
Spring Data Repository
    ↓
Database
```

#### 6.2.4. `mapper`

Mapping giữa:

```text
Domain Model
    ↕
JPA Entity
```

Mapper persistence không chứa Business Rule.

---

### 6.3. `messaging`

Chứa integration với message broker.

Ví dụ:

```text
messaging/
├── producer/
├── consumer/
├── message/
├── mapper/
└── config/
```

Có thể dùng cho:

- Kafka Producer.
- Kafka Consumer.
- Event serialization.
- Integration Event mapping.

`message` chứa DTO/schema phụ thuộc message broker. Không dùng trực tiếp Domain Event như Kafka DTO nếu hai contract có vòng đời hoặc yêu cầu version khác nhau. `config` chỉ chứa configuration messaging của Feature; configuration dùng chung toàn Service đặt tại root `config`.

Consumer nhận message không nên tự chứa toàn bộ Business Logic.

Thông thường:

```text
Kafka Consumer
    ↓
Application Handler
    ↓
Domain
```

Consumer là inbound adapter: chỉ parse/validate message ở mức contract, thiết lập tracing/idempotency cần thiết và gọi Application Layer. Consumer không tự truy cập JPA Repository hoặc chứa Business Rule.

---

### 6.4. `client`

Chứa adapter gọi hệ thống khác.

Ví dụ:

```text
client/
└── <target-system>/
    ├── XxxHttpClient.java
    ├── XxxGrpcClient.java
    ├── XxxClientAdapter.java
    ├── request/
    ├── response/
    ├── mapper/
    └── config/
```

Khi chỉ có một client nhỏ, không bắt buộc tạo đầy đủ cây con. Khi có nhiều integration, ưu tiên nhóm theo hệ thống đích để DTO và configuration của các hệ thống không bị trộn lẫn.

Application không nên trực tiếp sử dụng:

```text
WebClient
RestClient
Feign
gRPC Stub
```

Thay vào đó:

```text
Application
    ↓
Port
    ↑
Infrastructure Adapter
    ↓
HTTP / gRPC
```

Nhờ vậy nếu một integration đổi từ HTTP sang gRPC, ảnh hưởng chủ yếu nằm trong Infrastructure.

### 6.5. Các adapter tùy chọn

Các trách nhiệm kỹ thuật khác được đặt trong `infrastructure` khi phát sinh:

```text
cache/       Cache adapter và serialization liên quan
scheduler/   Scheduled trigger gọi Application Layer
storage/     File/Object Storage adapter
inbox/       Lưu, deduplicate và xử lý message nhận vào
outbox/      Lưu và publish message theo Transactional Outbox
```

Scheduler chỉ là trigger, không chứa Business Rule. Khi dùng Outbox, thay đổi dữ liệu nghiệp vụ và ghi Outbox record phải nằm trong cùng transaction. Cơ chế retry, deduplicate, replay và dead-letter phải được đặt tại adapter phù hợp, không đẩy vào Domain.

---

## 7. Thành phần dùng chung và cấu hình

### 7.1. `shared`

#### 7.1.1. Mục đích

`shared` chỉ dùng cho code thực sự được nhiều Feature trong **cùng Order Service** sử dụng.

Ví dụ:

```text
shared/
├── domain/
├── application/
└── infrastructure/
```

Các loại code có thể phù hợp:

- Base Domain Event.
- Common Error Model.
- Clock abstraction.
- Một Value Object thực sự dùng chung.
- Correlation/Tracing helper.
- Shared technical abstraction.

Có thể chia cụ thể hơn khi cần:

```text
shared/
├── domain/
│   ├── event/
│   └── valueobject/
├── application/
│   └── error/
└── infrastructure/
    ├── tracing/
    └── security/
```

`shared/domain` không phụ thuộc Spring hoặc implementation kỹ thuật. Không cần tạo đủ cây con nếu chưa có code dùng chung tương ứng.

---

#### 7.1.2. Điều cần tránh

`shared` rất dễ trở thành nơi chứa tất cả những thứ Developer chưa biết đặt ở đâu.

Không nên:

```text
shared/
├── Utils.java
├── Helper.java
├── CommonService.java
├── CommonRepository.java
└── Misc.java
```

Nếu một class chỉ phục vụ một Feature, class đó nên nằm trong Feature đó.

Nguyên tắc:

> Code chỉ được đưa vào `shared` khi có lý do rõ ràng rằng nó thật sự là shared concern.

Thông thường, một abstraction chỉ nên đưa vào `shared` khi có ít nhất hai Feature thực sự sử dụng và abstraction đó có ý nghĩa ổn định. `shared` không chứa Handler, Repository hoặc Business Service chung chung.

---

### 7.2. `config`

`config` chứa configuration ở cấp toàn Order Service.

Ví dụ:

```text
config/
├── SecurityConfig.java
├── JacksonConfig.java
├── PersistenceConfig.java
├── MessagingConfig.java
└── OpenApiConfig.java
```

Phù hợp với:

- Spring Bean configuration.
- Serialization.
- Security infrastructure.
- Global application wiring.
- Configuration dùng chung toàn Service.

Không nên đưa Business Rule vào `config`.

Nếu một configuration chỉ phục vụ một Feature cụ thể, có thể đặt gần Feature đó thay vì đưa tất cả vào global `config`.

Ví dụ:

```text
<feature>/infrastructure/client/<target-system>/config/
<feature>/infrastructure/messaging/config/
```

Root `config` chỉ chứa wiring và configuration áp dụng ở cấp toàn Order Service. Không chứa Business Rule hoặc DTO của Feature.

---

### 7.3. `resources`

Cấu trúc:

```text
src/main/resources/
├── application.yml
├── application-local.yml
├── db/
│   └── migration/
├── messages/
├── templates/
└── schemas/
```

`messages`, `templates` và `schemas` là thư mục tùy chọn; chỉ tạo khi ứng dụng có resource tương ứng.

#### 7.3.1. `application.yml`

Chứa cấu hình mặc định của application.

Ví dụ:

```text
server
spring
datasource
kafka
logging
management
```

Không commit secret trực tiếp vào file cấu hình.

Secret nên được inject từ môi trường triển khai hoặc Secret Management phù hợp.

---

#### 7.3.2. `application-local.yml`

Chứa override dành cho môi trường local development.

Không nên đưa cấu hình production secret vào đây.

---

#### 7.3.3. `db/migration`

Chứa Database Migration của riêng Order Service.

Ví dụ:

```text
db/migration/
├── V001__initial_schema.sql
├── V002__add_xxx.sql
└── V003__alter_xxx.sql
```

Order Service sở hữu migration của Database/Schema thuộc Order Service.

Điều này phù hợp với nguyên tắc Microservice:

> Service sở hữu cả Application Code và Database Evolution của chính nó.

Không nên duy trì một file `schema.sql` lớn rồi chỉnh sửa trực tiếp qua từng lần release.

Migration đã chạy ở môi trường dùng chung hoặc Production không được sửa nội dung. Thay đổi schema phải được thực hiện bằng migration mới theo naming convention thống nhất của team.

---

## 8. Kiểm thử và tài nguyên hỗ trợ

### 8.1. `test`

Test nên mirror tương đối cấu trúc source code.

```text
src/test/java/com/supership/order/
├── <feature>/
├── architecture/
├── integration/
└── support/
```

`support` chứa fixture, test data builder, Testcontainers configuration và test utility thật sự dùng chung. Test helper không được đưa vào production `shared`.

Ví dụ một Feature:

```text
<feature>/
├── domain/
├── application/
└── infrastructure/
```

Các nhóm test thường gặp:

#### 8.1.1. Unit Test

Kiểm tra:

- Domain Model.
- Value Object.
- Domain Service.
- Application Handler độc lập.

#### 8.1.2. Integration Test

Kiểm tra:

- Repository với Database thật qua Testcontainers.
- Kafka integration.
- HTTP integration.
- Spring Context khi cần.

#### 8.1.3. API Test

Kiểm tra:

```text
HTTP Request
    ↓
Controller
    ↓
Application
    ↓
Persistence
```

ở mức tích hợp phù hợp.

#### 8.1.4. Architecture Test

Dùng để bảo vệ dependency rule.

Ví dụ:

```text
domain không được phụ thuộc infrastructure
domain không được phụ thuộc api
```

Có thể sử dụng ArchUnit để enforce các rule này trong CI.

#### 8.1.5. Contract Test

Kiểm tra tính tương thích của:

- OpenAPI contract.
- AsyncAPI/message contract.
- gRPC/Protobuf contract.
- Request/response với các service phụ thuộc khi cần.

Contract Test không thay thế Integration Test; nó bảo vệ boundary giữa Order Service và consumer/provider bên ngoài.

---

### 8.2. `contracts`

Cấu trúc tham khảo:

```text
contracts/
├── openapi/
├── asyncapi/
└── proto/
```

`contracts` dùng để lưu các contract giao tiếp được quản lý cùng repository khi cần.

Ví dụ:

- OpenAPI specification.
- AsyncAPI specification.
- Protocol Buffer definition.

Không dùng `contracts` để chứa:

```text
Order.java
Carrier.java
User.java
```

rồi cho nhiều Microservice cùng import.

Microservice nên chia sẻ **contract**, không chia sẻ Domain Model nội bộ.

Chỉ lưu contract do Order Service sở hữu hoặc publish, trừ trường hợp build cần quản lý bản contract của dependency theo cơ chế chính thức. Contract phải được version hóa. Generated source phải được tách khỏi handwritten source và không chỉnh sửa thủ công.

---

### 8.3. `http`

```text
http/
├── local.http
├── smoke.http
└── examples.http
```

Thư mục này phục vụ Developer test API trực tiếp từ IDE.

Các file `.http` có thể được commit để toàn team sử dụng chung.

Nó hữu ích cho:

- local development;
- smoke test thủ công;
- demo API;
- reproduce lỗi nhanh.

Nó không thay thế Integration Test hoặc Contract Test tự động.

---

### 8.4. `docs`

```text
docs/
├── architecture/
├── adr/
└── runbooks/
```

Chứa tài liệu kỹ thuật liên quan trực tiếp tới implementation của Order Service.

Ví dụ:

- quyết định kiến trúc;
- flow kỹ thuật;
- ADR;
- hướng dẫn development;
- hướng dẫn troubleshooting.
- runbook vận hành và xử lý sự cố.

Không nên duplicate toàn bộ BRD/SRS vào source repository nếu các tài liệu đó đã được quản lý tại hệ thống tài liệu chính.

---

### 8.5. `scripts`

Chứa script phục vụ Developer hoặc CI/CD.

Ví dụ:

```text
scripts/
├── local/
├── ci/
└── migration/
```

Tên script cụ thể có thể khác theo công cụ và hệ điều hành; cách chia trên chỉ dùng khi số lượng script đủ lớn. Với ít script, có thể đặt trực tiếp dưới `scripts`.

Script nên có mục đích cụ thể và có thể chạy lặp lại.

Không nên phụ thuộc quá nhiều vào thao tác thủ công khó tái hiện.

---

### 8.6. `deploy`

```text
deploy/
├── helm/
└── k8s/
```

Chứa deployment manifest nếu mô hình repository của team quản lý deployment cùng service.

Có thể bao gồm:

- Kubernetes Deployment.
- Kubernetes Service.
- ConfigMap template.
- Helm Chart.
- Health check configuration.
- Resource request/limit.

Nếu tổ chức sử dụng GitOps repository riêng, `deploy` có thể chỉ chứa template hoặc không cần tồn tại.

---

## 9. Quy tắc kiến trúc và khả năng tiến hóa

### 9.1. Quy tắc Dependency

Hướng dependency khuyến nghị:

```text
api
 │
 ▼
application
 │
 ▼
domain
 ▲
 │
infrastructure
```

Hiểu theo nguyên tắc:

```text
API gọi Application
Application sử dụng Domain
Infrastructure implement Port mà Application/Domain cần
Domain không biết Infrastructure tồn tại
```

Ví dụ persistence:

```text
Controller
    ↓
Application Handler
    ↓
Domain
    ↓
Repository Port
    ↑
Persistence Adapter
    ↓
Spring Data JPA
    ↓
PostgreSQL
```

Ví dụ gọi Service khác:

```text
Application Handler
    ↓
External Service Port
    ↑
HTTP/gRPC Adapter
    ↓
Other Microservice
```

---

### 9.2. Những dependency cần tránh

#### 9.2.1. Domain phụ thuộc JPA

Không nên:

```java
@Entity
public class DomainOrder {
}
```

nếu team chọn hướng Domain thuần và tách persistence model.

Ưu tiên:

```text
Domain Model
     ↕ Mapper
JPA Entity
```

---

#### 9.2.2. Application gọi trực tiếp HTTP Client

Không nên:

```text
Application Handler
    ↓
WebClient
```

Nên:

```text
Application Handler
    ↓
Port
    ↑
HTTP Adapter
```

---

#### 9.2.3. Controller gọi Repository trực tiếp

Không nên:

```text
Controller
    ↓
JpaRepository
```

Nên:

```text
Controller
    ↓
Application
    ↓
Domain / Repository Port
```

---

#### 9.2.4. Feature truy cập implementation nội bộ Feature khác tùy tiện

Khi nhiều Feature cùng tồn tại trong Order Service, nên hạn chế việc Feature A đi sâu vào:

```text
feature-b.infrastructure.*
```

hoặc:

```text
feature-b.api.*
```

Nếu cần giao tiếp, ưu tiên thông qua interface/Application contract rõ ràng.

Điều này giúp Feature dễ tách hoặc refactor về sau.

---

### 9.3. Quy tắc Package Java

Root package:

```text
com.supership.order
```

Package Feature:

```text
com.supership.order.<feature>
```

Package theo Layer:

```text
com.supership.order.<feature>.api
com.supership.order.<feature>.application
com.supership.order.<feature>.domain
com.supership.order.<feature>.infrastructure
```

Tên package:

- dùng lowercase;
- ngắn gọn;
- phản ánh đúng business concept;
- tránh tên chung chung như `misc`, `common2`, `other`, `temp`.

---

### 9.4. Không tổ chức toàn Service theo Technical Layer

Không khuyến nghị:

```text
com.supership.order/
├── controller/
├── service/
├── repository/
├── entity/
├── dto/
└── mapper/
```

Cấu trúc này dễ dùng khi project rất nhỏ nhưng khi codebase tăng sẽ dẫn tới:

- tất cả Controller của mọi nghiệp vụ nằm chung một chỗ;
- tất cả Service nằm chung một chỗ;
- khó nhìn thấy boundary nghiệp vụ;
- Developer phải di chuyển qua nhiều package để hiểu một Feature;
- refactor hoặc tách Feature trở nên khó hơn.

Khuyến nghị:

```text
com.supership.order/
├── <feature-a>/
│   ├── api/
│   ├── application/
│   ├── domain/
│   └── infrastructure/
│
└── <feature-b>/
    ├── api/
    ├── application/
    ├── domain/
    └── infrastructure/
```

Các class liên quan cùng một Feature nằm gần nhau hơn.

---

### 9.5. Nguyên tắc Microservice độc lập

Order Service phải được xem là một deployable unit độc lập.

Nó cần có khả năng:

```text
Build riêng
Test riêng
Version riêng
Docker Image riêng
Deploy riêng
Rollback riêng
Scale riêng
Database Migration riêng
```

Luồng cơ bản:

```text
Source Code
    ↓
Gradle Build
    ↓
Automated Test
    ↓
JAR
    ↓
Docker Image
    ↓
Container Registry
    ↓
Deploy
```

Việc release Order Service không nên bắt buộc phải release lại các Microservice khác nếu contract giữa các service vẫn tương thích.

---

### 9.6. Khi nào cần tách Gradle Multi-module?

Baseline hiện tại có thể bắt đầu bằng một Spring Boot project:

```text
order-service/
└── src/main/java/...
```

Đây là lựa chọn đơn giản và phù hợp khi:

- Service chưa quá lớn.
- Team chưa cần build module riêng.
- Package boundary đã đủ để quản lý dependency.

Khi codebase tăng mạnh và cần enforce dependency ở mức build, có thể nâng thành Multi-module.

Ví dụ:

```text
order-service/
├── order-domain/
├── order-application/
├── order-adapter-web/
├── order-adapter-persistence/
├── order-adapter-messaging/
└── order-bootstrap/
```

Multi-module là bước tiến hóa về sau.

Không nên tách quá nhiều module chỉ để cấu trúc trông “enterprise”.

Nguyên tắc Folder Structure cốt lõi vẫn không thay đổi:

```text
Business Boundary
    ↓
Application / Domain
    ↓
Adapter / Infrastructure
```

---

## 10. Kết luận

Order Service áp dụng nguyên tắc:

> **Feature-first, Layer-second.**

Feature là đơn vị tổ chức Business Code.

Bên trong mỗi Feature sử dụng cấu trúc:

```text
<feature>/
├── api/
├── application/
├── domain/
└── infrastructure/
```

Trong đó:

- `api`: giao tiếp với bên ngoài;
- `application`: tổ chức Use Case và điều phối;
- `domain`: Business Logic cốt lõi;
- `infrastructure`: implementation phụ thuộc công nghệ.

Danh sách Feature có thể được bổ sung, tách, gộp hoặc đổi tên theo nghiệp vụ thực tế mà không làm thay đổi chuẩn Folder Structure.

Cấu trúc trong tài liệu là template định vị trách nhiệm, không phải yêu cầu tạo sẵn mọi thư mục. Một Feature chỉ tạo các package thực sự cần dùng và phải giữ nhất quán convention đã chọn trong toàn Order Service.

Cấu trúc này giúp Order Service giữ được:

- business boundary rõ ràng;
- dependency rõ ràng;
- khả năng test tốt;
- khả năng thay đổi Infrastructure;
- khả năng mở rộng codebase;
- khả năng build và deploy độc lập theo đúng mô hình Microservice.

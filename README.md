# Scalable Ecommerce Microservices Platform

Spring Boot microservices project for a scalable ecommerce backend. It uses Eureka for service discovery, Spring Cloud Gateway as the API entrypoint, OpenFeign for service-to-service communication, Resilience4j for fault tolerance, Lombok for shorter code, and PostgreSQL for every data-owning service.

## Services

| Service | Port | Responsibility |
| --- | ---: | --- |
| discovery-server | 8761 | Eureka service registry |
| api-gateway | 8080 | Routes client requests to services |
| user-service | 0   | Registration, login, JWT, profile management |
| product-service | 0 | Products, categories, inventory |
| cart-service | 0 | Shopping cart item management |
| order-service | 0 | Order placement, status, order history |
| payment-service | 0 | Internal wallet-based payments |
| notification-service | 0 | Email/SMS-style notification records |
## Service ports are set to 0.
- for making multiple instance of each service
- port 0 means assign random port which is free
- it helps in Load Balancing

## What Is Included

- Multi-module Maven project.
- Eureka Server and Eureka clients.
- API Gateway routes for all services.
- Feign clients for cart/order/payment/product/notification communication.
- Resilience4j circuit breaker wrappers around remote calls.
- PostgreSQL configuration per service using environment variables.
- Wallet payment flow without Stripe, PayPal, Redis, or Kafka.
- GitHub-ready `.gitignore` and `.env.example`.
- Load Balancing in each services

## Database Setup

Create one PostgreSQL database per service:

```sql
CREATE DATABASE ecommerce_users;
CREATE DATABASE ecommerce_products;
CREATE DATABASE ecommerce_carts;
CREATE DATABASE ecommerce_orders;
CREATE DATABASE ecommerce_payments;
CREATE DATABASE ecommerce_notifications;
```

Or start the included local PostgreSQL container:

```bash
docker compose up -d postgres
```

Each service uses `ddl-auto: update` for learning/dev mode. For production, switch to Flyway/Liquibase migrations and `ddl-auto: validate`.

## Run Order

Start services in this order:

```bash
mvn -pl discovery-server spring-boot:run
mvn -pl api-gateway spring-boot:run
mvn -pl user-service spring-boot:run
mvn -pl product-catalog-service spring-boot:run
mvn -pl cart-service spring-boot:run
mvn -pl payment-service spring-boot:run
mvn -pl notification-service spring-boot:run
mvn -pl order-service spring-boot:run
```

Gateway URL:

```text
http://localhost:8080
```

Eureka dashboard:

```text
http://localhost:8761
```

## Main API Examples

Register:

```http
POST /api/v1/auth/signup
```

Create category/product:

```http
POST /api/v1/categories
POST /api/v1/products
```

Wallet:

```http
POST /api/v1/wallets
POST /api/v1/wallets/{userId}/top-up
GET /api/v1/wallets/{userId}
```

Cart:

```http
POST /api/v1/carts/{userId}/items
GET /api/v1/carts/{userId}
PUT /api/v1/carts/{userId}/items/{productId}
DELETE /api/v1/carts/{userId}/items/{productId}
```

Orders:

```http
POST /api/v1/orders
GET /api/v1/orders/{orderId}
GET /api/v1/orders/users/{userId}
PUT /api/v1/orders/{orderId}/status
```

## Build

```bash
mvn clean package
```

If you only want to compile without tests:

```bash
mvn clean package -DskipTests
```

## Notes

- Redis and Kafka are intentionally not included, as requested.
- Payment is internal wallet logic only.
- Notification service stores/logs notifications and can later be connected to Twilio or SendGrid.
- Put real secrets in environment variables, not in Git.

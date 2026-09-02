# Location Service

Spring Boot REST microservice that queries the vehicle's last known GPS/ATS tracking timestamp from PostgreSQL (`uetds_ats_son_konum`).

## 🛠 Tech Stack
- Java 25 & Spring Boot 4
- PostgreSQL & Spring JDBC Template
- Maven

## 🚀 Getting Started

1. **Configure Environment:**
   ```bash
   cp .env.example .env
   # Update DB_URL, DB_USERNAME, DB_PASSWORD
   ```

2. **Run Service:**
   ```bash
   ./mvnw spring-boot:run
   ```

Runs on `http://localhost:8081`.

## 📡 API Endpoint

`GET /api/accident/konum-zamani?licensePlate={plate}`

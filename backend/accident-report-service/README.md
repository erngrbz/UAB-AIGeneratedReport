# Accident Report Service

Spring Boot REST microservice that queries PostgreSQL database functions (`kaza_kirim_rapor`) for vehicle registration, technical inspection, mandatory insurance, and U-ETDS trip data.

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

Runs on `http://localhost:8080`.

## 📡 API Endpoint

`GET /api/accident/kirim-raporu?licensePlate={plate}&date={date}`

# UAB AI Generated Accident Report

Plaka ve kaza tarihi bilgisine göre PostgreSQL fonksiyonu üzerinden resmi kaza kırım raporu üreten Spring Boot REST API servisi.

## 🛠 Teknolojiler
- Java 25 & Spring Boot 4
- PostgreSQL & Spring JDBC Template
- Maven

## 🚀 Hızlı Başlangıç

1. **Ortam değişkenlerini ayarlayın:**
   ```bash
   cp .env.example .env
   # .env içindeki DB bağlantı bilgilerini güncelleyin
   ```

2. **Projeyi çalıştırın:**
   ```bash
   ./mvnw spring-boot:run
   ```

## 📡 API Kullanımı

**Endpoint:** `GET /api/accident/kirim-raporu`

**Parametreler:**
- `licensePlate`: Taşıt plakası (Örn: `06ABC123`)
- `date`: Kaza tarihi (`YYYY-MM-DD` formatında, Örn: `2024-05-15`)

**Örnek İstek:**
```
GET http://localhost:8080/api/accident/kirim-raporu?licensePlate=06ABC123&date=2024-05-15
```

**Örnek Yanıt:**
```json
{
  "report": "06ABC123 plakalı taşıt hakkında 15.05.2024 tarihi baz alarak Bakanlığımız kayıtlarında yapılan inceleme neticesinde; ... Arz ederim."
}
```

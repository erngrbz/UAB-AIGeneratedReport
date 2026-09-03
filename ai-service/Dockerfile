# Python 3.11 tabanlı hafif imaj
FROM python:3.11-slim

# Ortam değişkenleri: Python tamponlamasını kapat ve bytecode üretimini engelle
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Çalışma dizini oluştur
WORKDIR /app

# WeasyPrint ve fontlar için gerekli sistem kütüphanelerini kur
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3-dev \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    libharfbuzz0b \
    libcairo2 \
    libgdk-pixbuf-2.0-0 \
    libffi-dev \
    shared-mime-info \
    fonts-dejavu-core \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# Bağımlılıkları kopyala ve kur
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Uygulama dosyalarını ve varlıkları kopyala
COPY ReportService.py .
COPY logo.png .

# Raporların kaydedileceği dizini oluştur
RUN mkdir -p /app/reports

# Servisin çalıştığı portu dışa aç
EXPOSE 8082

# Servisi başlat
CMD ["uvicorn", "ReportService:app", "--host", "0.0.0.0", "--port", "8082"]

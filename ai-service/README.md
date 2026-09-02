# AI & Report Orchestrator Service

FastAPI service that extracts accident details from news URLs, orchestrates backend microservices, and utilizes an LLM to generate formal ministry incident reports in PDF and DOCX formats.

## 🛠 Tech Stack
- Python 3.10+ & FastAPI
- WeasyPrint (PDF engine) & python-docx (DOCX engine)
- BeautifulSoup4 & Requests

## 🚀 Getting Started

1. **Create & Activate Virtual Environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start Service:**
   ```bash
   python ReportService.py
   ```
   Service runs on `http://localhost:8000`. Interactive API documentation: `http://localhost:8000/docs`.

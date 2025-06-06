# LangGraph Travel Planning Service

Service lập kế hoạch du lịch sử dụng LangGraph với khả năng kết nối đến nhiều AI provider như GPT và Gemini.

## Cấu trúc thư mục

```
langgraph-service/
├── app/
│   ├── __init__.py
│   ├── graph.py          ← LangGraph state machine
│   ├── steps.py          ← Các bước xử lý riêng biệt
│   └── main.py           ← FastAPI server + endpoint
├── requirements.txt      ← Dependencies Python
├── env.example          ← File cấu hình mẫu
└── README.md            ← Hướng dẫn sử dụng
```

## Cài đặt

1. Tạo môi trường ảo Python:
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

2. Cài đặt dependencies:
```bash
pip install -r requirements.txt
```

3. Cấu hình environment variables:
```bash
# Copy file mẫu
cp env.example .env

# Chỉnh sửa .env với API keys của bạn
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

## Chạy service

```bash
# Từ thư mục langgraph-service
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### 1. Health Check
```
GET /
GET /health
```

### 2. Generate Itinerary (Recommended)
```
POST /generate-itinerary
Content-Type: application/json

{
    "text": "Tôi muốn đi du lịch Đà Lạt 3 ngày 2 đêm",
    "ai_provider": "gpt"  // hoặc "gemini"
}
```

### 3. Legacy Endpoint
```
POST /generate-itinerary-legacy
Content-Type: application/json

{
    "text": "Tôi muốn đi du lịch Đà Lạt 3 ngày 2 đêm",
    "ai_provider": "gpt"
}
```

## Tích hợp với frontend

```javascript
// Ví dụ sử dụng fetch
const response = await fetch('http://localhost:8000/generate-itinerary', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        text: 'Tôi muốn đi du lịch Đà Lạt 3 ngày 2 đêm',
        ai_provider: 'gpt'
    })
});

const result = await response.json();
console.log(result.output);
```

## AI Providers hỗ trợ

- **GPT (OpenAI)**: Sử dụng model gpt-4o
- **Gemini (Google)**: Sử dụng model gemini-pro

## Tính năng

- ✅ LangGraph state machine cho workflow phức tạp
- ✅ Hỗ trợ nhiều AI provider
- ✅ FastAPI với documentation tự động
- ✅ CORS enabled cho frontend integration
- ✅ Error handling và logging
- ✅ Health check endpoints
- 🔄 Database integration (sẽ thêm)
- 🔄 Authentication (sẽ thêm)

## Development

Service được thiết kế để dễ dàng mở rộng:

1. Thêm AI provider mới trong `steps.py`
2. Mở rộng workflow trong `graph.py`
3. Thêm endpoints mới trong `main.py` 
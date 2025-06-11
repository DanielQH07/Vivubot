# 🌟 VivuBot - AI-Powered Travel Planning Platform

VivuBot là một ứng dụng web thông minh giúp lập kế hoạch du lịch bằng AI, tích hợp GPT/Monica và Google Gemini.

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend        │    │  LangGraph      │
│   React         │◄──►│   Node.js        │    │  Service        │
│   Port: 3000    │    │   Port: 5000     │    │  Port: 8000     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                        ┌──────────────────┐    ┌─────────────────┐
                        │    MongoDB       │    │   Monica.im     │
                        │    Port: 27017   │    │   OpenAI API    │
                        └──────────────────┘    └─────────────────┘
```

## 🚀 Features

- **AI Travel Planning**: Tích hợp GPT-4o qua Monica.im và Google Gemini
- **Smart Itinerary**: Tạo lịch trình chi tiết dựa trên preferences
- **User Management**: Đăng ký, đăng nhập với JWT authentication
- **Travel Database**: Lưu trữ và quản lý các kế hoạch du lịch
- **Modern UI**: React với Chakra UI components

## 📋 Prerequisites

### 🔧 Required Software

1. **Node.js** (v18 hoặc mới hơn)
   - Download: https://nodejs.org/

2. **Python** (v3.9 hoặc mới hơn)
   - Download: https://www.python.org/downloads/

3. **MongoDB Compass** (cho local database)
   - Download: https://www.mongodb.com/try/download/compass

### 🔑 API Keys Required

1. **Monica.im API Key** (cho OpenAI GPT access)
   - Đăng ký tại: https://monica.im/
   - Lấy API key từ dashboard

2. **Google Gemini API Key** (tùy chọn)
   - Tạo tại: https://makersuite.google.com/app/apikey

## 📁 Project Structure

```
VivuBot/
├── backend/                 # Node.js Backend API
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/                # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── langgraph-service/       # Python AI Service
│   ├── app/
│   ├── requirements.txt
│   └── run.py
├── .env                     # Environment variables
└── README.md
```

## 🛠️ Installation & Setup

### Bước 1: Clone Repository

```bash
git clone <repository-url>
cd VivuBot
```

### Bước 2: Cài đặt MongoDB Compass

1. **Download MongoDB Compass**: https://www.mongodb.com/try/download/compass
2. **Cài đặt** theo hướng dẫn
3. **Mở MongoDB Compass**
4. **Connect** với URI: `mongodb://localhost:27017`
5. **Tạo database** tên `vivubot` (tùy chọn, sẽ tự tạo khi chạy)

### Bước 3: Cấu hình Environment Variables

Tạo file `.env` trong thư mục gốc với nội dung:

```env
# Backend Node.js Configuration
JWT_SECRET=vivubot_super_secret_key_2024_make_it_very_long_and_random_12345
PORT=5000

# MongoDB Configuration
MONGODB_URL=mongodb://127.0.0.1:27017
MONGODB_DATABASE=vivubot

# OpenAI/Monica Configuration
OPENAI_BASE_URL=https://openapi.monica.im/v1
OPENAI_API_KEY=your_monica_api_key_here

# Google Gemini Configuration  
GEMINI_API_KEY=your_gemini_api_key_here

# LangGraph Service Configuration
LANGGRAPH_PORT=8000
LANGGRAPH_HOST=0.0.0.0
```

### Bước 4: Setup Backend (Node.js)

```bash
# Cài đặt dependencies
npm install

# Chạy backend server
npm run dev
```

✅ Backend sẽ chạy tại: `http://localhost:5000`

### Bước 5: Setup LangGraph Service (Python)

```bash
# Di chuyển vào thư mục langgraph-service
cd langgraph-service

# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt

# Chạy LangGraph service
python run.py
```

✅ LangGraph Service sẽ chạy tại: `http://localhost:8000`

### Bước 6: Setup Frontend (React)

Mở terminal/CMD mới:

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install
# Cài đặt thêm split pane
npm install react-split split.js

# Chạy frontend development server
npm run dev
```

✅ Frontend sẽ chạy tại: `http://localhost:3000`

## 🎯 Usage

### 1. Truy cập ứng dụng
Mở browser tại: `http://localhost:3000`

### 2. Đăng ký/Đăng nhập
- Tạo tài khoản mới hoặc đăng nhập
- Sử dụng email và password

### 3. Tạo Travel Plan
- Điền thông tin: departure, destination, dates, số người
- Click **"Generate AI Itinerary"** để tạo kế hoạch bằng AI
- Chọn AI provider: GPT (Monica) hoặc Gemini
- Xem kết quả trong modal popup
- Click **"Save Travel Plan"** để lưu vào database

### 4. Quản lý Travel Plans
- Xem danh sách các kế hoạch đã tạo
- Cập nhật hoặc xóa kế hoạch

## 🔧 API Endpoints

### Backend (Port 5000)
- `POST /api/auth/register` - Đăng ký user
- `POST /api/auth/login` - Đăng nhập
- `GET /api/iterator` - Lấy danh sách travel plans
- `POST /api/iterator` - Tạo travel plan mới
- `PUT /api/iterator/:id` - Cập nhật travel plan
- `DELETE /api/iterator/:id` - Xóa travel plan

### LangGraph Service (Port 8000)
- `GET /health` - Health check
- `POST /generate-itinerary` - Tạo kế hoạch du lịch bằng AI
- `GET /docs` - API documentation (FastAPI Swagger)

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Kiểm tra MongoDB service
net start MongoDB

# Hoặc khởi động qua Services.msc
# Tìm "MongoDB Server" → Start
```

### Port Conflicts
```bash
# Kiểm tra port đang sử dụng
netstat -an | findstr :5000
netstat -an | findstr :8000
netstat -an | findstr :3000

# Kill process nếu cần
taskkill /f /im node.exe
taskkill /f /im python.exe
```

### API Key Issues
- Kiểm tra `.env` file có đúng API keys
- Verify Monica.im API key còn valid
- Test API key với Postman trước

### Frontend "Fail to Fetch"
1. Kiểm tra LangGraph service chạy port 8000
2. Test endpoint: `http://localhost:8000/health`
3. Check browser console errors (F12)
4. Verify CORS settings

## 🧪 Testing

### Test Backend API
```bash
# Health check
curl http://localhost:5000/api/iterator

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"123456"}'
```

### Test LangGraph Service
```bash
# Health check
curl http://localhost:8000/health

# Generate itinerary
curl -X POST http://localhost:8000/generate-itinerary \
  -H "Content-Type: application/json" \
  -d '{"text":"Tôi muốn đi du lịch Đà Lạt 3 ngày","ai_provider":"gpt"}'
```

## 📝 Development

### Tech Stack
- **Frontend**: React 19, Chakra UI, Vite
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **AI Service**: Python, FastAPI, LangGraph, OpenAI, Google Gemini
- **Database**: MongoDB
- **Authentication**: JWT

### Development Workflow
1. Make changes to code
2. Services auto-reload (nodemon, uvicorn --reload, vite)
3. Test changes in browser
4. Check logs in terminal

### Adding New Features
1. **Backend**: Add routes in `backend/routes/`, controllers in `backend/controllers/`
2. **Frontend**: Add components in `frontend/src/components/`, pages in `frontend/src/pages/`
3. **AI Service**: Modify workflow in `langgraph-service/app/`

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

Nếu gặp vấn đề:
1. Check troubleshooting section
2. Verify all services running
3. Check logs trong terminal
4. Test với Postman
5. Open GitHub issue with detailed error info

---

**Happy Travel Planning with VivuBot! ✈️🤖**
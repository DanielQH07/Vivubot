# VIVUBOT - Intelligent Chatbot Platform

[English](#english) | [Tiếng Việt](#tiếng-việt)

## English

### Overview
VIVUBOT is a full-stack intelligent chatbot platform that combines modern web technologies with advanced natural language processing capabilities. The platform features a responsive frontend, robust backend API, and an intelligent language processing service.

### Project Structure
```
vivubot/
├── frontend/           # React-based web application
├── backend/           # Node.js/Express API server
├── langgraph-service/ # Python-based language processing service
└── package.json       # Main project configuration
```

### Features
- Modern, responsive web interface
- Real-time chat functionality
- User authentication and authorization
- Intelligent conversation processing
- Map integration with Leaflet
- RESTful API architecture

### Technology Stack
- **Frontend**: React, Vite, React-Leaflet
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Language Processing**: Python-based service
- **Authentication**: JWT (JSON Web Tokens)
- **Maps**: Leaflet

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vivubot.git
cd vivubot
```

2. Install dependencies:
```bash
# Install main project dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install language service dependencies
cd langgraph-service
pip install -r requirements.txt
```

3. Set up environment variables:
Create `.env` files in both backend and langgraph-service directories with appropriate configurations.

4. Start the services:
```bash
# Start backend server
npm run dev

# Start frontend (in a new terminal)
cd frontend
npm run dev

# Start language service (in a new terminal)
cd langgraph-service
python run.py
```

### Development
- Backend API runs on `http://localhost:3000`
- Frontend development server runs on `http://localhost:5173`
- Language service runs on `http://localhost:8000`

### Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### License
This project is licensed under the ISC License.

---

## Tiếng Việt

### Tổng quan
VIVUBOT là một nền tảng chatbot thông minh full-stack kết hợp các công nghệ web hiện đại với khả năng xử lý ngôn ngữ tự nhiên tiên tiến. Nền tảng bao gồm giao diện người dùng phản hồi nhanh, API backend mạnh mẽ và dịch vụ xử lý ngôn ngữ thông minh.

### Cấu trúc Dự án
```
vivubot/
├── frontend/           # Ứng dụng web dựa trên React
├── backend/           # Máy chủ API Node.js/Express
├── langgraph-service/ # Dịch vụ xử lý ngôn ngữ dựa trên Python
└── package.json       # Cấu hình dự án chính
```

### Tính năng
- Giao diện web hiện đại, phản hồi nhanh
- Chức năng chat thời gian thực
- Xác thực và phân quyền người dùng
- Xử lý hội thoại thông minh
- Tích hợp bản đồ với Leaflet
- Kiến trúc API RESTful

### Công nghệ Sử dụng
- **Frontend**: React, Vite, React-Leaflet
- **Backend**: Node.js, Express.js
- **Cơ sở dữ liệu**: MongoDB
- **Xử lý ngôn ngữ**: Dịch vụ dựa trên Python
- **Xác thực**: JWT (JSON Web Tokens)
- **Bản đồ**: Leaflet

### Yêu cầu Hệ thống
- Node.js (phiên bản 14 trở lên)
- Python 3.8+
- MongoDB
- npm hoặc yarn

### Cài đặt

1. Clone repository:
```bash
git clone https://github.com/yourusername/vivubot.git
cd vivubot
```

2. Cài đặt các dependencies:
```bash
# Cài đặt dependencies chính
npm install

# Cài đặt dependencies frontend
cd frontend
npm install

# Cài đặt dependencies dịch vụ ngôn ngữ
cd ../langgraph-service
pip install -r requirements.txt
```

3. Thiết lập biến môi trường:
Tạo file `.env` trong thư mục backend và langgraph-service với các cấu hình phù hợp.

4. Khởi động các dịch vụ:
```bash
# Khởi động server backend
npm run dev

# Khởi động frontend (trong terminal mới)
cd frontend
npm run dev

# Khởi động dịch vụ ngôn ngữ (trong terminal mới)
cd langgraph-service
python run.py
```

### Phát triển
- API Backend chạy trên `http://localhost:3000`
- Server phát triển Frontend chạy trên `http://localhost:5173`
- Dịch vụ ngôn ngữ chạy trên `http://localhost:8000`

### Đóng góp
1. Fork repository
2. Tạo nhánh tính năng của bạn (`git checkout -b feature/TinhNangMoi`)
3. Commit các thay đổi của bạn (`git commit -m 'Thêm một tính năng mới'`)
4. Push lên nhánh (`git push origin feature/TinhNangMoi`)
5. Tạo Pull Request

### Giấy phép
Dự án này được cấp phép theo ISC License.
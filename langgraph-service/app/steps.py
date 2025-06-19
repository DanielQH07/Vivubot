from openai import OpenAI
import google.generativeai as genai
import os
from typing import Dict, Any
import requests
from bs4 import BeautifulSoup
from googlesearch import search
import re

# Initialize AI clients with error handling
try:
    # Support for Monica.im or standard OpenAI
    openai_base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
    openai_api_key = os.getenv("OPENAI_API_KEY")
    
    if openai_api_key:
        openai_client = OpenAI(
            api_key=openai_api_key,
            base_url=openai_base_url
        )
        print(f"✅ OpenAI client initialized with base_url: {openai_base_url}")
    else:
        openai_client = None
        print("⚠️ OPENAI_API_KEY not found, OpenAI client not initialized")
        
except Exception as e:
    print(f"❌ Error initializing OpenAI client: {e}")
    openai_client = None

# Initialize Gemini
try:
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if gemini_api_key:
        genai.configure(api_key=gemini_api_key)
        print("✅ Gemini client initialized")
    else:
        print("⚠️ GEMINI_API_KEY not found, Gemini client not initialized")
except Exception as e:
    print(f"❌ Error initializing Gemini client: {e}")

def extract_destination(input_text: str, client) -> str:
    """Extract destination from input text using OpenAI."""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"Extract the destination from the following text: {input_text}, The result must be a Vietnamese place name written as a single word without accents"}
        ]
    )
    return response.choices[0].message.content

def retrieve_context(destination: str) -> str:
    """Search and retrieve context from Wikivoyage."""
    try:
        query = f"{destination} site:wikivoyage.org"
        urls = list(search(query, num_results=1, stop=1))
        if not urls:
            return ""
        
        url = urls[0]
        response = requests.get(url)
        if response.status_code != 200:
            return ""
            
        soup = BeautifulSoup(response.text, 'html.parser')
        content_div = soup.find('div', id='mw-content-text', class_='mw-body-content')
        if not content_div:
            return ""
            
        return content_div.get_text(strip=True)
    except Exception as e:
        print(f"Error retrieving context: {str(e)}")
        return ""

def rag_retrieve_context(state: Dict[str, Any]) -> Dict[str, Any]:
    """RAG step: extract destination, retrieve context, and add to prompt."""
    user_input = state.get("user_input", "")
    if not user_input:
        return state
    destination = extract_destination(user_input, openai_client)
    context = retrieve_context(destination)
    prompt = state.get("prompt", "")
    if context:
        prompt += f"\n\nContext retrieved for {destination}:\n{context}"
    return {**state, "prompt": prompt}

def preprocess_input(state: Dict[str, Any]) -> Dict[str, Any]:
    """Preprocess user input and prepare prompt, hỗ trợ truyền history chat"""
    user_input = state.get("user_input", "")
    ai_provider = state.get("ai_provider", "gpt")  
    history = state.get("history", [])

    # Format lại history thành đoạn hội thoại
    history_text = ""
    if history and isinstance(history, list):
        for msg in history:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role == "user":
                history_text += f"Người dùng: {content}\n"
            else:
                history_text += f"Bot: {content}\n"
    
    # Prompt có thể chỉnh sửa output bằng cách thay đổi format dưới đây
    prompt = f"""Bạn là một chuyên gia lập kế hoạch du lịch. Hãy tư vấn chi tiết lịch trình vui chơi, ăn uống, địa điểm du lịch, tổng chi tiêu (tóm lại là tư vấn du lịch chi tiết) cho hội thoại sau:

{history_text}Người dùng: {user_input}

QUAN TRỌNG: Nếu đây là cuộc hội thoại tiếp theo (có history), bạn PHẢI:
1. Giữ nguyên format và cấu trúc của lịch trình trước đó
2. Chỉ điều chỉnh các thông tin cần thiết dựa trên yêu cầu mới
3. KHÔNG tạo lại lịch trình mới từ đầu
4. Giữ nguyên các địa điểm không liên quan đến yêu cầu mới

Hãy bao gồm:
- Lịch trình theo ngày
- Địa điểm tham quan
- Gợi ý ăn uống
- Phương tiện di chuyển
- Chi phí ước tính

Cuối cùng, BẮT BUỘC phải thêm một block JSON ở cuối câu trả lời, đúng format sau (KHÔNG GIẢI THÍCH, KHÔNG ĐƯỢC BỎ QUA PHẦN NÀY):

```json
{{
  "route": {{
    "day1": [
      {{"name": "Điểm xuất phát", "latitude": 10.762622, "longitude": 106.660172, "time": "06:00"}},
      {{"name": "Địa điểm 1", "latitude": 11.940419, "longitude": 108.458313, "time": "14:00"}}
    ],
    "day2": [
      {{"name": "Địa điểm ngày 2", "latitude": 11.946463, "longitude": 108.441932, "time": "08:00"}}
    ],
    "day3": [
      {{"name": "Địa điểm ngày 3", "latitude": 11.940419, "longitude": 108.458313, "time": "08:00"}}
    ]
  }}
}}
```

Chỉ cần trả về JSON cho các địa điểm chính, không cần mô tả chi tiết trong JSON.

Lưu ý:
1. Thêm điểm xuất phát cho mỗi ngày (ví dụ: khách sạn, nhà nghỉ)
2. Đảm bảo các địa điểm được sắp xếp theo thứ tự thời gian
3. Trả lời bằng tiếng Việt và KHÔNG hiển thị phần JSON trong phần trình bày phía trên, chỉ để ở cuối câu trả lời
4. Nếu là cuộc hội thoại tiếp theo, PHẢI giữ nguyên format và chỉ điều chỉnh nội dung cần thiết"""
    
    return {
        **state,
        "prompt": prompt
    }

def call_ai(state: Dict[str, Any]) -> Dict[str, Any]:
    """Call AI service based on provider"""
    prompt = state.get("prompt", "")
    ai_provider = state.get("ai_provider", "gpt")
    
    try:
        if ai_provider.lower() == "gpt":
            if openai_client is None:
                raise Exception("OpenAI client not initialized. Check your OPENAI_API_KEY.")
            response = call_gpt(prompt)
        elif ai_provider.lower() == "gemini":
            response = call_gemini(prompt)
        else:
            response = "Unsupported AI provider. Please use 'gpt' or 'gemini'."
        
        return {
            **state,
            "itinerary": response
        }
    except Exception as e:
        return {
            **state,
            "itinerary": f"Error calling AI service: {str(e)}"
        }

def call_gpt(prompt: str) -> str:
    """Call OpenAI GPT API (supports Monica.im)"""
    if openai_client is None:
        raise Exception("OpenAI client not available")
        
    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=2000
    )
    return response.choices[0].message.content

def call_gemini(prompt: str) -> str:
    """Call Google Gemini API"""
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.7,
            max_output_tokens=2000,
        )
    )
    return response.text

def save_result(state: Dict[str, Any]) -> Dict[str, Any]:
    """Save result to database (placeholder for now)"""
    # TODO: Implement MongoDB/database saving logic here
    print(f"Saving to DB (mocked) - Provider: {state.get('ai_provider', 'gpt')}")
    print(f"Input: {state.get('user_input', '')[:50]}...")
    print(f"Output length: {len(state.get('itinerary', ''))}")
    
    return state

def return_output(state: Dict[str, Any]) -> Dict[str, Any]:
    """Return final output"""
    return {
        **state,
        "output": state.get("itinerary", ""),
        "success": True
    } 

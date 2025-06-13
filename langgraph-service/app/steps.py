from openai import OpenAI
import google.generativeai as genai
import os
from typing import Dict, Any

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
    prompt = f"""Bạn là một chuyên gia lập kế hoạch du lịch. Hãy tư vấn chi tiết lịch trình vui chơi, ăn uống, địa điểm du lịch, tổng chi tiêu (tóm lại là tư vấn du lịch chi tiết) cho hội thoại sau:\n\n{history_text}Người dùng: {user_input}\n\nHãy bao gồm:\n- Lịch trình theo ngày\n- Địa điểm tham quan\n- Gợi ý ăn uống\n- Phương tiện di chuyển\n- Chi phí ước tính\n\nCuối cùng, BẮT BUỘC phải thêm một block JSON ở cuối câu trả lời, đúng format sau (KHÔNG GIẢI THÍCH, KHÔNG ĐƯỢC BỎ QUA PHẦN NÀY):\n\n```json\n{{\n  \"route\": {{\n    \"day1\": [\n      {{\"name\": \"Điểm xuất phát\", \"latitude\": 10.762622, \"longitude\": 106.660172, \"time\": \"06:00\"}},\n      {{\"name\": \"Địa điểm 1\", \"latitude\": 11.940419, \"longitude\": 108.458313, \"time\": \"14:00\"}}\n    ],\n    \"day2\": [\n      {{\"name\": \"Địa điểm ngày 2\", \"latitude\": 11.946463, \"longitude\": 108.441932, \"time\": \"08:00\"}}\n    ],\n    \"day3\": [\n      {{\"name\": \"Địa điểm ngày 3\", \"latitude\": 11.940419, \"longitude\": 108.458313, \"time\": \"08:00\"}}\n    ]\n  }}\n}}\n```\n\nChỉ cần trả về JSON cho các địa điểm chính, không cần mô tả chi tiết trong JSON.\n\nLưu ý:\n1. Thêm điểm xuất phát cho mỗi ngày (ví dụ: khách sạn, nhà nghỉ)\n2. Đảm bảo các địa điểm được sắp xếp theo thứ tự thời gian\n3. Trả lời bằng tiếng Việt và KHÔNG hiển thị phần JSON trong phần trình bày phía trên, chỉ để ở cuối câu trả lời."""
    
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

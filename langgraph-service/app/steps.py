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
    """Preprocess user input and prepare prompt"""
    user_input = state.get("user_input", "")
    ai_provider = state.get("ai_provider", "gpt")  
    
    prompt = f"""Bạn là một chuyên gia lập kế hoạch du lịch. Hãy tư vấn chi tiết lịch trình vui chơi, ăn uống, địa điểm du lịch, tổng chi tiêu (tóm lại là tư vấn du lịch chi tiết) cho nội dung sau:

{user_input}

Hãy bao gồm:
- Lịch trình theo ngày
- Địa điểm tham quan
- Gợi ý ăn uống
- Phương tiện di chuyển
- Chi phí ước tính

Trả lời bằng tiếng Việt."""
    
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
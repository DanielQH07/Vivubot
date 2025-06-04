from openai import OpenAI
import google.generativeai as genai
import os
from typing import Dict, Any

# Initialize AI clients
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def preprocess_input(state: Dict[str, Any]) -> Dict[str, Any]:
    """Preprocess user input and prepare prompt"""
    user_input = state.get("user_input", "")
    ai_provider = state.get("ai_provider", "gpt")  # Default to GPT
    
    prompt = f"""Bạn là một chuyên gia lập kế hoạch du lịch. Hãy lên kế hoạch du lịch chi tiết dựa trên yêu cầu sau:

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
    """Call OpenAI GPT API"""
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
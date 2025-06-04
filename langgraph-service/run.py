#!/usr/bin/env python3
"""
Script to run the LangGraph Travel Planning Service
"""

import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    # Get configuration from environment variables
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("LANGGRAPH_PORT", 8000))
    
    print(f"🚀 Starting LangGraph Travel Planning Service...")
    print(f"📍 Server will run on: http://{host}:{port}")
    print(f"📋 API Documentation: http://{host}:{port}/docs")
    print(f"🔍 Health Check: http://{host}:{port}/health")
    
    # Check if API keys are configured
    openai_key = os.getenv("OPENAI_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")
    
    print("\n🔑 API Keys Status:")
    print(f"  OpenAI: {'✅ Configured' if openai_key else '❌ Not configured'}")
    print(f"  Gemini: {'✅ Configured' if gemini_key else '❌ Not configured'}")
    
    if not openai_key and not gemini_key:
        print("\n⚠️  Warning: No API keys configured! Please set OPENAI_API_KEY or GEMINI_API_KEY")
    
    print("\n" + "="*50)
    
    # Run the server
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=True,
        reload_dirs=["app"],
        log_level="info"
    ) 
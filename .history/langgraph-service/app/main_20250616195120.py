from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import logging
import os
from dotenv import load_dotenv
from app.graph import build_travel_graph
from app.routes.route import router as route_router

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Travel Planning Service",
    description="AI-powered travel planning service using LangGraph",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Build the compiled graph
compiled_graph = build_travel_graph()

app.include_router(route_router)

class TravelRequest(BaseModel):
    text: str
    ai_provider: Optional[str] = "gpt"  # "gpt" or "gemini"
    history: Optional[list] = []  # Danh sách các tin nhắn chat

class TravelResponse(BaseModel):
    output: str
    success: bool
    ai_provider: str

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Travel Planning Service is running",
        "status": "healthy",
        "available_providers": ["gpt", "gemini"]
    }

@app.post("/generate-itinerary", response_model=TravelResponse)
async def generate_itinerary(travel_request: TravelRequest):
    """Generate travel itinerary using AI"""
    try:
        logger.info(f"Generating itinerary with provider: {travel_request.ai_provider}")
        
        # Validate AI provider
        if travel_request.ai_provider not in ["gpt", "gemini"]:
            raise HTTPException(
                status_code=400, 
                detail="Invalid AI provider. Use 'gpt' or 'gemini'"
            )
        
        # Invoke the compiled graph
        result = compiled_graph.invoke({
            "user_input": travel_request.text,
            "ai_provider": travel_request.ai_provider,
            "history": travel_request.history or []
        })
        
        return TravelResponse(
            output=result.get("output", ""),
            success=result.get("success", False),
            ai_provider=travel_request.ai_provider
        )
        
    except Exception as e:
        logger.error(f"Error generating itinerary: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/generate-itinerary-legacy")
async def generate_itinerary_legacy(request: Request):
    """Legacy endpoint for backward compatibility"""
    try:
        data = await request.json()
        
        result = compiled_graph.invoke({
            "user_input": data.get("text", ""),
            "ai_provider": data.get("ai_provider", "gpt")
        })
        
        return result
        
    except Exception as e:
        logger.error(f"Error in legacy endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/health")
async def health_check():
    """Detailed health check"""
    import os
    
    health_status = {
        "status": "healthy",
        "services": {
            "langgraph": "connected",
            "openai": "configured" if os.getenv("OPENAI_API_KEY") else "not_configured",
            "gemini": "configured" if os.getenv("GEMINI_API_KEY") else "not_configured"
        }
    }
    
    return health_status

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 
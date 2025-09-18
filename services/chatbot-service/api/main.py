import sys
import os
import logging
import uuid
from typing import Optional
from pathlib import Path

# --- Path Correction ---
# This ensures the API server can find your other modules (core, retrieval).
project_root = Path(__file__).resolve().parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

# --- Third-party Imports ---
try:
    from fastapi import FastAPI, HTTPException
    from pydantic import BaseModel
    import uvicorn
except ImportError as e:
    print(f"Missing required API dependencies: {e}")
    print("Please install with: uv pip install fastapi uvicorn pydantic")
    sys.exit(1)

# --- Local Imports ---
try:
    from core.chatbot import Chatbot
except ImportError as e:
    print(f"Error importing Chatbot module: {e}")
    print("Please ensure you have run 'pip install -e .' from the 'chatbot-service' root directory.")
    sys.exit(1)

# --- Logging Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- API Application Setup ---
app = FastAPI(
    title="Shelf Space AI Chatbot API",
    description="An API for interacting with the RAG-based book recommendation chatbot with memory.",
    version="1.1.0"
)

# --- Global Chatbot Instance ---
# The chatbot is initialized once when the API starts up (the "cold start").
try:
    chatbot = Chatbot()
except Exception as e:
    logger.error(f"FATAL: Could not initialize the Chatbot. The API will be in a degraded state. Error: {e}", exc_info=True)
    chatbot = None

# --- Pydantic Models for API Data Structure ---
class ChatQuery(BaseModel):
    query: str
    session_id: Optional[str] = None
    
class ChatResponse(BaseModel):
    answer: str
    session_id: str

# --- API Endpoints ---

@app.post("/chat", response_model=ChatResponse)
async def handle_chat_query(request: ChatQuery):
    """
    Main endpoint for chat, with session management for conversation history.
    """
    if not chatbot:
        raise HTTPException(status_code=503, detail="Service Unavailable: Chatbot is not operational.")

    # Manage session ID for conversation continuity
    session_id = request.session_id or str(uuid.uuid4())
    logger.info(f"Received query: '{request.query}' for session_id: {session_id}")
    
    try:
        # Pass both query and session_id to the chatbot's brain
        response_text = chatbot.generate_response(request.query, session_id)
        
        # Return the answer and the session_id so the client can continue the conversation
        return ChatResponse(answer=response_text, session_id=session_id)
    except Exception as e:
        logger.error(f"An error occurred while generating response: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal error occurred.")

@app.get("/health")
def health_check():
    """A simple endpoint for monitoring to check if the API is running."""
    if chatbot:
        return {"status": "ok", "message": "Chatbot is operational."}
    else:
        return {"status": "degraded", "message": "Chatbot failed to initialize."}

# --- Server Execution ---
if __name__ == "__main__":
    logger.info("Starting the FastAPI server for local testing...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


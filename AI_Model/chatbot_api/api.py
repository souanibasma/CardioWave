from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

from context_builder import build_system_prompt
from llm_service import call_llm

app = FastAPI(title="ECG Chatbot API")

# =========================
# Request Schema
# =========================
class ChatRequest(BaseModel):
    message: str
    aiResult: dict
    doctorNotes: Optional[str] = ""
    patient: Optional[dict] = {}
    history: Optional[List[dict]] = []  # [{role, content}]

# =========================
# Response Schema
# =========================
class ChatResponse(BaseModel):
    reply: str

# =========================
# Health check
# =========================
@app.get("/")
def root():
    return {"status": "ECG Chatbot API running 🚀"}

# =========================
# Chat Endpoint
# =========================
@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    try:
        # 1. Build system prompt from ECG context
        system_prompt = build_system_prompt(
            ai_result=req.aiResult,
            doctor_notes=req.doctorNotes,
            patient=req.patient
        )

        # 2. Build messages list
        messages = [
            {"role": "system", "content": system_prompt}
        ]

        # add history if exists
        if req.history:
            messages.extend(req.history)

        # add current user message
        messages.append({
            "role": "user",
            "content": req.message
        })

        # 3. Call LLM
        response = call_llm(messages)

        return ChatResponse(reply=response)

    except Exception as e:
        return ChatResponse(reply=f"Error: {str(e)}")
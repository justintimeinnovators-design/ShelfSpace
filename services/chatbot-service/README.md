# chatbot-service

Python FastAPI service for RAG-based book recommendation and conversational support.

## Responsibilities

- Accept chat prompts and maintain session-aware responses
- Use vector retrieval (Pinecone) and prompt orchestration
- Emit optional analytics events

## Runtime

- Default port: `8000`
- Health endpoint: `/health`
- Main chat endpoint: `POST /chat`

## Key Modules

- `api/main.py`: FastAPI app and endpoints
- `core/chatbot.py`: chatbot orchestration
- `retrieval/`: embedding/vector retrieval integrations
- `scripts/load_vectors.py`: vector ingestion support

## Environment Variables

- `PORT` (default `8000`)
- `PINECONE_API_KEY`
- `PINECONE_ENV`
- `PINECONE_INDEX_NAME` (default `shelfspace-books`)
- `ANALYTICS_SERVICE_URL` (optional)

Example file: `.env.example`

## Local Development

```bash
pip install -r requirements.txt
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```

## Docker

Uses `services/chatbot-service/Dockerfile` (Python 3.11 slim).


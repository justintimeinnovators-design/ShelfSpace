import sys
import os
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).resolve().parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

current_dir = Path(__file__).resolve().parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))


import logging
import json
from typing import List, Dict, Any, AsyncGenerator, Optional
from collections import defaultdict

try:
    from dotenv import load_dotenv
    from langchain_google_genai import ChatGoogleGenerativeAI
    from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
    from langchain_core.runnables import RunnablePassthrough, RunnableLambda
except ImportError as e:
    print(f"Missing required packages: {e}")
    print(f"Install dependencies with: uv pip install python-dotenv, google-generative-ai, JsonOutputParser, StrOutputParser, RunnablePassthrough, RunnableLambda")
    exit(1)

from retrieval.embedding import EmbeddingGenerator
from retrieval.vector_db2 import PineconeConnector
from prompts import get_decomposer_prompt, get_synthesis_prompt

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class Chatbot:
    def __init__(self):
        logger.info("Initializaing the Chatbot Engine...")
        load_dotenv()

        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not gemini_api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables.")
        
        model_name = os.getenv("GEMINI_MODEL")
        self.llm = ChatGoogleGenerativeAI(model=model_name, google_api_key=gemini_api_key, convert_system_message_to_human=True)

        logger.info("LangChain Google Gemini LLM configured.")

        index_name = os.getenv("PINECONE_INDEX_NAME")
        self.embedder = EmbeddingGenerator()
        self.vector_db = PineconeConnector(
            index_name=index_name,
            dimension=self.embedder.dimension
        )

        logger.info("All retrieval components initialized.")

        self.histories = defaultdict(list)

        # self.histories = defaultdict(lambda: {"messages": [], "active_work_id": None})

        self.rag_chain = self._build_rag_chain()
        logger.info("The Chatbot Engine is operational and ready for commands.")
    
    def _format_history(self, messages: List[Dict]) -> str:
        """Helper function to format chat history into a readable string for the prompt."""
        if not messages:
            return "No previous conversation."
        return "\n".join([f"{msg['role'].capitalize()}: {msg['content']}" for msg in messages])
    
    def _build_rag_chain(self):
        decomposer_chain = (
            RunnableLambda(lambda x: {
                "user_query": x["user_query"] if isinstance(x, dict) else x,
                "chat_history": x.get("chat_history", "") if isinstance(x, dict) else ""
            })
            | get_decomposer_prompt()
            | self.llm
            | JsonOutputParser()
        )

        retriever_lambda = RunnableLambda(self._retrieve_context_from_tasks)

        final_chain = (
            RunnableLambda(lambda x: {
                "decomposer_input": {
                    "user_query": x["user_query"] if isinstance(x, dict) else x,
                    "chat_history": x.get("chat_history", "") if isinstance(x, dict) else ""
                },
                "user_query": x["user_query"] if isinstance(x, dict) else x,
                "chat_history": x.get("chat_history", "") if isinstance(x, dict) else ""
            })
            | RunnablePassthrough.assign(
                tasks=lambda x: decomposer_chain.invoke(x["decomposer_input"])
            )
            | RunnablePassthrough.assign(
                context=retriever_lambda
            )
            | RunnableLambda(lambda x: {
                "user_query": x["user_query"],
                "chat_history": self._format_history(x["chat_history"]),
                "context": x["context"]
            })
            | get_synthesis_prompt()
            | self.llm
            | StrOutputParser()
        )

        return final_chain
        
    def _retrieve_context_from_tasks(self, chain_input: Dict) -> str:
        tasks = chain_input['tasks']
        all_retrieved_texts = []
        retrieved_chunk_ids = set()

        for task in tasks:
            sub_query = task.get('sub_query')
            intent = task.get('intent')

            logger.info(f"sub_query: {sub_query}")
            logger.info(f"intent: {intent}")

            if not sub_query or not intent:
                logger.error(f"No sub-query or intent")
                continue

            logger.info(f"Retrieving context for sub-query: '{sub_query}' (Intent: {intent})")

            query_vector = self.embedder.embed_query(sub_query)
            filter_dict = {"intent_relevance": {"$in": [intent]}}

            search_results = self.vector_db.search(
                query_vector = query_vector,
                top_k = 5,
                additional_filters = filter_dict,
                intent=intent
            )

            logger.info(search_results)

            for match in search_results:
                chunk_id = match.get('id')
                if chunk_id and chunk_id not in retrieved_chunk_ids:
                    text = match.get('metadata', {}).get('text', '')
                    if text:
                        all_retrieved_texts.append(f"--- Context Chunk: {chunk_id} ---\n{text}\n")
                        retrieved_chunk_ids.add(chunk_id)

        logger.info(f"Retrieved {len(all_retrieved_texts)} unique context chunks.")
        return "\n".join(all_retrieved_texts)
        
    def generate_response(self, user_query: str, session_id: str) -> str:
        logger.info("Invoking the RAG chain...")

        chat_history = self.histories[session_id]    

        try:
            chain_input = {"user_query": user_query, "chat_history": chat_history}
            final_answer = self.rag_chain.invoke(chain_input)

            self.histories[session_id].append({"role": "user", "content": user_query})
            self.histories[session_id].append({"role": "ai", "content": final_answer})

            logger.info("Successfully generated final answer.")
            return final_answer
        except Exception as e:
            logger.error(f"Error during RAG chain invocation: {e}", exc_info=True)
            return "I apologize, but I encountered an error while crafting a response. Please try again."
        
    async def stream_response(self, user_query: str, session_id: str) -> AsyncGenerator[str, None]:
        session_data = self.histories[session_id]
        chain_input = {
            'user_query': user_query,
            'chat_history': session_data['messages']
        }
        full_response = []

        try:
            async for chunk in self.rag_chain.astream(chain_input):
                full_response.append(chunk)
                yield chunk
        finally:
            final_answer = "".join(full_response)

            decomposed_tasks = self.decomposer_chain.invoke(chain_input)
            retrieval_result = self._retrieve_context({"tasks": decomposed_tasks})
            # new_active_work_id = retrieval_result['new_active_work_id']

            session_data["messages"].append({"role": "user", "content": user_query})
            session_data["messages"].append({"role": "ai", "content": final_answer})
            # if new_active_work_id:
            #     session_data["active_work_id"] = new_active_work_id
            logger.info(f"Stream complete. History updated for session {session_id}.")


if __name__ == '__main__':
    chatbot = Chatbot()
    session_id = "test_session_123"
    
    query1 = "Tell me about the book 'Wuthering Heights'"
    print("\n" + "="*50)
    print(f"USER: {query1}")
    response1 = chatbot.generate_response(query1, session_id)
    print(f"AI: {response1}")
    print("="*50)

    query2 = "Is it a good book for a beginner?"
    print("\n" + "="*50)
    print(f"USER: {query2}")
    response2 = chatbot.generate_response(query2, session_id)
    print(f"AI: {response2}")
    print("="*50)

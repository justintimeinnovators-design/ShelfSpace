import sys
import os
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))


import logging
import json
from typing import List, Dict, Any

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
from retrieval.vector_db import PineconeConnector
from prompts import DECOMPOSER_PROMPT_TEMPLATE, SYNTHESIS_PROMPT_TEMPLATE

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
        self.llm = ChatGoogleGenerativeAI(model=model_name, google_api_key=gemini_api_key)

        logger.info("LangChain Google Gemini LLM configured.")

        index_name = os.getenv("PINECONE_INDEX_NAME")
        self.embedder = EmbeddingGenerator()
        self.vector_db = PineconeConnector(
            index_name=index_name,
            dimension=self.embedder.dimension
        )

        logger.info("All retrieval components initialized.")

        self.rag_chain = self._build_rag_chain()
        logger.info("The Chatbot Engine is operational and ready for commands.")
    
    def _build_rag_chain(self):
        decomposer_chain = (
            RunnableLambda(lambda x: {"user_query": x})
            | DECOMPOSER_PROMPT_TEMPLATE
            | self.llm
            | JsonOutputParser()
        )

        retriever_lambda = RunnableLambda(self._retrieve_context_from_tasks)

        final_chain = (
            {"tasks" : decomposer_chain, "user_query" : RunnablePassthrough()}
            | RunnablePassthrough.assign(context=retriever_lambda)
            | SYNTHESIS_PROMPT_TEMPLATE
            | self.llm
            | StrOutputParser()
        )

        return final_chain
        
    def _retrieve_context_from_tasks(self, chain_input: Dict) -> str:
        tasks = chain_input['tasks']
        all_retrieved_texts = []
        retrieved_chunk_ids = set()

        for task in tasks:
            sub_query = task['sub_query']
            intent = task['intent']

            logger.info(f"Retrieving context for sub-query: '{sub_query}' (Intent: {intent})")

            query_vector = self.embedder.embed_query(sub_query)
            filter_dict = {"intent_relevance": {"$in": [intent]}}

            search_results = self.vector_db.search(
                query_vector = query_vector,
                top_k = 3,
                filter_dict = filter_dict
            )

            logger.info(search_results)

            for match in search_results:
                chunk_id = match['chunk_id']
                if chunk_id not in retrieved_chunk_ids:
                    text = match.get('metadata', {}).get('text', '')
                    all_retrieved_texts.append(f"--- Context Chunk: {chunk_id} ---\n{text}\n")
                    retrieved_chunk_ids.add(chunk_id)

        logger.info(f"Retrieved {len(all_retrieved_texts)} unique context chunks.")
        return "\n".join(all_retrieved_texts)
        
    def generate_response(self, user_query: str) -> str:
        logger.info("Invoking the RAG chain...")    

        try:
            final_answer = self.rag_chain.invoke(user_query)
            logger.info("Successfully generated final answer.")
            return final_answer
        except Exception as e:
            logger.error(f"Error during RAG chain invocation: {e}", exc_info=True)
            return "I apologize, but I encountered an error while crafting a response. Please try again."

if __name__ == '__main__':
    logger.info("--- Running LangChain Chatbot Core Self-Test ---")
    
    try:
        chatbot = Chatbot()
        test_query = "Find me a popular but easy-to-read book like Best Friends Forever, and tell me about its main themes."
        
        print("\n" + "="*50)
        logger.info(f"TESTING COMPLEX QUERY: '{test_query}'")
        
        final_answer = chatbot.generate_response(test_query)
        
        print("\n--- FINAL CHATBOT RESPONSE ---")
        print(final_answer)
        print("="*50)

    except Exception as e:
        logger.error(f"An error occurred during the self-test: {e}", exc_info=True)



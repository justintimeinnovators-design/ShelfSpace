import os
import logging
from typing import List, Dict, Optional
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

try:
    from pinecone import Pinecone, ServerlessSpec
    from dotenv import load_dotenv
    from embedding import EmbeddingGenerator
except ImportError as e:
    print(f"Missing required package: {e}")
    print("Install dependencies with: uv pip install pinecone-client python-dotenv sentence-transformers torch")
    exit(1)

logging.basicConfig(level=logging.INFO, format='%{asctime}s - %{levelname}s - %{message}s')
logger = logging.getLogger(__name__)

class PineconeConnector:
    def __init__(self, index_name: str, dimension: int):
        load_dotenv()
        api_key = os.getenv("PINECONE_API_KEY")

        if not api_key:
            error_msg = "PINECONE_API_KEY not found in environment variables."
            logger.error(error_msg)
            raise ValueError(error_msg)
        
        logger.info(f"Initializaing Pinecone connection for index {index_name}")
        self.pc = Pinecone(api_key=api_key)
        self.index_name = index_name

        if index_name not in self.pc.list_indexes().names():
            logger.error(f"Index {index_name} not found.")
        else:
            logger.info(f"Found Index {index_name}.")

        self.index = self.pc.Index(index_name)
        logger.info(f"Connection to Index {index_name} established.")
        logger.info(self.index.describe_index_stats())

    def search(self, query_vector: List[float], top_k: int = 5, filter_dict: Optional[Dict] = None) -> List[Dict]:
        if not query_vector:
            logger.warning("Search called with an empty query vector.")
            return []
        
        logger.info(f"Searching index for {top_k} results...")
        fetch_k = top_k * 5
        logger.info(f"Searching for {fetch_k} candidates to find {top_k} unique works...")
        try:
            results = self.index.query(
                vector=query_vector,
                top_k=top_k,
                filter=filter_dict,
                include_metadata = True
            )

            best_candidates = {}

            for match in results['matches']:
                metadata = match.get('metadata', {})
                work_id = metadata.get('work_id')
                
                if not work_id:
                    continue 

                current_ratings = metadata.get('total_ratings', 0)

                
                if work_id not in best_candidates or current_ratings > best_candidates[work_id].get('metadata', {}).get('total_ratings', 0):
                    best_candidates[work_id] = match

            final_results = list(best_candidates.values())

            final_results.sort(key=lambda m: m['score'], reverse=True)

            
            logger.info(f"Found {len(final_results)} unique works. Returning the top {top_k}.")
            return final_results[:top_k]
        
        except Exception as e:
            logger.error(f"An error occurred during Pinecone query: {e}")
            return []

if __name__ == '__main__':
    logger.info("--- Running PineconeConnector Self-Test ---")

    try:
        embedder = EmbeddingGenerator()
        dimension = embedder.dimension
    except Exception as e:
        logger.error("Could not initialize EmbeddingGenerator. Make sure embedding.py is present.")
        exit(1)
    
    try:
        vector_db = PineconeConnector(
            index_name="book-chunks",
            dimension=dimension
        )
    except Exception as e:
        logger.error(f"Initialization failed: {e}")
        exit(1)

    test_query = "Describe the book Crime and Punishment by Fyodor Dostoyevsky?"
    test_vector = embedder.embed_query(test_query)
    logger.info(f"Created test vector for query: \"{test_query}\"")

    search_results = vector_db.search(query_vector=test_vector)

    print("\n--- TEST RESULTS ---")
    if search_results:
        print("Successfully retrieved results from Pinecone:")
        for match in search_results:
            metadata = match.get('metadata', {})
            text_content = metadata.get('text', 'No text content found.')
            
            print(f"\n--- Match ---")
            print(f"  - ID: {match['id']}")
            print(f"  - Score: {match['score']:.4f}")
            print(f"  - Text: {text_content}...")
    else:
        print("Search completed. No results found.")

    print("\nSelf-test complete. The Pinecone Connection is operational.")
import os
import logging
from typing import List, Dict, Optional
import sys
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent
current_dir = Path(__file__).resolve().parent

if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

print(f"Project root: {project_root}")
print(f"Current directory: {current_dir}")
print(f"Looking for embedding.py in: {current_dir / 'embedding.py'}")
print(f"Embedding file exists: {(current_dir / 'embedding.py').exists()}")

try:
    from pinecone import Pinecone
    from dotenv import load_dotenv
    from embedding import EmbeddingGenerator
except ImportError as e:
    print(f"Missing required package: {e}")
    exit(1)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class PineconeConnector:

    def __init__(self, index_name: str, dimension: int):
        load_dotenv()
        api_key = os.getenv("PINECONE_API_KEY")
        if not api_key:
            raise ValueError("PINECONE_API_KEY not found in environment variables.")

        logger.info(f"Initializing Pinecone connection for index '{index_name}'...")
        self.pc = Pinecone(api_key=api_key)
        self.index_name = index_name

        if index_name not in self.pc.list_indexes().names():
            logger.warning(f"Index '{index_name}' not found.")
        else:
            logger.info(f"Found existing Pinecone index '{index_name}'.")

        self.index = self.pc.Index(index_name)
        logger.info(f"✅ Connection to index '{index_name}' established.")
        stats = self.index.describe_index_stats()
        logger.info(f"Index Stats: {stats}")

    def search_for_specific_book(self, query_vector: List[float], top_k: int, filter_dict: Optional[Dict] = None) -> List[Dict]:

        fetch_k = top_k * 5
        
        results = self.index.query(
            vector=query_vector,
            top_k=fetch_k,
            filter=filter_dict,
            include_metadata=True
        )
        matches = results.get('matches', [])
        if not matches:
            return []

        anchor_work_id = matches[0].get('metadata', {}).get('work_id')
        if not anchor_work_id:
            logger.warning("Top search result missing work_id")
            return matches[:top_k]

        focused_results = [match for match in matches if match.get('metadata', {}).get('work_id') == anchor_work_id]

        final_results = sorted(focused_results, key=lambda m: m.get('metadata', {}).get('total_ratings', 0), reverse=True)

        logger.info(f"Anchored on work_id '{anchor_work_id}'. Found {len(focused_results)} related chunks.")
        return final_results[:top_k]

    def search_for_discovery(self, query_vector: List[float], top_k: int, filter_dict: Optional[Dict] = None) -> List[Dict]:
        fetch_k = top_k * 10
        
        results = self.index.query(
            vector=query_vector,
            top_k=fetch_k,
            filter=filter_dict,
            include_metadata=True
        )
        
        best_candidates = {}
        for match in results.get('matches', []):
            metadata = match.get('metadata', {})
            work_id = metadata.get('work_id')
            if not work_id: continue

            current_ratings = metadata.get('total_ratings', 0)
            if work_id not in best_candidates or current_ratings > best_candidates[work_id].get('metadata', {}).get('total_ratings', 0):
                best_candidates[work_id] = match
        
        final_results = sorted(best_candidates.values(), key=lambda m: m["metadata"]["total_ratings"], reverse=True)
        return final_results[:10]
    
    
    def search_for_comparison(self, query_vector: List[float], top_k: int, filter_dict: Optional[Dict] = None) -> List[Dict]:
        fetch_k = top_k * 10
        
        results = self.index.query(
            vector=query_vector,
            top_k=fetch_k,
            filter=filter_dict,
            include_metadata=True
        )

        best_candidates = []
        best_candidates_work_ids = []

        for match in results.get('matches', []):
            metadata = match.get('metadata', {})
            work_id = metadata.get('work_id')
            if not work_id: continue

            current_ratings = metadata.get('total_ratings', 0)
            if len(best_candidates_work_ids)<2 or work_id in best_candidates_work_ids:
                if len(best_candidates_work_ids)<2:
                    best_candidates_work_ids.append(work_id)
                best_candidates.append(match)
        
        final_results = sorted(best_candidates, key=lambda m: m['score'], reverse=True)
        return final_results[:8]

    def search(self, query_vector: List[float], intent: str, top_k: int = 5, additional_filters: Optional[Dict] = None) -> List[Dict]:
        logger.info(f"Executing search for intent: '{intent}' with top_k={top_k}")
        
        base_filter = {"intent_relevance": {"$in": [intent]}}
        filter_dict = {"$and": [base_filter, additional_filters]} if additional_filters else base_filter

        filter_dict = additional_filters

        try:
            if intent in ["quick", "detailed", "recommend"]:
                logger.info("Getting books not for discovery!!!")
                return self.search_for_specific_book(query_vector, top_k, filter_dict)
            elif intent == "discover":
                logger.info("Getting books for discovery!!!")
                return self.search_for_discovery(query_vector, top_k, filter_dict)
            elif intent ==  "compare":
                logger.info("Getting books for comparison!!!")
                return self.search_for_comparison(query_vector, top_k, filter_dict)
            else:
                logger.warning(f"Unknown intent '{intent}', using default search.")
                return self._search_for_specific_book(query_vector, top_k, filter_dict)
        except Exception as e:
            logger.error(f"An error occurred during Pinecone query for intent '{intent}': {e}", exc_info=True)
            return []


if __name__ == '__main__':
    logger.info("--- Running Simplified PineconeConnector Test ---")

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

    test_cases = [
        {
            "query": "Who is the author of Dune?",
            "intent": "quick"
        },
        {
            "query": "Tell me everything about the plot of Project Hail Mary",
            "intent": "detailed"
        },
        {
            "query": "Is 'The Hobbit' a good read for a beginner in fantasy?",
            "intent": "recommend"
        },
        {
            "query": "Suggest a thought-provoking sci-fi novel about identity",
            "intent": "discover"
        },
        {
            "query": "Compare Crime and Punishment with The Brothers Karamazov",
            "intent": "compare"
        }
    ]

    for i, test_case in enumerate(test_cases, 1):
        print(f"\n{'='*70}")
        print(f"TEST {i} - {test_case['intent'].upper()} INTENT")
        print(f"Query: {test_case['query']}")
        print('='*70)
        
        test_vector = embedder.embed_query(test_case['query'])
        results = vector_db.search(
            query_vector=test_vector,
            intent=test_case['intent']
        )

        if results:
            print(f"Results ({len(results)} chunks):")
            for j, match in enumerate(results, 1):
                metadata = match.get('metadata', {})
                text_content = metadata.get('text', '')
                
                print(f"\n--- Result {j} ---")
                print(f"  - ID: {match['id']}")
                print(f"  - Work ID: {metadata.get('work_id', 'N/A')}")
                print(f"  - Chunk Type: {metadata.get('chunk_type', 'N/A')}")
                print(f"  - Score: {match['score']:.4f}")
                
                for key, value in metadata.items():
                    # Truncate the 'text' field for readability in the console
                    if key == 'text' and isinstance(value, str) and len(value) > 300:
                        print(f"    - {key}: {value[:300].strip()}...")
                    else:
                        print(f"    - {key}: {value}")
        else:
            print("No results found.")
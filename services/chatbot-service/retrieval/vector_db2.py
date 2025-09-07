import os
import logging
from typing import List, Dict, Optional
import sys
from pathlib import Path

# --- Path Correction ---
project_root = Path(__file__).resolve().parent.parent
current_dir = Path(__file__).resolve().parent

# Add both project root and current directory to path
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

print(f"Project root: {project_root}")
print(f"Current directory: {current_dir}")
print(f"Looking for embedding.py in: {current_dir / 'embedding.py'}")
print(f"Embedding file exists: {(current_dir / 'embedding.py').exists()}")

# --- Third-party Imports ---
try:
    from pinecone import Pinecone
    from dotenv import load_dotenv
    # Corrected import path to be relative to the project root
    from embedding import EmbeddingGenerator
except ImportError as e:
    print(f"Missing required package: {e}")
    exit(1)

# --- Logging Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class PineconeConnector:
    """
    Handles interactions with Pinecone.
    FINAL VERSION: Implements different retrieval strategies based on user intent
    to ensure accuracy for specific queries and diversity for discovery queries.
    """

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

    def _search_for_specific_book(self, query_vector: List[float], top_k: int, filter_dict: Optional[Dict] = None) -> List[Dict]:
        """
        Tactic for specific queries (quick, detailed, recommend).
        Finds the single most relevant book and returns only chunks related to it.
        """
        # Over-fetch to get a good pool of candidates
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

        # --- The "Anchor and Filter" Tactic ---
        # 1. Anchor: The top result is our best guess for the correct book.
        anchor_work_id = matches[0].get('metadata', {}).get('work_id')
        if not anchor_work_id:
            logger.warning("Top search result missing work_id, cannot de-duplicate effectively.")
            return matches[:top_k] # Fallback to returning top results

        # 2. Filter: Gather all other chunks that belong to the SAME anchor work.
        focused_results = [match for match in matches if match.get('metadata', {}).get('work_id') == anchor_work_id]

        logger.info(f"Anchored on work_id '{anchor_work_id}'. Found {len(focused_results)} related chunks.")
        return focused_results[:top_k]

    def _search_for_discovery(self, query_vector: List[float], top_k: int, filter_dict: Optional[Dict] = None) -> List[Dict]:
        """
        Tactic for discovery queries.
        Ensures a diverse set of books is returned by de-duplicating by work_id.
        """
        fetch_k = top_k * 10 # Fetch even more for diversity
        
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
        
        final_results = sorted(best_candidates.values(), key=lambda m: m['score'], reverse=True)
        return final_results[:top_k]

    def search(self, query_vector: List[float], intent: str, top_k: int = 5, additional_filters: Optional[Dict] = None) -> List[Dict]:
        """
        The main unified search function. Acts as a router, deploying the
        correct retrieval tactic based on the user's intent.
        """
        logger.info(f"Executing search for intent: '{intent}' with top_k={top_k}")
        
        # base_filter = {"intent_relevance": {"$in": [intent]}}
        # filter_dict = {"$and": [base_filter, additional_filters]} if additional_filters else base_filter

        filter_dict = additional_filters

        try:
            if intent in ["quick", "detailed", "recommend", "compare"]:
                return self._search_for_specific_book(query_vector, top_k, filter_dict)
            elif intent == "discover":
                return self._search_for_discovery(query_vector, top_k, filter_dict)
            else:
                logger.warning(f"Unknown intent '{intent}', using default search.")
                return self._search_for_specific_book(query_vector, top_k, filter_dict)
        except Exception as e:
            logger.error(f"❌ An error occurred during Pinecone query for intent '{intent}': {e}", exc_info=True)
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

    # Test cases
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
            "intent": "compare" # Note: This will be handled by the specialized block below
        }
    ]

    for i, test_case in enumerate(test_cases, 1):
        if test_case['intent'] == 'compare':
            continue # Skip the compare case in this loop

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

    # # Test compare intent
    # print(f"\n{'='*70}")
    # print("TEST 5 - COMPARE INTENT")
    # print("Queries: 'Crime and Punishment' vs 'The Brothers Karamazov'")
    # print('='*70)
    
    # query1 = "Crime and Punishment"
    # query2 = "The Brothers Karamazov"
    # vector1 = embedder.embed_query(query1)
    # vector2 = embedder.embed_query(query2)
    
    # compare_results = vector_db.search(
    #     query_vector=vector1,
    #     intent="compare",
    #     query_vector_2=vector2
    # )
    
    # if compare_results:
    #     print(f"Compare Results ({len(compare_results)} chunks):")
    #     work_groups = {}
    #     for match in compare_results:
    #         work_id = match.get('metadata', {}).get('work_id', 'Unknown')
    #         if work_id not in work_groups:
    #             work_groups[work_id] = []
    #         work_groups[work_id].append(match)
        
    #     for work_id, chunks in work_groups.items():
    #         print(f"\n📚 Work ID: {work_id} ({len(chunks)} chunks)")
    #         for chunk in chunks:
    #             metadata = chunk.get('metadata', {})
    #             chunk_type = metadata.get('chunk_type', 'N/A')
    #             rating_info = vector_db.extract_rating_info(metadata.get('text', ''))
    #             rating_text = f" ({rating_info['ratings_count']:,} ratings)" if rating_info else ""
    #             print(f"  - {chunk_type}{rating_text}")
    # else:
    #     print("No compare results found.")

    # print(f"\n{'='*70}")
    # print("Self-test complete!")
    # print('='*70)
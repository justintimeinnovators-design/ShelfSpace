import os
import logging
from typing import List, Dict, Optional, Tuple
import sys
import re
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

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class PineconeConnector:
    def __init__(self, index_name: str, dimension: int):
        load_dotenv()
        api_key = os.getenv("PINECONE_API_KEY")

        if not api_key:
            error_msg = "PINECONE_API_KEY not found in environment variables."
            logger.error(error_msg)
            raise ValueError(error_msg)
        
        logger.info(f"Initializing Pinecone connection for index {index_name}")
        self.pc = Pinecone(api_key=api_key)
        self.index_name = index_name

        if index_name not in self.pc.list_indexes().names():
            logger.error(f"Index {index_name} not found.")
        else:
            logger.info(f"Found Index {index_name}.")

        self.index = self.pc.Index(index_name)
        logger.info(f"Connection to Index {index_name} established.")
        logger.info(self.index.describe_index_stats())

        # All possible chunk types (every book has these 6)
        self.all_chunk_types = ['overview', 'detailed', 'experience', 'discovery', 'themes', 'similar']

    # def create_intent_filter(self, intent: str, additional_filters: Optional[Dict] = None) -> Dict:
    #     """Create Pinecone filter for intent-based search"""
    #     intent_filter = {
    #         "intent_relevance": {"$in": [intent]}
    #     }
        
    #     if additional_filters:
    #         combined_filter = {
    #             "$and": [intent_filter, additional_filters]
    #         }
    #         return combined_filter
        
    #     return intent_filter


    def get_most_relevant_work_id(self, query_vector: List[float], intent: str, 
                                 additional_filters: Optional[Dict] = None) -> Optional[str]:
        """
        Get the most relevant work_id for a query
        
        Returns:
            work_id of the highest-scoring chunk, or None if no results
        """
        filter_dict = self.create_intent_filter(intent, additional_filters)
        
        try:
            results = self.index.query(
                vector=query_vector,
                top_k=1,  # Only need the top result to get work_id
                filter=filter_dict,
                include_metadata=True
            )
            
            matches = results.get('matches', [])
            if matches:
                work_id = matches[0].get('metadata', {}).get('work_id')
                score = matches[0]['score']
                logger.info(f"Most relevant work_id: {work_id} (score: {score:.4f})")
                return work_id
            else:
                logger.warning(f"No matches found for intent '{intent}'")
                return None
                
        except Exception as e:
            logger.error(f"Error getting most relevant work_id: {e}")
            return None

    def get_chunks_for_work(self, work_id: str, chunk_types: List[str], 
                           intent: str, additional_filters: Optional[Dict] = None) -> List[Dict]:
        """
        Get specific chunk types for a work_id, prioritizing by rating_count
        
        Args:
            work_id: The work to get chunks for
            chunk_types: List of chunk types to retrieve (e.g., ['overview', 'detailed'])
            intent: Intent for filtering
            additional_filters: Additional filters
            
        Returns:
            List of chunks, one per chunk_type (if available)
        """
        # Create filter for this specific work and intent
        work_filter = {
            "work_id": work_id,
        }
        
        if additional_filters:
            work_filter.update(additional_filters)
        
        intent_filter = self.create_intent_filter(intent, work_filter)
        
        try:
            # Fetch more chunks to ensure we get all needed chunk types
            results = self.index.query(
                vector=[0] * 384,  # Dummy vector since we're filtering by work_id
                top_k=20,  # Should be enough to get all chunk types for one work
                filter=intent_filter,
                include_metadata=True
            )
            
            matches = results.get('matches', [])
            logger.info(f"Found {len(matches)} chunks for work_id {work_id}")
            
            # Group by chunk_type
            chunk_groups = {}
            for match in matches:
                chunk_type = match.get('metadata', {}).get('chunk_type')
                if chunk_type in chunk_types:
                    if chunk_type not in chunk_groups:
                        chunk_groups[chunk_type] = []
                    chunk_groups[chunk_type].append(match)
            
            # Select best chunk from each type (highest rating_count)
            selected_chunks = []
            for chunk_type in chunk_types:
                if chunk_type in chunk_groups:
                    chunks = chunk_groups[chunk_type]
                    # Sort by rating_count (extract from text), then by score
                    chunks.sort(key=lambda x: (
                        self.extract_rating_count(x.get('metadata', {}).get('text', '')),
                        x['score']
                    ), reverse=True)
                    
                    selected_chunks.append(chunks[0])
                    rating_count = self.extract_rating_count(chunks[0].get('metadata', {}).get('text', ''))
                    logger.info(f"Selected {chunk_type} chunk: {chunks[0]['id']} "
                               f"(rating_count: {rating_count:,}, score: {chunks[0]['score']:.4f})")
                else:
                    logger.warning(f"No {chunk_type} chunk found for work_id {work_id}")
            
            return selected_chunks
            
        except Exception as e:
            logger.error(f"Error getting chunks for work {work_id}: {e}")
            return []

    def get_multiple_works(self, query_vector: List[float], intent: str, num_works: int,
                          additional_filters: Optional[Dict] = None) -> List[str]:
        """
        Get multiple different work_ids for discover/compare intents
        
        Returns:
            List of work_ids (up to num_works)
        """
        filter_dict = self.create_intent_filter(intent, additional_filters)
        
        try:
            # Fetch more results to ensure we get enough unique works
            results = self.index.query(
                vector=query_vector,
                top_k=num_works * 5,  # Fetch extra to account for duplicates
                filter=filter_dict,
                include_metadata=True
            )
            
            matches = results.get('matches', [])
            
            # Extract unique work_ids in score order
            seen_works = set()
            work_ids = []
            
            for match in matches:
                work_id = match.get('metadata', {}).get('work_id')
                if work_id and work_id not in seen_works:
                    work_ids.append(work_id)
                    seen_works.add(work_id)
                    logger.info(f"Selected work_id: {work_id} (score: {match['score']:.4f})")
                    
                    if len(work_ids) >= num_works:
                        break
            
            logger.info(f"Found {len(work_ids)} unique works for {intent} intent")
            return work_ids
            
        except Exception as e:
            logger.error(f"Error getting multiple works: {e}")
            return []

    def search_quick(self, query_vector: List[float], additional_filters: Optional[Dict] = None) -> List[Dict]:
        """Quick intent: Get overview chunk from most relevant work"""
        logger.info("Processing QUICK intent")
        
        work_id = self.get_most_relevant_work_id(query_vector, "quick", additional_filters)
        if not work_id:
            return []
        
        return self.get_chunks_for_work(work_id, ['overview'], "quick", additional_filters)

    def search_detailed(self, query_vector: List[float], additional_filters: Optional[Dict] = None) -> List[Dict]:
        """Detailed intent: Get detailed chunk from most relevant work (can extend to multiple chunk types)"""
        logger.info("Processing DETAILED intent")
        
        work_id = self.get_most_relevant_work_id(query_vector, "detailed", additional_filters)
        if not work_id:
            return []
        
        # For now, just get detailed chunk. Can extend to ['detailed', 'themes'] etc.
        return self.get_chunks_for_work(work_id, ['detailed'], "detailed", additional_filters)

    def search_recommend(self, query_vector: List[float], additional_filters: Optional[Dict] = None) -> List[Dict]:
        """Recommend intent: Get relevant chunks from most relevant work for recommendations"""
        logger.info("Processing RECOMMEND intent")
        
        work_id = self.get_most_relevant_work_id(query_vector, "recommend", additional_filters)
        if not work_id:
            return []
        
        # Get multiple chunk types that are good for recommendations
        return self.get_chunks_for_work(work_id, ['overview', 'experience', 'discovery'], "recommend", additional_filters)

    def search_discover(self, query_vector: List[float], additional_filters: Optional[Dict] = None) -> List[Dict]:
        """Discover intent: Get 5 different books for discovery"""
        logger.info("Processing DISCOVER intent")
        
        work_ids = self.get_multiple_works(query_vector, "discover", 5, additional_filters)
        if not work_ids:
            return []
        
        all_chunks = []
        for work_id in work_ids:
            chunks = self.get_chunks_for_work(work_id, ['overview'], "discover", additional_filters)
            all_chunks.extend(chunks)
        
        return all_chunks

    def search_compare(self, query_vector_1: List[float], query_vector_2: List[float], 
                      additional_filters: Optional[Dict] = None) -> List[Dict]:
        """
        Compare intent: Get 4 chunk types each from 2 different works
        
        Args:
            query_vector_1: Embedding for first book/query
            query_vector_2: Embedding for second book/query
            additional_filters: Additional filters
        """
        logger.info("Processing COMPARE intent")
        
        # Get most relevant work for each query
        work_id_1 = self.get_most_relevant_work_id(query_vector_1, "compare", additional_filters)
        work_id_2 = self.get_most_relevant_work_id(query_vector_2, "compare", additional_filters)
        
        if not work_id_1 or not work_id_2:
            logger.warning("Could not find work_ids for both comparison queries")
            return []
        
        if work_id_1 == work_id_2:
            logger.warning(f"Both queries resolved to same work_id: {work_id_1}")
            # Could handle this by getting second-best work for one of the queries
        
        # Get 4 chunk types good for comparison from each work
        comparison_chunk_types = ['detailed', 'themes', 'experience', 'similar']
        
        all_chunks = []
        
        # Get chunks for first work
        chunks_1 = self.get_chunks_for_work(work_id_1, comparison_chunk_types, "compare", additional_filters)
        all_chunks.extend(chunks_1)
        logger.info(f"Got {len(chunks_1)} chunks for work_id {work_id_1}")
        
        # Get chunks for second work
        chunks_2 = self.get_chunks_for_work(work_id_2, comparison_chunk_types, "compare", additional_filters)
        all_chunks.extend(chunks_2)
        logger.info(f"Got {len(chunks_2)} chunks for work_id {work_id_2}")
        
        return all_chunks

    def search(self, query_vector: List[float], intent: str, 
               query_vector_2: Optional[List[float]] = None, 
               additional_filters: Optional[Dict] = None) -> List[Dict]:
        """
        Main search method that routes to appropriate intent handler
        
        Args:
            query_vector: Primary query embedding
            intent: One of ["quick", "detailed", "recommend", "compare", "discover"]
            query_vector_2: Second query embedding (only for compare intent)
            additional_filters: Additional Pinecone filters
        """
        intent_methods = {
            "quick": self.search_quick,
            "detailed": self.search_detailed, 
            "recommend": self.search_recommend,
            "discover": self.search_discover,
        }
        
        if intent == "compare":
            if query_vector_2 is None:
                logger.error("Compare intent requires query_vector_2")
                return []
            return self.search_compare(query_vector, query_vector_2, additional_filters)
        
        if intent not in intent_methods:
            logger.error(f"Unknown intent: {intent}")
            return []
        
        return intent_methods[intent](query_vector, additional_filters)


if __name__ == '__main__':
    logger.info("--- Running Streamlined PineconeConnector Self-Test ---")

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

    # Test each intent type
    test_cases = [
        {
            "query": "How many pages does Crime and Punishment have?",
            "intent": "quick"
        },
        {
            "query": "Tell me everything about Crime and Punishment",
            "intent": "detailed"
        },
        {
            "query": "Books similar to Crime and Punishment",
            "intent": "recommend"
        },
        {
            "query": "Good classic novels to read",
            "intent": "discover"
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
                
                # Extract useful info
                rating_info = vector_db.extract_rating_info(text_content)
                if rating_info:
                    print(f"  - Rating: {rating_info['rating']}/5 ({rating_info['ratings_count']:,} ratings)")
                
                page_count = vector_db.extract_page_count(text_content)
                if page_count:
                    print(f"  - Pages: {page_count}")
                
                print(f"  - Text: {text_content[:300]}{'...' if len(text_content) > 300 else ''}")
        else:
            print("No results found.")

    # Test compare intent (requires 2 queries)
    print(f"\n{'='*70}")
    print("TEST 5 - COMPARE INTENT")
    print("Queries: 'Crime and Punishment' vs 'The Brothers Karamazov'")
    print('='*70)
    
    query1 = "Crime and Punishment"
    query2 = "The Brothers Karamazov"
    vector1 = embedder.embed_query(query1)
    vector2 = embedder.embed_query(query2)
    
    compare_results = vector_db.search(
        query_vector=vector1,
        intent="compare",
        query_vector_2=vector2
    )
    
    if compare_results:
        print(f"Compare Results ({len(compare_results)} chunks):")
        work_groups = {}
        for match in compare_results:
            work_id = match.get('metadata', {}).get('work_id', 'Unknown')
            if work_id not in work_groups:
                work_groups[work_id] = []
            work_groups[work_id].append(match)
        
        for work_id, chunks in work_groups.items():
            print(f"\n📚 Work ID: {work_id} ({len(chunks)} chunks)")
            for chunk in chunks:
                metadata = chunk.get('metadata', {})
                chunk_type = metadata.get('chunk_type', 'N/A')
                rating_info = vector_db.extract_rating_info(metadata.get('text', ''))
                rating_text = f" ({rating_info['ratings_count']:,} ratings)" if rating_info else ""
                print(f"  - {chunk_type}{rating_text}")
    else:
        print("No compare results found.")

    print(f"\n{'='*70}")
    print("Self-test complete!")
    print('='*70)
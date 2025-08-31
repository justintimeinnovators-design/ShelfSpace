import os
import json
import argparse
import logging
from pathlib import Path
from typing import List, Dict, Any
from dataclasses import dataclass
import time
from tqdm import tqdm

try:
    from dotenv import load_dotenv
    load_dotenv()
    print("Loaded environment variables from .env file")
except ImportError:
    print("ℹpython-dotenv not installed. Install with: uv pip install python-dotenv")
except Exception as e:
    print(f"Could not load .env file: {e}")

try:
    import numpy as np
    from sentence_transformers import SentenceTransformer
    from pinecone import Pinecone, ServerlessSpec
except ImportError as e:
    print(f"Missing required package: {e}")
    print("Install with: pip install sentence-transformers pinecone-client numpy tqdm")
    exit(1)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class BookChunk:
    chunk_id: str           
    text: str              
    chunk_type: str        
    priority: int          
    intent_relevance: List[str]  
    book_id: str 
    work_id: str          
    metadata: Dict[str, Any]     
    embedding: np.ndarray = None 

class EmbeddingGenerator:    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        logger.info(f"Loading SentenceTransformer model: {model_name}")
        
        self.model = SentenceTransformer(model_name)
        
        self.dimension = self.model.get_sentence_embedding_dimension()
        logger.info(f"Model loaded. Embedding dimension: {self.dimension}")
    
    def generate_batch_embeddings(self, texts: List[str], batch_size: int = 32) -> List[np.ndarray]:
        logger.info(f"Generating embeddings for {len(texts)} texts in batches of {batch_size}")
        
        embeddings = []
        
        for i in tqdm(range(0, len(texts), batch_size), desc="Generating embeddings"):
            batch_texts = texts[i:i + batch_size]
            
            batch_embeddings = self.model.encode(
                batch_texts, 
                show_progress_bar=False,  
                normalize_embeddings=True  # Important for cosine similarity
            )
            
            embeddings.extend(batch_embeddings)
        
        logger.info(f"Generated {len(embeddings)} embeddings")
        return embeddings

class PineconeVectorStore:    
    def __init__(self, 
                 api_key: str,
                 index_name: str = "book-chunks",
                 environment: str = "us-east-1",
                 dimension: int = 384):

        logger.info("Initializing Pinecone connection...")
        
        self.pc = Pinecone(api_key=api_key)
        self.index_name = index_name
        self.dimension = dimension
        
        existing_indexes = [index.name for index in self.pc.list_indexes()]
        
        if index_name not in existing_indexes:
            logger.info(f"Creating new Pinecone index: {index_name}")
            self.pc.create_index(
                name=index_name,
                dimension=dimension,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region=environment)
            )
            logger.info("Waiting for index to be ready...")
            time.sleep(60)
        else:
            logger.info(f"Using existing Pinecone index: {index_name}")
        
        self.index = self.pc.Index(index_name)
        logger.info(f"Connected to Pinecone index: {index_name}")

    def _sanitize_metadata(self, metadata: Dict[str, Any]) -> Dict[str, Any]:
        sanitized = {}
        for key, value in metadata.items():
            if value is None:
                if 'year' in key or 'length' in key:
                    sanitized[key] = 0
                elif 'has_' in key:
                    sanitized[key] = False
                else:
                    sanitized[key] = "unknown"
            else:
                sanitized[key] = value
        return sanitized

    def add_chunks(self, chunks: List[BookChunk], batch_size: int = 100):
        logger.info(f"Uploading {len(chunks)} chunks to Pinecone...")
        
        vectors = []
        
        for chunk in chunks:
            if chunk.embedding is None:
                raise ValueError(f"Chunk {chunk.chunk_id} is missing embedding")
            
            original_metadata = {
                "text": chunk.text[:8000],
                "chunk_type": chunk.chunk_type,
                "priority": chunk.priority,
                "book_id": chunk.book_id,
                "work_id": chunk.work_id,
                "chunk_id": chunk.chunk_id,
                "intent_relevance": chunk.intent_relevance,
                "length": chunk.metadata.get("length"),
                "publication_year": chunk.metadata.get("publication_year"),
                "has_rating": chunk.metadata.get("contains_rating"),
                "complexity_level": chunk.metadata.get("complexity_level"),
                "popularity_tier": chunk.metadata.get("popularity_tier")
            }
            
            sanitized_metadata = self._sanitize_metadata(original_metadata)

            vector = {
                "id": chunk.chunk_id,
                "values": chunk.embedding.tolist(),
                "metadata": sanitized_metadata  
            }
            vectors.append(vector)
        
        total_batches = (len(vectors) + batch_size - 1) // batch_size
        for i in range(0, len(vectors), batch_size):
            batch = vectors[i:i + batch_size]
            batch_num = i // batch_size + 1
            
            logger.info(f"Uploading batch {batch_num}/{total_batches} ({len(batch)} vectors)")
            try:
                self.index.upsert(vectors=batch)
                time.sleep(2)
            except Exception as e:
                logger.error(f"Error uploading batch {batch_num}: {e}")
                if "rate limit" in str(e).lower():
                    logger.info("Rate limit hit, waiting 30 seconds...")
                    time.sleep(30)
                    try:
                        self.index.upsert(vectors=batch)
                        logger.info("Retry successful")
                    except Exception as retry_e:
                        logger.error(f"Retry failed: {retry_e}")
                        raise
                else:
                    raise
        
        logger.info(f"Successfully uploaded {len(chunks)} chunks to Pinecone")
        stats = self.index.describe_index_stats()
        logger.info(f"Index now contains {stats.total_vector_count} total vectors")


def load_chunks_from_json(file_path: Path) -> List[BookChunk]:
    logger.info(f"Loading chunks from: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        chunks = []
        
        if isinstance(data, list):
            chunks_data = data
        else:
            chunks_data = [data]
        
        for chunk_data in chunks_data:
            try:
                chunk = BookChunk(
                    chunk_id=chunk_data['chunk_id'],
                    text=chunk_data['text'],
                    chunk_type=chunk_data['chunk_type'],
                    priority=chunk_data['priority'],
                    intent_relevance=chunk_data['intent_relevance'],
                    book_id=chunk_data['book_id'],
                    work_id= chunk_data['work_id'],
                    metadata=chunk_data['metadata']
                )
                chunks.append(chunk)
                
            except KeyError as e:
                logger.warning(f"Skipping invalid chunk in {file_path}: missing {e}")
                continue
        
        logger.info(f"Loaded {len(chunks)} valid chunks from {file_path}")
        return chunks
        
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in {file_path}: {e}")
        return []
    except Exception as e:
        logger.error(f"Error reading {file_path}: {e}")
        return []

def find_json_files(data_dir: Path) -> List[Path]:
    if not data_dir.exists():
        raise FileNotFoundError(f"Data directory not found: {data_dir}")
    
    json_files = list(data_dir.glob("**/*.json"))
    
    logger.info(f"Found {len(json_files)} JSON files in {data_dir}")
    
    for json_file in json_files:
        logger.info(f"  - {json_file.name}")
    
    return json_files

def process_chunks_streaming(json_file_path: Path, 
                           embedding_generator: EmbeddingGenerator,
                           vector_store: PineconeVectorStore,
                           chunk_batch_size: int = 1000,
                           embedding_batch_size: int = 32,
                           upload_batch_size: int = 50):
    logger.info(f"Processing large file in streaming mode: {json_file_path}")
    
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if not isinstance(data, list):
        data = [data]
    
    total_chunks = len(data)
    logger.info(f"Total chunks to process: {total_chunks}")
    
    processed_count = 0
    
    for i in range(0, total_chunks, chunk_batch_size):
        batch_data = data[i:i + chunk_batch_size]
        batch_num = i // chunk_batch_size + 1
        total_batches = (total_chunks + chunk_batch_size - 1) // chunk_batch_size
        
        logger.info(f"Processing batch {batch_num}/{total_batches} "
                   f"({len(batch_data)} chunks)")
        
        chunks = []
        for chunk_data in batch_data:
            try:
                chunk = BookChunk(
                    chunk_id=chunk_data['chunk_id'],
                    text=chunk_data['text'],
                    chunk_type=chunk_data['chunk_type'],
                    priority=chunk_data['priority'],
                    intent_relevance=chunk_data['intent_relevance'],
                    book_id=chunk_data['book_id'],
                    work_id=chunk_data['work_id'],
                    metadata=chunk_data['metadata']
                )
                chunks.append(chunk)
            except KeyError as e:
                logger.warning(f"Skipping invalid chunk: missing {e}")
                continue
        
        if not chunks:
            continue
        
        texts = [chunk.text for chunk in chunks]
        embeddings = embedding_generator.generate_batch_embeddings(
            texts, batch_size=embedding_batch_size
        )
        
        for chunk, embedding in zip(chunks, embeddings):
            chunk.embedding = embedding
        
        vector_store.add_chunks(chunks, batch_size=upload_batch_size)
        
        processed_count += len(chunks)
        logger.info(f"Processed {processed_count}/{total_chunks} chunks "
                   f"({processed_count/total_chunks*100:.1f}%)")
        
        del chunks, embeddings, texts
    
    logger.info(f"✅ Completed processing {processed_count} chunks")

def main():
    # Set up command line argument parsing
    parser = argparse.ArgumentParser(description="Load book chunks into Pinecone vector database")
    parser.add_argument("--json-file", type=str,
                       help="Single JSON file with all chunks")
    parser.add_argument("--data-dir", type=str,
                       help="Directory containing JSON chunk files")
    parser.add_argument("--index-name", type=str, default="book-chunks",
                       help="Pinecone index name")
    parser.add_argument("--api-key", type=str, 
                       help="Pinecone API key (or set PINECONE_API_KEY env var)")
    parser.add_argument("--environment", type=str, default="us-east-1",
                       help="Pinecone environment/region")
    parser.add_argument("--model", type=str, default="all-MiniLM-L6-v2",
                       help="SentenceTransformer model name")
    parser.add_argument("--chunk-batch-size", type=int, default=1000,
                       help="Number of chunks to process at once (memory management)")
    parser.add_argument("--embedding-batch-size", type=int, default=32,
                       help="Batch size for embedding generation")
    parser.add_argument("--upload-batch-size", type=int, default=50,
                       help="Batch size for Pinecone uploads (avoid rate limits)")
    
    args = parser.parse_args()
    
    if not args.json_file and not args.data_dir:
        raise ValueError("Must provide either --json-file or --data-dir")
    
    api_key = args.api_key or os.getenv("PINECONE_API_KEY")
    if not api_key:
        raise ValueError("Pinecone API key required. Use --api-key or set PINECONE_API_KEY env var")
    
    logger.info("Starting large-scale book chunk loading process...")
    logger.info(f"Index name: {args.index_name}")
    logger.info(f"Model: {args.model}")
    logger.info(f"Chunk batch size: {args.chunk_batch_size}")
    logger.info(f"Upload batch size: {args.upload_batch_size}")
    
    embedding_generator = EmbeddingGenerator(model_name=args.model)
    
    vector_store = PineconeVectorStore(
        api_key=api_key,
        index_name=args.index_name,
        environment=args.environment,
        dimension=embedding_generator.dimension
    )
    
    if args.json_file:
        json_file = Path(args.json_file)
        if not json_file.exists():
            raise FileNotFoundError(f"JSON file not found: {json_file}")
        
        process_chunks_streaming(
            json_file, 
            embedding_generator, 
            vector_store,
            chunk_batch_size=args.chunk_batch_size,
            embedding_batch_size=args.embedding_batch_size,
            upload_batch_size=args.upload_batch_size
        )
    else:
        data_dir = Path(args.data_dir)
        json_files = find_json_files(data_dir)
        
        if not json_files:
            logger.error("No JSON files found!")
            return
        
        total_processed = 0
        for json_file in json_files:
            logger.info(f"Processing file: {json_file.name}")
            process_chunks_streaming(
                json_file,
                embedding_generator,
                vector_store,
                chunk_batch_size=args.chunk_batch_size,
                embedding_batch_size=args.embedding_batch_size,
                upload_batch_size=args.upload_batch_size
            )
    
    logger.info("✅ Successfully loaded all book chunks into Pinecone!")
    logger.info(f"Index '{args.index_name}' now ready for similarity search")


if __name__ == "__main__":
    main()
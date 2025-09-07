import logging
from typing import List
import numpy as np
from sentence_transformers import SentenceTransformer
import torch
import argparse
import sys
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class EmbeddingGenerator:
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        try:
            device = 'cuda' if torch.cuda.is_available() else 'cpu'
            logger.info(f"Using device: {device.upper()}")

            logger.info(f"Loading embedding model '{model_name}'... This may take a moment.")

            self.model = SentenceTransformer(model_name)

            self.dimension = self.model.get_sentence_embedding_dimension()

            logger.info(f"Model '{model_name}' loaded successfully. Vector dimension: {self.dimension}")

        except Exception as e:
            logger.error(f"Failed to load SentenceTransformer model: {e}")
            logger.error("Please ensure you have an internet connection and the 'sentence-transformers' library is installed.")
            raise

    def embed_query(self, text: str) -> List[float]:
        if not text or not isinstance(text, str):
            logger.warning("Embed query called with empty or invalid text. Returning zero vector.")
            return [0.0] * self.dimension
        
        embedding = self.model.encode(text, normalize_embeddings=True)

        return embedding.tolist()
    
if __name__ == "__main__":
    logger.info("--- Running EmbeddingGenerator Self-Test ---")

    generator = EmbeddingGenerator()

    sample_query = input("Give query to embed:")
    logger.info(f"Sample query: \"{sample_query}\"")

    embedding_vector = generator.embed_query(sample_query)

    print("\n--- TEST RESULTS ---")
    print(f"Embedding Dimension: {len(embedding_vector)}")
    print(f"{str(embedding_vector)[1:-1]}")
    print("Self-test complete. The Embedding Forge is operational.")

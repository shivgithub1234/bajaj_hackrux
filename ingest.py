# File: ingest.py (Updated to be compatible with older LangChain versions)

import os
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    UnstructuredWordDocumentLoader,
    # We no longer need DirectoryLoader for this method
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Configuration (Unchanged) ---
class Settings(BaseModel):
    DATA_PATH: str = "policy_documents"
    DB_PATH: str = "vector_store"
    EMBEDDING_MODEL: str = "nvidia/llama-3.2-nemoretriever-1b-vlm-embed-v1"
    CHUNK_SIZE: int = 512
    CHUNK_OVERLAP: int = 50

settings = Settings()

# --- NEW Document Loading Logic ---
# This block replaces the DirectoryLoader to ensure compatibility.

print("Scanning for documents in folder:", settings.DATA_PATH)
all_documents = []
# os.walk will go through the directory and any subdirectories
for root, _, files in os.walk(settings.DATA_PATH):
    for file_name in files:
        file_path = os.path.join(root, file_name)
        
        try:
            loader = None
            if file_name.lower().endswith(".pdf"):
                print(f"Loading PDF: {file_name}")
                loader = PyPDFLoader(file_path)
            elif file_name.lower().endswith(".txt"):
                print(f"Loading TXT: {file_name}")
                loader = TextLoader(file_path, encoding='utf-8')
            elif file_name.lower().endswith(".docx"):
                print(f"Loading DOCX: {file_name}")
                loader = UnstructuredWordDocumentLoader(file_path)
            
            if loader:
                # .load() returns a list of documents, so we use extend
                all_documents.extend(loader.load())
        except Exception as e:
            print(f"Warning: Failed to load {file_name}. Error: {e}")

# The variable 'documents' will now hold all the loaded content
documents = all_documents
print(f"Loaded {len(documents)} document(s) successfully.")


# --- The rest of the script remains the same ---

# --- Text Splitting ---
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=settings.CHUNK_SIZE,
    chunk_overlap=settings.CHUNK_OVERLAP
)

print("Splitting documents into chunks...")
texts = text_splitter.split_documents(documents)
print(f"Split into {len(texts)} chunks.")

# --- NVIDIA Embedding Model ---
print(f"Initializing NVIDIA embedding model: {settings.EMBEDDING_MODEL}")
embeddings = NVIDIAEmbeddings(
    model=settings.EMBEDDING_MODEL,
    truncate="NONE"
)
print("NVIDIA Embedding model loaded.")

# --- Vector Store Creation ---
print("Creating and persisting vector store (this will make API calls)...")
db = Chroma.from_documents(
    texts,
    embeddings,
    persist_directory=settings.DB_PATH
)
print("Vector store created successfully.")
print(f"All policy documents have been processed and stored in '{settings.DB_PATH}'.")
print("You can now run main.py")
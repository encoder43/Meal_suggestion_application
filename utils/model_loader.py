import os
from dotenv import load_dotenv
from typing import Literal, Optional, Any
from pydantic import BaseModel, Field
from utils.config_loader import load_config

# Import LLM providers
from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI


# --- Load environment variables ---
load_dotenv()


class ConfigLoader:
    """Handles loading of project configuration."""

    def __init__(self):
        print("Loaded config.....")
        self.config = load_config()

    def __getitem__(self, key):
        return self.config[key]


class ModelLoader(BaseModel):
    """Loads LLMs based on provider, with optional fallback."""
    
    model_provider: Literal["groq", "openai", "gemini"] = "groq"
    config: Optional[ConfigLoader] = Field(default=None, exclude=True)

    def model_post_init(self, __context: Any) -> None:
        self.config = ConfigLoader()

    class Config:
        arbitrary_types_allowed = True

    def load_llm(self):
        """
        Load and return the LLM instance.
        Tries the chosen provider first, then falls back to others.
        """
        print(f"LLM loading... Preferred provider: {self.model_provider}")

        provider_order = [self.model_provider] + [
            p for p in ["groq", "openai", "gemini"] if p != self.model_provider
        ]

        for provider in provider_order:
            try:
                if provider == "groq":
                    print("Trying Groq provider...")
                    api_key = os.getenv("GROQ_API_KEY")
                    if api_key:
                        model_name = self.config["llm"]["groq"]["model_name"]
                        return ChatGroq(model=model_name, api_key=api_key)

                elif provider == "openai":
                    print("Trying OpenAI provider...")
                    api_key = os.getenv("OPENAI_API_KEY")
                    if api_key:
                        model_name = self.config["llm"]["openai"]["model_name"]
                        return ChatOpenAI(model=model_name, api_key=api_key)

                elif provider == "gemini":
                    print("Trying Gemini provider...")
                    api_key = os.getenv("GEMINI_API_KEY")
                    if api_key:
                        model_name = self.config["llm"]["gemini"]["model_name"]
                        return ChatGoogleGenerativeAI(model=model_name, api_key=api_key)

            except Exception as e:
                print(f"{provider} failed: {e}")
                continue

        raise RuntimeError("❌ No valid LLM provider available. Check API keys/config.")

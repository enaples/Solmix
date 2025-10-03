from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Annotated, Any
from pydantic import (
    AnyUrl,
    BeforeValidator,
    Field
)


def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
    API_V1_STR: str = "/api/v1"
    DOMAIN: str = Field(default="localhost")
    POE_API_KEY: str = Field(default="")
    OPENAI_API_KEY: str = Field(default="")
    
    BACKEND_CORS_ORIGINS: Annotated[list[AnyUrl] | str, BeforeValidator(parse_cors)] = "http://localhost,http://localhost:3000,https://localhost,https://localhost:3000,https://localhost:3000"
    PROJECT_NAME: str = Field(default="FastAPI backend for Solmix")
    PROJECT_VERSION: str = Field(default="0.0.1")
    PROJECT_DESCRIPTION: str = Field(default="This tool helps you to edit, comment and explain Solidity smart contracts using LLMs.")
    
    HARDHAT_PATH: str = Field(default="../hardhat")
    SC_DEFAULT_NAME: str = Field(default="MyContract") # default name for new smart contracts
    
settings = Settings()
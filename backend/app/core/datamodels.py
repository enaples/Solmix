from pydantic import BaseModel
from typing import List

class BaseItem(BaseModel):
    message: str
    code: str


class smartContractItem(BaseModel):
    code: str


class deployItem(BaseModel):
    solcode: str
    tscode: str
    
class CompilationItem(BaseModel):
    success: bool
    stderr: str = ""
    stdout: str = ""
    messages: List[str]
    
class ParseResult(BaseModel):
    success: bool
    stderr: str | None = None
    stdout: str | None = None
    ast: dict | None = None


class VulnerabilityItem(CompilationItem):
    messages: dict | List = {}
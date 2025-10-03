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
    
class CompilationResult(BaseModel):
    success: bool
    stderr: str = ""
    stdout: str = ""
    messages: List[str]
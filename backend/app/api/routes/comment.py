from fastapi import APIRouter
from app.core.datamodels import BaseItem
from app.utils.llm_api import run_prompt, compose_comment_prompt

router = APIRouter()

@router.post("/", response_model=str)
def comment(item: BaseItem):
    prompt = compose_comment_prompt(item.message, item.code)
    result = run_prompt(prompt)
    return result
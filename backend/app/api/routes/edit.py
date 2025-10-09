from fastapi import APIRouter
from app.core.datamodels import BaseItem
from app.utils.llm_api import run_prompt, compose_edit_prompt

router = APIRouter()

@router.post("/", response_model=str)
def edit(item: BaseItem):
    prompt = compose_edit_prompt(item.message, item.code)
    result = run_prompt(prompt)
    return result
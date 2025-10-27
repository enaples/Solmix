from fastapi import APIRouter
from app.core.datamodels import smartContractItem
from app.utils.llm_api import run_prompt, compose_explain_prompt

router = APIRouter()

@router.post("/", response_model=str)
def edit(item: smartContractItem):
    prompt = compose_explain_prompt(item.code)
    result = run_prompt(prompt)
    return result
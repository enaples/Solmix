from fastapi import APIRouter
from app.utils.utils import save_smart_contract, verify_compilation, clean_prev_compilation
from app.core.datamodels import smartContractItem, CompilationItem

router = APIRouter()

@router.post("/")
def compile(item: smartContractItem):
    cleaning_res = clean_prev_compilation()
    if not cleaning_res.success:
        return cleaning_res
    
    save_smart_contract(item.code)

    return verify_compilation()
    
    
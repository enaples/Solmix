from fastapi import APIRouter
from app.core.datamodels import smartContractItem
from datetime import datetime
from app.core.config import settings
from subprocess import Popen
from subprocess import PIPE
from app.utils.utils import parse_hardhat_output
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/")
def compile(item: smartContractItem):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    with open(f"{settings.HARDHAT_PATH}/contracts/{settings.SC_DEFAULT_NAME}.sol", "w") as text_file:
        text_file.write(item.code)
        
    p = Popen(
        f'npx hardhat compile',
        cwd=rf"{settings.HARDHAT_PATH}/",
        stdout=PIPE,
        stderr=PIPE,
        shell=True,
        text=True
    )

    result = parse_hardhat_output(p)
    return JSONResponse(content=result.model_dump())
    
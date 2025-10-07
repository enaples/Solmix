from fastapi import APIRouter
from app.core.datamodels import smartContractItem
from app.core.config import settings
from subprocess import Popen
from subprocess import PIPE
from fastapi.responses import JSONResponse
import json

router = APIRouter()


@router.post("/")
def parse(item: smartContractItem):
    with open(f"{settings.HARDHAT_PATH}/contracts/{settings.SC_DEFAULT_NAME}.sol", "w") as text_file:
        text_file.write(item.code)

    p1 = Popen(
        f'npx hardhat ast --file {settings.SC_DEFAULT_NAME}.sol',
        cwd=rf"{settings.HARDHAT_PATH}",
        stdout=PIPE,
        stderr=PIPE,
        shell=True,
        text=True
    )
    stdout, stderr = p1.communicate()

    if p1.returncode == 0:
        try:
            return JSONResponse(content={
                "success": True,
                "stderr": stderr,
                "stdout": stdout,
                "ast": json.loads(stdout)
            })
        except json.JSONDecodeError:
            return JSONResponse(content={
                "success": False,
                "stderr": f"Failed to parse AST JSON output: {stderr}",
                "stdout": stdout,
                "ast": None
            })
    else:
        return JSONResponse(content={
            "success": False,
            "stderr": stderr,
            "stdout": stdout,
            "ast": None
        })

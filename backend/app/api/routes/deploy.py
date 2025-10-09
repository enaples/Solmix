from fastapi import APIRouter
from app.core.datamodels import deployItem
from datetime import datetime
from app.core.config import settings
from subprocess import Popen

router = APIRouter()


# Since `npx hardhat compile` compiles the whole project, the best way to handle the smart contract
# is to overwrite the same files every time a new contract is created.
# This way, the user will always have the latest contract deployed when they create a new one
@router.post("/", response_model=str)
async def deploy(item: deployItem):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    with open(f"{settings.HARDHAT_PATH}/contracts/{settings.SC_DEFAULT_NAME}.sol", "w") as text_file:
        text_file.write(item.solcode)
    with open(f"{settings.HARDHAT_PATH}/ignition/modules/{settings.SC_DEFAULT_NAME}.ts", "w") as f:
        f.write(item.tscode)

    #deploy = subprocess.Popen(["npx", "hardhat", "run", f"scripts/deployments/{hash}.ts", "--network", "dev"],
    #                          cwd="../hardhat/",
    #                          stdout=subprocess.PIPE)

    # todo: run new sc using the created files
    p = Popen(
        f'npx hardhat ignition deploy ignition/modules/{settings.SC_DEFAULT_NAME}.ts',
        cwd=rf"{settings.HARDHAT_PATH}/",)
        #shell=True,
        #cwd="../hardhat3/",
        #capture_output=True,
        #text=True

    p.terminate()

    return "ok"
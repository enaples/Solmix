import re

from fastapi import APIRouter
from app.core.datamodels import deployItem
from datetime import datetime
from app.core.config import settings
from subprocess import Popen

from app.utils.utils import deploy_smartcontract

router = APIRouter()
def extract_contract_name(solidity_code):
    # Regular expression to match "contract ContractName is" pattern
    contract_pattern = re.compile(r'contract\s+([a-zA-Z0-9_]+)(?:\s+is|\s*{)')

    # Search for the pattern in the code
    match = contract_pattern.search(solidity_code)

    # Return the contract name if found, otherwise None
    if match:
        return match.group(1)
    else:
        return None



# Since `npx hardhat compile` compiles the whole project, the best way to handle the smart contract
# is to overwrite the same files every time a new contract is created.
# This way, the user will always have the latest contract deployed when they create a new one
@router.post("/", response_model=str)
async def deploy(item: deployItem):
    contract_name = extract_contract_name(item.solcode)
    new_contract_name = contract_name + datetime.now().strftime("%Y%m%d%H%M%S")
    solcode = item.solcode.replace(contract_name, new_contract_name)
    tscode = item.tscode.replace(contract_name, new_contract_name)

    with open(f"{settings.HARDHAT_PATH}/contracts/{new_contract_name}.sol", "w") as text_file:
        text_file.write(solcode)
    with open(f"{settings.HARDHAT_PATH}/ignition/modules/{new_contract_name}.ts", "w") as f:
        f.write(tscode)

    return deploy_smartcontract(new_contract_name)
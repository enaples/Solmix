from fastapi import APIRouter
from app.core.datamodels import smartContractItem
from app.utils.llm_api import run_prompt,compose_generatedeploycode_prompt
from app.utils.utils import extract_contract_name

router = APIRouter()

deployment_template = """
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("%sModule", (m) => {

  const sc = m.contract("%s");

  return { sc };
});
"""
try:
    with open("./utils/deployment_template.txt", "r") as file:
        deployment_template = file.read()
except FileNotFoundError:
    pass

@router.post("/", response_model=str)
async def generatedeploycode(item: smartContractItem):
    template = deployment_template % (extract_contract_name(item.code), extract_contract_name(item.code))
    prompt = compose_generatedeploycode_prompt(item.code, template)
    result = run_prompt(prompt)
    return result
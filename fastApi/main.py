import re

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from llm_api import run_prompt, compose_comment_prompt, compose_explain_prompt, compose_edit_prompt, \
    compose_generatedeploycode_prompt

from subprocess import Popen
import random
import os

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


deployment_template = ""
with open('./res/deploy_script_sample.txt', encoding='utf-8') as file:
    deployment_template = file.read()


class EditItem(BaseModel):
    message: str
    code: str


class smartContractItem(BaseModel):
    code: str


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

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/edit", response_model=str)
async def comment(item: EditItem):
    prompt = compose_edit_prompt(item.message, item.code)
    result = run_prompt(prompt)
    return result


@app.post("/comment", response_model=str)
async def comment(item: smartContractItem):
    prompt = compose_comment_prompt(item.code)
    result = run_prompt(prompt)
    return result


@app.post("/explain", response_model=str)
async def explain(item: smartContractItem):
    prompt = compose_explain_prompt(item.code)
    result = run_prompt(prompt)
    return result


@app.post("/generatedeploycode", response_model=str)
async def generatedeploycode(item: smartContractItem):
    template = deployment_template % extract_contract_name(item.code)
    prompt = compose_generatedeploycode_prompt(item.code, template)
    result = run_prompt(prompt)
    return result

@app.post("/deploy", response_model=str)
async def explain(item: smartContractItem):
    hash = random.getrandbits(128)
    # TODO: pragma should be declared using the proper version
    #with open(f"../hardhat3/contracts/{hash}.sol", "w") as text_file:
    #    text_file.write(item.code)
    #script = ""
    #with open('./res/deploy_script_sample.txt', encoding='utf-8') as file:
    #    script = file.read() % extract_contract_name(item.code)
    #with open(f"../hardhat3/ignition/modules/{hash}.ts", "w") as f:
    #    f.write(script)

    #deploy = subprocess.Popen(["npx", "hardhat", "run", f"scripts/deployments/{hash}.ts", "--network", "dev"],
    #                          cwd="../hardhat/",
    #                          stdout=subprocess.PIPE)

    # todo: run new sc
    p = Popen(
        'npx hardhat ignition deploy ignition/modules/Counter.ts',
        cwd=r'../hardhat3/')
        #shell=True,
        #cwd="../hardhat3/",
        #capture_output=True,
        #text=True

    p.terminate()

    return "ok"

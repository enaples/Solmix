from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from llm_api import run_prompt, compose_comment_prompt, compose_explain_prompt, compose_edit_prompt

import subprocess
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


class EditItem(BaseModel):
    message: str
    code: str


class smartContractItem(BaseModel):
    code: str


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


@app.post("/deploy", response_model=str)
async def explain(item: smartContractItem):

    # todo save sc to file and then deploy .sol

    hash = random.getrandbits(128)
    with open(f"../ignition/modules/{hash}.sol", "w") as text_file:
        text_file.write(item.code)

    deploy = subprocess.Popen(["npx", "hardhat", "ignition", "deploy", "./ignition/modules/Lock.js"],
                              cwd="../hardhat/",
                              stdout=subprocess.PIPE)
    print("the commandline is {}".format(deploy.args))
    output = deploy.communicate()[0]
    print(f"deploy API, output: {output}")
    print("Return code:", deploy.returncode)
    print("Output:", deploy.stdout)
    print("Error:", deploy.stderr)

    try:
        os.remove(f"../ignition/modules/{hash}.sol")
        print(f"File '{hash}.sol' deleted successfully.")
    except FileNotFoundError: (
        print(f"File '{hash}.sol' not found."))

    return output

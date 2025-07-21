from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from llm_api import run_prompt, compose_comment_prompt, compose_explain_prompt, compose_edit_prompt

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


class ExplainItem(BaseModel):
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
async def comment(item: ExplainItem):
    prompt = compose_comment_prompt(item.code)
    result = run_prompt(prompt)
    return result


@app.post("/explain", response_model=str)
async def explain(item: ExplainItem):
    prompt = compose_explain_prompt(item.code)
    result = run_prompt(prompt)
    return result

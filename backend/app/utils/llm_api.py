import time
from pathlib import Path
import openai
import os
from dotenv import load_dotenv
import openai


ROOT_DIR = Path(__file__).parent.absolute()

def run_prompt(user_message: str, sys_prompt:str = ""):
    load_dotenv()
    client = openai.OpenAI(
        api_key=os.getenv('POE_API_KEY'),
        base_url="https://api.poe.com/v1",
    )

    response = client.chat.completions.create(
        model="Claude-Sonnet-3.7",
        messages=[
            {"role": "system", "content": sys_prompt},
            {"role": "user", "content": user_message}],
        stream=True
    )

    result = ''
    for chunk in response:
        if chunk.choices[0].delta.content:
            result += chunk.choices[0].delta.content

    return result


def compose_edit_prompt(user_message: str, current_code: str):
    return (f'User request:\n{user_message}'
            '\n\nYou are a smart contract and solidity expert, process the user request editing the following '
            'smart contract in solidity:'
            f'\n{current_code}'
            '\n\nReturn only the Solidity code.')


def compose_comment_prompt(current_code: str):
    return ('You are a smart contract and solidity expert, add comments to the following smart contract in solidity in '
            'order to make it readable to not-skilled users:'
            f'\n{current_code}'
            '\n\nReturn only the Solidity code.')


def compose_explain_prompt(current_code: str):
    return ('As a solidity expert, explain this smart contract in simple terms to someone new to '
            'blockchain development. Cover:'
            '\n1. What this contract is designed to do'
            '\n2. Its main purpose and goals'
            '\n3. A beginner-friendly explanation of how it works internally'
            '\n4. Any potential risks or important considerations'
            '\n\nAvoid technical jargon when possible, and when you must use technical terms, provide brief '
            'explanations. Use analogies where helpful. No intro is needed.'
            '\n\nSmart Contract:'
            f'\n\"\"\"\n{current_code}\n\"\"\"')

def compose_generatedeploycode_prompt(current_code: str, deployment_template: str):
    return ('You are a smart contract and solidity expert, '
            'generate a typescript code based on the template below '
            'to deploy the following smart contract using Hardhat v3.'
            '\nUse examples parameters if needed and add comments where the user should edit them.'
            '\n\nTypescript template for deployment:'
            f'\n\"\"\"\n{deployment_template}\n\"\"\"'
            '\n\nSolidity Smart Contract:'
            f'\n\"\"\"\n{current_code}\n\"\"\"'
            '\n\nReturn only the Typescript code.')
    
import time
from pathlib import Path
import openai
import os
from dotenv import load_dotenv
import openai


ROOT_DIR = Path(__file__).parent.absolute()

# POE
# pip install openai
# pip install fastapi-poe


def run_prompt(user_message: str, sys_prompt:str = ""):
    load_dotenv()
    client = openai.OpenAI(
        api_key=os.getenv('POE_API_KEY'),
        base_url="https://api.poe.com/v1",
    )

    response = client.chat.completions.create(
        model="Claude-Sonnet-3.7",
        messages=[
            {"role": "system", "content": sys_prompt},
            {"role": "user", "content": user_message}],
        stream=True
    )

    result = ''
    for chunk in response:
        if chunk.choices[0].delta.content:
            result += chunk.choices[0].delta.content

    return result


def compose_edit_prompt(user_message: str, current_code: str):
    return (f'User request:\n{user_message}'
            '\n\nYou are a smart contract and solidity expert, process the user request editing the following '
            'smart contract in solidity:'
            f'\n{current_code}'
            '\n\nReturn only the Solidity code.')


def compose_comment_prompt(current_code: str):
    return ('You are a smart contract and solidity expert, add comments to the following smart contract in solidity in '
            'order to make it readable to not-skilled users:'
            f'\n{current_code}'
            '\n\nReturn only the Solidity code.')


def compose_explain_prompt(current_code: str):
    return ('As a solidity expert, explain this smart contract in simple terms to someone new to '
            'blockchain development. Cover:'
            '\n1. What this contract is designed to do'
            '\n2. Its main purpose and goals'
            '\n3. A beginner-friendly explanation of how it works internally'
            '\n4. Any potential risks or important considerations'
            '\n\nAvoid technical jargon when possible, and when you must use technical terms, provide brief '
            'explanations. Use analogies where helpful. No intro is needed.'
            '\n\nSmart Contract:'
            f'\n\"\"\"\n{current_code}\n\"\"\"')

def compose_generatedeploycode_prompt(current_code: str, deployment_template: str):
    return ('You are a smart contract and solidity expert, '
            'generate a typescript code based on the template below '
            'to deploy the following smart contract using Hardhat v3.'
            '\nUse examples parameters if needed and add comments where the user should edit them.'
            '\n\nTypescript template for deployment:'
            f'\n\"\"\"\n{deployment_template}\n\"\"\"'
            '\n\nSolidity Smart Contract:'
            f'\n\"\"\"\n{current_code}\n\"\"\"'
            '\n\nReturn only the Typescript code.')

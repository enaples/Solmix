import colorama
import toml
import time
from poe_api_wrapper import PoeApi
from pathlib import Path

ROOT_DIR = Path(__file__).parent.absolute()

# pip install -U poe-api-wrapper

# POE
auth = dict()
try:
    auth = toml.load(f'{ROOT_DIR}/config.toml')
except FileNotFoundError as e:
    print(colorama.Fore.RED + f'{e}')
    print(colorama.Fore.RED + '[ERROR] How-to insert Poe credentials:\n'
                              '1. duplicate \'config-example.toml\'\n'
                              '2. rename the file into \'config.toml\'\n'
                              '3. open \'config.toml\' and replace the dummy credentials with yours')

tokens = {
    'p-b': auth['poe']['p_b'],
    'p-lat': auth['poe']['p_lat'],
}
BOT_NAME = "Claude-Sonnet-3.7"
CHAT_CODE = "p25djm12p3pvwmo25x"


def run_prompt(prompt_message: str):
    client = PoeApi(tokens=tokens)

    time.sleep(2)
    result = ''
    for chunk in client.send_message(bot=BOT_NAME, message=prompt_message, chatCode=CHAT_CODE):
        result += chunk["response"]
    client.chat_break(bot=BOT_NAME, chatCode=CHAT_CODE)

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

import re
from app.core.datamodels import CompilationItem
from app.core.config import settings
from subprocess import PIPE, Popen
import re


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


def strip_ansi(text: str) -> str:
    """Remove ANSI escape codes from text"""
    ansi_escape = re.compile(r'\x1b\[[0-9;]*m')
    return ansi_escape.sub('', text)


def parse_hardhat_compilation_output(p: Popen) -> CompilationItem:
    """
    Parse Hardhat compilation output and extract error/warning messages
    """
    stdout, stderr = p.communicate()
    if isinstance(stdout, bytes):
        stdout = stdout.decode('utf-8', errors='ignore')
    if isinstance(stderr, bytes):
        stderr = stderr.decode('utf-8', errors='ignore')
    combined_output = stdout + stderr
    clean_output = strip_ansi(combined_output)

    messages = []

    # Split by double newlines to get error blocks
    blocks = re.split(r'\n\s*\n+', clean_output.strip())

    for block in blocks:
        block = block.strip()
        if not block:
            continue

        # Check if it's an error or warning block
        if any(keyword in block for keyword in ['Error', 'Warning', 'ParserError', 'TypeError', 'DeclarationError']):
            messages.append(block)

    # If no structured errors found but output exists, add the whole output
    if not messages and clean_output.strip():
        messages.append(clean_output.strip())

    return CompilationItem(
        success=p.returncode == 0,
        stderr=stderr,
        stdout=stdout,
        messages=messages
    )


def get_pragma(solidity_code: str) -> str | None:
    pattern = r"(pragma solidity ).{0,2}(\d\.\d+\.\d+)"
    match = re.search(pattern, solidity_code)
    if not match or not match.group(2):
        return None
    pragma = match.group(2)
    parts = pragma.split(".")
    if int(parts[1]) == 4 and int(parts[2]) < 11:
        pragma = "0.4.11"
    return pragma


def save_smart_contract(solidity_code: str) -> None:
    with open(f"{settings.HARDHAT_PATH}/contracts/{settings.SC_DEFAULT_NAME}.sol", "w") as text_file:
        text_file.write(solidity_code)


def verify_compilation() -> CompilationItem:
    p = Popen(
        f'npx hardhat compile',
        cwd=rf"{settings.HARDHAT_PATH}",
        stdout=PIPE,
        stderr=PIPE,
        shell=True,
        text=True
    )
    return parse_hardhat_compilation_output(p)


def clean_prev_compilation() -> CompilationItem:
    p = Popen(
        f'npx hardhat clean',
        cwd=f"{settings.HARDHAT_PATH}",
        stdout=PIPE,
        stderr=PIPE,
        shell=True,
        text=True
    )
    return parse_hardhat_compilation_output(p)


def deploy_smartcontract(filename) -> str:
    p = Popen(
        f'npx hardhat ignition deploy ignition/modules/{filename}.ts',
        cwd=f"{settings.HARDHAT_PATH}",
        stdout=PIPE,
        stderr=PIPE,
        shell=True,
        text=True
    )
    stdout, stderr = p.communicate()
    print(stdout)
    print(stderr)
    return stdout + stderr
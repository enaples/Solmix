import re
from app.core.datamodels import CompilationResult
from subprocess import Popen

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


def parse_hardhat_output(p: Popen) -> CompilationResult:
    """
    Parse Hardhat compilation output and extract error/warning messages
    """
    stdout, stderr = p.communicate()
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
    
    return CompilationResult(
        success=p.returncode == 0,
        stderr=stderr,
        stdout=stdout,
        messages=messages
    )
'use server'

function extractSolidityCode(text: string) {
    const regex = /```solidity\s*([\s\S]*?)\s*```/;
    text = text.replace(/\\n/g, "\n")
        .replace(/\\t/g, "\t")
        .replace(/\\"/g, '"');
    const match = text.match(regex);

    return match ? match[1] : "Error: no generated code";
}

export async function editSmartContract(user_prompt: string, current_solidity_code: string) {
    const newBody = {
        message: user_prompt,
        code: current_solidity_code
    }
    const res = await fetch('http://127.0.0.1:8000/edit', {
        method: 'POST',
        body: JSON.stringify(newBody),
        headers: {
            'Content-type': 'application/json'
        }
    });
    let new_code = await res.text();

    return extractSolidityCode(new_code);
}

export async function commentSmartContract(current_solidity_code: string) {
    const newBody = {
        code: current_solidity_code
    }
    const res = await fetch('http://127.0.0.1:8000/comment', {
        method: 'POST',
        body: JSON.stringify(newBody),
        headers: {
            'Content-type': 'application/json'
        }
    });
    let new_code = await res.text()

    return extractSolidityCode(new_code);
}

export async function explainSmartContract(current_solidity_code: string) {
    const newBody = {
        code: current_solidity_code
    }
    const res = await fetch('http://127.0.0.1:8000/explain', {
        method: 'POST',
        body: JSON.stringify(newBody),
        headers: {
            'Content-type': 'application/json'
        }
    });
    return (await res.text()).replace(/\\n/g, "\n")
        .replace(/\\t/g, "\t")
        .replace(/\\"/g, '"');;
}
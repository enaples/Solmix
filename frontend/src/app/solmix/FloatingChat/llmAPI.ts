'use server'

import OpenAI from "openai";

// import {PoeClient} from "poe-node-api";
// https://www.npmjs.com/package/poe-node-api

// import { PoeApi } from "poe-api-js";
// https://github.com/yuangwei/poe-api-js

function RemoveSolidityDeclaration(x: string): string {
    const lines = x.split('\n');

    if (lines.length > 1) {
        lines.shift(); // Remove first line
        lines.pop();   // Remove last line
    }
    return lines.join('\n')
}

export async function sendLLMessage(message: string, current_solidity_code: string) {
    // https://platform.openai.com/docs/overview
    const openai_key = process.env.OPENAI_KEY
    const client = new OpenAI({ apiKey: openai_key });

    const prompt = `User request:\n${message}
    \n\nYou are a smart contract and solidity expert, process the user request editing the following smart contract in solidity:
    \n${current_solidity_code}
    \n\nReturn only the Solidity code.`;  // todo: regex per estrarre il codice dalla pipeline

    const response = await client.responses.create({
        model: "gpt-4o-mini",
        input: prompt,
    });
    let answer = response.output_text;

    // remove first and last row (contains solidity declaration)
    answer = RemoveSolidityDeclaration(answer)
    return answer;
}

export async function commentSmartContract(current_solidity_code: string) {
    // https://platform.openai.com/docs/overview
    const openai_key = process.env.OPENAI_KEY
    const client = new OpenAI({ apiKey: openai_key });

    const prompt = `You are a smart contract and solidity expert, add comments to the following smart contract in solidity in order to make it readable to not-skilled users:
    \n${current_solidity_code}
    \n\nReturn only the Solidity code.`;  // todo: regex per estrarre il codice dalla pipeline

    const response = await client.responses.create({
        model: "gpt-4o-mini",
        input: prompt,
    });
    let answer = response.output_text;

    // remove first and last row (contains solidity declaration)
    answer = RemoveSolidityDeclaration(answer);  // TODO: use regex to extract solidity code
    return answer;
}

export async function explainSmartContract(current_solidity_code: string) {
    // https://platform.openai.com/docs/overview
    const openai_key = process.env.OPENAI_KEY
    const client = new OpenAI({ apiKey: openai_key });

    const prompt = `As a solidity expert, explain this smart contract in simple terms to someone new to blockchain development. Cover:
    \n1. What this contract is designed to do
    \n2. Its main purpose and goals
    \n3. A beginner-friendly explanation of how it works internally
    \n4. Any potential risks or important considerations
    
    Avoid technical jargon when possible, and when you must use technical terms, provide brief explanations. Use analogies where helpful. No intro is needed.
    \n\nSmart Contract:
    \n"""\n${current_solidity_code}\n"""`;

    const response = await client.responses.create({
        model: "gpt-4o-mini",
        input: prompt,
    });
    let answer = response.output_text;
    return answer;
}
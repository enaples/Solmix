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
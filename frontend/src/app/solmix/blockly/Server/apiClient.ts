import * as Blockly from "blockly";
import { createBlocksFromAST, positionBlocks } from "./astToBlocks";

let globalSourceCode = "";

export function setSourceCode(code: string): void {
  globalSourceCode = code;
}

export async function sendSolidityToServer(solidityCode: string): Promise<void> {
  try {
    const response = await fetch("http://localhost:3030/parse-solidity", { //4000
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ solidityCode }),
    });

    if (!response.ok) {
      throw new Error(`Errore server: ${response.status}`);
    }

    const ast = await response.json();
    console.log("✅ AST ricevuto dal server:", ast);

    setSourceCode(solidityCode);
    updateUIWithParsedData(ast);
  } catch (error) {
    console.error("❌ Errore nell'invio del codice Solidity:", error);
  }
}


export function updateUIWithParsedData(parsedData: any): void {
  const ws = Blockly.getMainWorkspace();
  if (!ws) {
    console.error("❌ Workspace non disponibile.");
    return;
  }

  const blocklyJson = createBlocksFromAST(parsedData);
  console.log("🔧 JSON Blockly generato:", blocklyJson);
  console.log(JSON.stringify(blocklyJson, null, 2));
  Blockly.serialization.workspaces.load(blocklyJson, ws);
  const blocks = ws.getAllBlocks();
  console.log("🧩 Blocchi ottenuti:", blocks);
  positionBlocks(blocks);
}



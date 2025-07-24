import { SourceUnit, ImportDirective, ContractDefinition } from "solidity-antlr4";
import * as Blockly from "blockly";

let globalSourceCode = "";

export interface BlocklyBlock {
  type: string;
  fields: Record<string, any>;
  id: string;
  parent?: string;
  data?: string;
}

export interface BlocklyJson {
  blocks: {
    languageVersion: number;
    blocks: BlocklyBlock[];
    //comments: [];
  };
}

// Funzione principale
export function createBlocksFromAST(ast: any): BlocklyJson {
  const blocklyJson: BlocklyJson  = {
    blocks: {
        languageVersion: 0,
        blocks: [],
    }
};


  const variableTypes: Record<string, string> = {}; // nome -> tipo

  function traverse(node: any, parentBlockId: string | null = null): void {
    if (!node || typeof node !== 'object') return;

    switch (node.type) {
      case "SourceUnit": {
        const structureBlockId = generateUniqueId();
        const pragma = node.nodes[0]?.literals?.[1];
        
        const structureBlock: BlocklyBlock = {
          type: "structure",
          fields: { PRAGMA: pragma },
          id: structureBlockId
        };
        blocklyJson.blocks.blocks.push(structureBlock);

        if (node.nodes) {
          const sortedChildren = node.nodes.slice().sort((a: any, b: any) => {
            if (a.range && b.range) return b.range[0] - a.range[0];
            return 0;
          });

          sortedChildren.forEach((child: any) => {
            traverse(child, structureBlockId);
          });
        }
        break;
      }

      case "ImportDirective": {
        const importBlockId = generateUniqueId();
        const importName = node.symbolAliases?.[0]?.foreign?.name || "";
        const importPath = node.path?.name || "";

        const importBlock: BlocklyBlock = {
          type: "import",
          fields: {
            Imp1: importName,
            Imp2: importPath
          },
          id: importBlockId,
          parent: parentBlockId || undefined,
          data: JSON.stringify({ parentId: parentBlockId })
        };
        blocklyJson.blocks.blocks.push(importBlock);
        console.log("Import Block added to the blockly json");
        break;
      }

      case "ContractDefinition": {
        const contractBlockId = generateUniqueId();
        const baseContracts = node.baseContracts || [];

        const isFieldValue = baseContracts.map((b: any) => b.baseName.name).join(', ');

        const contractBlock: BlocklyBlock = {
          type: "contract",
          fields: {
            NAME: node.name.name,
            IS: isFieldValue
          },
          id: contractBlockId,
          parent: parentBlockId || undefined,
          data: JSON.stringify({ parentId: parentBlockId })
        };
        blocklyJson.blocks.blocks.push(contractBlock);
        console.log("contractBlock added to the blockly json");

        if (node.nodes) {
          node.nodes.forEach((child: any) => {
            traverse(child, contractBlockId);
          });
        }

        break;
      }
    }
  }

  traverse(ast);
  return blocklyJson;
}

function generateUniqueId(): string {
  return 'block_' + Math.random().toString(36).slice(2, 11);
}


/**
 * Posiziona i blocchi nel workspace Blockly.
 * @param blocks Array di blocchi da posizionare
 */
export function positionBlocks(blocks: Blockly.Block[]): void {
  let x = 20, y = 20;
  const yOffset = 300;

  function placeBlock(block: Blockly.Block, x: number, y: number) {
    block.moveBy(x, y);
    console.log(`Posizionato blocco ${block.type} (ID: ${block.id}) a X:${x}, Y:${y}`);
  }

  // Primo passaggio: posizionare il blocco di tipo "structure"
  blocks.forEach((block) => {
    if (!block) return;
    console.log(`Blocchi in posizionamento: ID=${block.id}, Tipo=${block.type}, Parent=${block.data}`);

    if (["structure"].includes(block.type)) {
      placeBlock(block, x, y);
      console.log(`Parent ${block.type} (ID: ${block.id}) posizionato a X:${x}, Y:${y}`);
    }
  });

  // Secondo passaggio: connettere i blocchi import e contract al blocco structure
  blocks.forEach((block) => {
    if (!block) return;

    let parentId: string | null = null;
    let section: string | null = null;

    try {
      const data = block.data ? JSON.parse(block.data) : {};
      parentId = data.parentId || null;
      section = data.section || null;
    } catch (e) {
      console.warn(`⚠️ Errore nel parsing dei dati del blocco ${block.id}:`, e);
    }

    console.log(`Blocco ID=${block.id}, Tipo=${block.type}, Parent=${parentId}, Section=${section}`);

    if (block.type === "contract" || block.type === "import") {
      const parent = blocks.find(b => b.type === "structure" && b.id === parentId);
      if (!parent) return;

      const inputImports = parent.getInput('IMPORT');
      const inputContracts = parent.getInput('CONTRACT');

      if (inputImports && inputImports.connection && block.type === "import") {
        if (block.previousConnection) {
          inputImports.connection.connect(block.previousConnection);
        }
      }

      if (inputContracts && inputContracts.connection && block.type === "contract") {
        if (block.previousConnection) {
          inputContracts.connection.connect(block.previousConnection);
        }
      }
    }
  });
}

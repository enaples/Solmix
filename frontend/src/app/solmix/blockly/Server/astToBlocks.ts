import { SourceUnit, ImportDirective, ContractDefinition } from "solidity-antlr4";
import * as Blockly from "blockly";
import { structRegistry } from "../dropdown/dropdown";
import { createGetterSetterBlocks } from "../toolbox/create_dynamic_variables";
import { SolidityAccess } from "../dropdown/dropdown";
import type { WorkspaceSvg } from 'blockly';

//const workspace: WorkspaceSvg = Blockly.getMainWorkspace() as WorkspaceSvg;
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
export function createBlocksFromAST(ast: any, workspace: Blockly.WorkspaceSvg): BlocklyJson {
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

      case "FunctionDefinition": {
        const visibilityMap: { [key: string]: string } = {
          public: "TYPE_PUBLIC",
          private: "TYPE_PRIVATE",
          internal: "TYPE_INTERNAL",
          external: "TYPE_EXTERNAL"
        };

        const returnType: { [key: string]: string } = {
          bool: "TYPE_BOOL",
          int: "TYPE_INT",
          uint: "TYPE_UINT",
          uint256: "TYPE_UINT256",
          uint8: "TYPE_UINT8",
          string: "TYPE_STRING",
          address: "TYPE_ADDRESS",
          bytes: "TYPE_BYTES",
          bytes32: "TYPE_BYTES32"
        };

        if (node.functionKind === "constructor") {
          const constructorBlockId = generateUniqueId();
          //if (!node.modifiers) return "";

          const formatArgument = (arg: any): string => {
            if (arg.type === "StringLiteral") return `"${arg.value}"`;
            if (arg.type === "Identifier") return arg.name;
            if (arg.type === "NumberLiteral") return arg.value;
            return "/* unsupported arg type */";
          };

          const formatModifier = (mod: any): string => {
            const name = mod.name?.name || mod.name;
            if (mod.arguments?.length > 0) {
              const args = mod.arguments.map(formatArgument).join(", ");
              return `${name}(${args})`;
            }
            return name;
          };

          const modifiers = node.modifiers.map(formatModifier);

          const constructorBlock: BlocklyBlock = {
            type: "contract_constructor",
            //statements: [],
            fields: {
              MODIFIERS: modifiers.join(", ")
            },
            id: constructorBlockId,
            parent: parentBlockId || undefined,
            data: JSON.stringify({ parentId: parentBlockId })
          };

          console.log(`Constructor - ID: ${constructorBlock.id}, Parent: ${parentBlockId}`);
          blocklyJson.blocks.blocks.push(constructorBlock);

          node.parameters?.forEach((param: any) => {
            const paramBlockId = generateUniqueId();
            const typeName = param.typeName?.name || "";
            const typeStr = returnType[typeName] || typeName;
            const name = param.name?.name || "param";
            const dataLocation = param.dataLocation?.name || "";
            const completeName = dataLocation ? `${dataLocation} ${name}` : name;

            const blockType = returnType[typeName] ? "func_inputs" : "func_inputs_black";

            const paramBlock: BlocklyBlock = {
              type: blockType,
              fields: {
                TYPE: typeStr,
                NAME: completeName
              },
              id: paramBlockId,
              parent: constructorBlock.id,
              data: JSON.stringify({ parentId: constructorBlock.id })
            };

            blocklyJson.blocks.blocks.push(paramBlock);
          });

          if (node.body?.statements) {
            const sortedStatements = node.body.statements.slice().sort((a: any, b: any) => b.range[0] - a.range[0]);

            sortedStatements.forEach((statement: any) => {
              if (statement.type === "ExpressionStatement" && statement.expression.type === "Assignment") {
                const assignment = statement.expression;
                const varName = assignment.left.name;

                if (variableTypes[varName]) {
                  console.log("Variabile trovata: " + variableTypes[varName]);

                  const varType = variableTypes[varName];
                  const setBlockId = generateUniqueId();
                  let setblock: BlocklyBlock | null = null;

                  const blockTypeMap: { [key: string]: string } = {
                    string: "variables_set_string",
                    uint: "variables_set_uint",
                    uint256: "variables_set_uint256",
                    uint8: "variables_set_uint8",
                    int: "variables_set_int",
                    address: "variables_set_address",
                    bool: "variables_set_bool"
                  };

                  const setterType = blockTypeMap[varType];

                  if (setterType) {
                    setblock = {
                      type: setterType,
                      fields: { VAR: varName },
                      id: setBlockId,
                      parent: constructorBlock.id,
                      data: JSON.stringify({ parentId: constructorBlock.id })
                    };
                    blocklyJson.blocks.blocks.push(setblock);

                    const inputBlockId = generateUniqueId();
                    let returnvalue_: string = "";
                    const right = assignment.right;

                    if (right.type === "MemberAccess" && right.expression?.type === "Identifier") {
                      if (right.expression.name === "msg" && right.memberName === "sender") {
                        returnvalue_ = "msg.sender";
                      } else if (right.expression.name === "msg" && right.memberName === "value") {
                        returnvalue_ = "msg.value";
                      }
                    } else {
                      returnvalue_ = right.name || right.value || "";
                    }

                    const returnvalueBlock: BlocklyBlock = {
                      type: "input",
                      fields: { input_name: returnvalue_ },
                      id: inputBlockId,
                      parent: setBlockId,
                      data: JSON.stringify({ parentId: setBlockId })
                    };
                    blocklyJson.blocks.blocks.push(returnvalueBlock);
                  }
                } else {
                    console.warn(`⚠️ Variabile ${varName} non trovata in variableTypes`);
                    //window.alert(`⚠️ Variabile ${varName} non trovata in variableTypes`);
                }
               
              }
            });
          }
        }
        break;
      }
      // parte di function

      case "VariableDeclaration": {
        const solidityTypeToBlocklyType: Record<string, string> = {
          "bool[]": "TYPE_BOOL",
          "int[]": "TYPE_INT",
          "uint[]": "TYPE_UINT",
          "uint256[]": "TYPE_UINT256",
          "uint8[]": "TYPE_UINT8",
          "string[]": "TYPE_STRING",
          "address[]": "TYPE_ADDRESS",
          "bytes[]": "TYPE_BYTES",
          "bytes32[]": "TYPE_BYTES32",
        };

        if (
          node.expression &&
          node.expression.type === "FunctionCall" &&
          node.expression.expression.name === node.typeName.name
        ) {
          const structName: string = node.typeName.name;
          //addStruct(structName);
          const varName: string = node.name.name;
          const args = node.expression.arguments;
          console.log("📦 args ricevuti nella FunctionCall:", args);

          const structValues: Record<string, any> = {};
          const structDefinition = structRegistry[structName];
          console.log("📚 attributi definiti nello structRegistry:", structDefinition);

          if (Array.isArray(args) && Array.isArray(structDefinition)) {
            structDefinition.forEach((attr: any, index: number) => {
              const arg = args[index];
              if (!arg) return;

              let value: any = null;
              switch (arg.type) {
                case "BooleanLiteral":
                case "NumberLiteral":
                case "StringLiteral":
                  value = arg.value;
                  break;
                case "Identifier":
                  value = arg.name;
                  break;
                default:
                  value = `/* unsupported ${arg.type} */`;
              }
              structValues[attr.name] = value;
              console.log("structValue " + structValues[attr.name] + ": " + value);
            });
          }

          const variableBlockId = generateUniqueId();
          const variableBlock : BlocklyBlock = {
            type: "define_struct_variable_with_assignment",
            fields: {
              TYPE: structName,
              NAME: varName
            },
            id: variableBlockId,
            parent: parentBlockId || undefined,
            data: JSON.stringify({ parentId: parentBlockId })
          };
          //variableBlock.data = JSON.stringify({ parentId: variableBlock.parent });
          blocklyJson.blocks.blocks.push(variableBlock);

          const newStructBlockId = generateUniqueId();
          const newStructBlock = {
            type: "new_struct",
            fields: {
              VAR: structName
            },
            id: newStructBlockId,
            parent: variableBlock.id,
            data: JSON.stringify({ parentId: parentBlockId, values: structValues })
          };
          //newStructBlock.data = JSON.stringify({ parentId: newStructBlock.parent, values: structValues });
          blocklyJson.blocks.blocks.push(newStructBlock);
        } else if (node.typeName.type === "MappingType") {
          const visibilityMapping: Record<string, string> = {
            public: "TYPE_PUBLIC",
            private: "TYPE_PRIVATE",
            internal: "TYPE_INTERNAL",
            external: "TYPE_EXTERNAL"
          };

          const returnTypeMapping: Record<string, string> = {
            bool: "TYPE_BOOL",
            int: "TYPE_INT",
            uint: "TYPE_UINT",
            uint256: "TYPE_UINT256",
            uint8: "TYPE_UINT8",
            string: "TYPE_STRING",
            address: "TYPE_ADDRESS",
            bytes: "TYPE_BYTES",
            bytes32: "TYPE_BYTES32"
          };

          const visibility = node.public
            ? "public"
            : node.private
            ? "private"
            : node.internal
            ? "internal"
            : "external";
          
            
          const mappingBlockId = generateUniqueId();
          const variableBlock: any = {
            type: "mapping",
            fields: {
              TYPE3: visibilityMapping[visibility],
              TYPE1: returnTypeMapping[node.typeName.keyType.name],
              TYPE2: returnTypeMapping[node.typeName.valueType.name],
              NAME: node.name.name
            },
            id: mappingBlockId,
            parent: parentBlockId
          };
          variableBlock.data = JSON.stringify({ parentId: variableBlock.parent });
          //addMapping(node.name.name);
          blocklyJson.blocks.blocks.push(variableBlock);
        } else if (node.typeName.type === "TypeName") {
          let variableBlock: any;
          const varName = node.name.name;

          const visibilityArray: Record<string, string> = {
            public: "TYPE_PUBLIC",
            private: "TYPE_PRIVATE",
            internal: "TYPE_INTERNAL",
            external: "TYPE_EXTERNAL"
          };

          const returnTypeArray: Record<string, string> = {
            "bool[]": "TYPE_BOOL",
            "int[]": "TYPE_INT",
            "uint[]": "TYPE_UINT",
            "uint256[]": "TYPE_UINT256",
            "uint8[]": "TYPE_UINT8",
            "string[]": "TYPE_STRING",
            "address[]": "TYPE_ADDRESS",
            "bytes[]": "TYPE_BYTES",
            "bytes32[]": "TYPE_BYTES32"
          };

          const visibility = node.public
            ? "public"
            : node.private
            ? "private"
            : node.internal
            ? "internal"
            : "external";

          if (returnTypeArray[node.typeName.name] === undefined) {
            //addStructArray(varName); --> da inserire
            const StructArrayBlockId = generateUniqueId();
            variableBlock = {
              type: "structs_array",
              fields: {
                VAR: node.name,
                TYPE3: visibilityArray[visibility],
                NAME: varName
              },
              id: StructArrayBlockId,
              parent: parentBlockId
            };
          } else if (
            returnTypeArray[node.typeName.name] !== undefined &&
            node.expression?.type !== "FunctionCall"
          ) {
            if (node.expression?.type === "InlineArray") {
              const arraySolidityType = node.typeName.name;
              const blocklyType = solidityTypeToBlocklyType[arraySolidityType];

              if (!blocklyType) {
                console.warn(`Tipo ${arraySolidityType} non supportato.`);
                return;
              }

              const arrayName = node.name.name;
              //addArray(arrayName); --> da inserire
              const visibility = node.public
                ? "TYPE_PUBLIC"
                : node.private
                ? "TYPE_PRIVATE"
                : node.internal
                ? "TYPE_INTERNAL"
                : "TYPE_EXTERNAL";

              const values = node.expression.expressions
                .map((expr: any) => {
                  if (expr.type === "StringLiteral") return `"${expr.value}"`;
                  if (expr.type === "BooleanLiteral") return expr.value;
                  return expr.value;
                })
                .join(", ");

              const blockId = generateUniqueId();
              variableBlock = {
                type: "assign_values_to_variable_array",
                id: blockId,
                fields: {
                  TYPE1: blocklyType,
                  TYPE3: visibility,
                  NAME: arrayName,
                  VALUES: values
                },
                parent: parentBlockId
              };
            } else {
              //addArray(node.name.name); --> da inserire
              const ArrayBlockId = generateUniqueId();
              variableBlock = {
                type: "array",
                fields: {
                  TYPE1: returnTypeArray[node.typeName.name],
                  TYPE3: visibilityArray[visibility],
                  NAME: node.name.name
                },
                id: ArrayBlockId,
                parent: parentBlockId
              };
            }
          } else if (
            node.type === "VariableDeclaration" &&
            node.typeName?.type === "TypeName" &&
            node.expression &&
            node.expression.type === "FunctionCall" &&
            node.expression.expression.type === "NewExpr"
          ) {
            console.log("Case ASSIGNMENT OF VALUES TO AN ARRAY VARIABLE");

            const arrayType: string = node.typeName.name || "";
            const arrayName: string = node.name?.name || "";
            const newExprType: string = node.expression.expression.typeName?.name || "";
            const values: string =
              node.expression.arguments?.map((arg: any) => arg.value).join(", ") || "";

            const blockId: string = generateUniqueId();

            const variableBlock: any = {
              type: "define_arrayVariable",
              id: blockId,
              fields: {
                TYPE: arrayType,
                NAME: arrayName,
                TYPE1: newExprType,
                VALUES: values,
              },
              parent: parentBlockId,
            };

            variableBlock.data = JSON.stringify({ parentId: variableBlock.parent });
            blocklyJson.blocks.blocks.push(variableBlock);
          }

          

        } else {
          // TS conversion of the 'else' section in VariableDeclaration

          const varName: string = node.name.name;
          console.log(varName);

          const varType: string = node.typeName.name;
          console.log(varType);

          variableTypes[varName] = varType;
          console.log("variableTypes aggiornata");

          let varAccess: SolidityAccess = "external";
          if (node.public) varAccess = "public";
          else if (node.private) varAccess = "private";
          else if (node.internal) varAccess = "internal";
          console.log(varAccess);

          const constant: boolean = node.constant;
          const varConstant: "yes" | "not" = constant ? "yes" : "not";
          console.log(constant);
          console.log(varConstant);

          const immutable: boolean = node.immutable;
          const varImmutable: "yes" | "not" = immutable ? "yes" : "not";
          console.log(immutable);
          console.log(varImmutable);

          const isPayable: boolean = node.typeName.payable;
          const payable: "yes" | "doesn't matter" = isPayable ? "yes" : "doesn't matter";
          console.log(isPayable);
          console.log(payable);

          const defineBlockId: string = generateUniqueId();
          let defineBlock: BlocklyBlock;
          console.log("node.expression: " + node.expression);

          if (node.expression !== null) {
            const baseValue: string = node.expression.value;
            const subDenomination: string | undefined = node.expression.subDenomination;
            const valueCode: string = subDenomination ? `${baseValue} ${subDenomination}` : baseValue;

            if (["string", "address", "bytes", "bytes32"].includes(varType)) {
              createGetterSetterBlocks(varName, varType, varAccess, payable, varConstant, varImmutable, workspace); 
              defineBlock = {
                type: "define_variable_with_assignment1",
                fields: { ASSIGNED_VALUE: valueCode },
                id: defineBlockId,
                parent: parentBlockId || undefined
              };
            } else if (["uint", "uint8", "uint256", "int", "bool"].includes(varType)) {
              createGetterSetterBlocks(varName, varType, varAccess, payable, varConstant, varImmutable, workspace); 
              defineBlock = {
                type: "define_variable_with_assignment",
                fields: { ASSIGNED_VALUE: valueCode },
                id: defineBlockId,
                parent: parentBlockId || undefined
              };
            } else if (node.expression.type === "IndexAccess") {
              const base = node.expression.baseExpression.name;
              const index = node.expression.indexExpression.value;
              const assignedValue = `${base}[${index}]`;

              createGetterSetterBlocks(varName, varType, varAccess, payable, varConstant, varImmutable, workspace);
              defineBlock = {
                type: "define_variable_with_assignment",
                fields: {
                  VALUE: varName,
                  ASSIGNED_VALUE: assignedValue
                },
                id: defineBlockId,
                parent: parentBlockId || undefined
              };
            } else {
              createGetterSetterBlocks(varName, varType, varAccess, payable, varConstant, varImmutable, workspace);
              defineBlock = {
                type: "define_variable_with_assignment",
                fields: { ASSIGNED_VALUE: valueCode },
                id: defineBlockId,
                parent: parentBlockId || undefined
              };
            }
          } else {
            defineBlock = {
              type: "define_variable",
              fields: {},
              id: defineBlockId,
              parent: parentBlockId || undefined
            };
          }
          defineBlock.data = JSON.stringify({ parentId: defineBlock.parent });
          blocklyJson.blocks.blocks.push(defineBlock);

          const variableBlockId: string = generateUniqueId();
          let variableBlock: BlocklyBlock;

          if (!["string", "uint", "uint256", "uint8", "int", "address", "bool", "bytes", "bytes32"].includes(varType)) {
            const value = `${varType} ${node.name.name}`;
            variableBlock = {
              type: "variables_black_block",
              fields: { VAR: value },
              id: variableBlockId,
              parent: defineBlockId
            };
          } else {
            createGetterSetterBlocks(varName, varType, varAccess, payable, varConstant, varImmutable, workspace);
            const baseBlockType = `variables_get_${varType}`;
            const suffix = varConstant === "yes" ? "_constants" : varImmutable === "yes" ? "_immutables" : "";

            variableBlock = {
              type: `${baseBlockType}${suffix}`,
              fields: { VAR: varName },
              id: variableBlockId,
              parent: defineBlock.id
            };
          }

          variableBlock.data = JSON.stringify({ parentId: variableBlock.parent });
          blocklyJson.blocks.blocks.push(variableBlock);


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

//npx ts-node src/app.ts



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

import { SourceUnit, ImportDirective, ContractDefinition } from "solidity-antlr4";
import * as Blockly from "blockly";
import { structRegistry } from "../dropdown/dropdown";
import { createGetterSetterBlocks } from "../toolbox/create_dynamic_variables";
import { SolidityAccess, addEvent, addMapping, addArray, addModifier, addStruct, saveStruct, addStructArray, findVariable, findVariableType} from "../dropdown/dropdown";
import { getSolidityStringVariable } from "../dropdown/dropdown";
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
        } else {
          // parte di method
          const functionBlockId: string = generateUniqueId();
          const overrideNames: string[] = node.override
            ? node.override.map((o: any) => o.name).filter(Boolean)
            : [];

          const functionBlock: BlocklyBlock = {
            type: "method",
            fields: {
              NAME: node.name.name,
              ACCESS: visibilityMap[node.visibility] || "TYPE_PUBLIC",
              VIEW: node.stateMutability === "view" ? "TYPE_YES" : "TYPE_FALSE",
              PURE: node.stateMutability === "pure" ? "TYPE_YES" : "TYPE_FALSE",
              RETURN: node.returnParameters?.length > 0 ? "TYPE_YES" : "TYPE_FALSE",
              PAYABLE: node.stateMutability === "payable" ? "TYPE_YES" : "TYPE_FALSE",
              OVERRIDE: overrideNames.join(", ")
            },
            id: functionBlockId,
            parent: parentBlockId || undefined
          };
          functionBlock.data = JSON.stringify({ parentId: functionBlock.parent });
          blocklyJson.blocks.blocks.push(functionBlock);

          const operatorMapping: Record<string, string> = {
            "!": "NOT",
            "!=": "NOT_EQUAL",
            "==": "EQUAL",
            ">=": "BIGGER OR EQUAL TO",
            "<=": "LOWER OR EQUAL TO",
            ">": "BIGGER THAN",
            "<": "LOWER THAN"
          };

          // Modifiers
          node.modifiers?.forEach((modifier: any) => {
            addModifier(modifier.name.name);
            const ModifierGetterBlockId: string = generateUniqueId();

            const ModifierGetterBlock: BlocklyBlock = {
              type: "variables_get_modifiers",
              fields: {
                VAR: modifier.name.name
              },
              id: ModifierGetterBlockId,
              parent: functionBlock.id
            };
            ModifierGetterBlock.data = JSON.stringify({ parentId: ModifierGetterBlock.parent });
            blocklyJson.blocks.blocks.push(ModifierGetterBlock);

            modifier.arguments?.forEach((param: any) => {
              const functionParameterBlockId: string = generateUniqueId();
              const paramBlock: BlocklyBlock = {
                type: "func_inputs",
                fields: {
                  TYPE: getSolidityStringVariable(param.name),
                  NAME: param.name || "param"
                },
                id: functionParameterBlockId,
                parent: ModifierGetterBlock.id
              };
              paramBlock.data = JSON.stringify({ parentId: paramBlock.parent });
              blocklyJson.blocks.blocks.push(paramBlock);
            });
          });

          // Parameters
          node.parameters?.forEach((param: any) => {
            const functionParameterBlockId: string = generateUniqueId();
            const typeName = param.typeName.name;
            const isKnownType = [
              "int", "bool", "uint", "uint256", "uint8",
              "string", "address", "bytes32"
            ].includes(typeName);
            
            const name = param.name?.name || "param";
            const datalocation = param.dataLocation?.name || "";
            const completeName = datalocation ? `${datalocation} ${name}` : name;

            if (isKnownType) {
              const typeStr = returnType[typeName];
              const paramBlock: BlocklyBlock = {
                type: "func_inputs",
                fields: { TYPE: typeStr, NAME: completeName },
                id: functionParameterBlockId,
                parent: functionBlock.id
              };
              paramBlock.data = JSON.stringify({ parentId: paramBlock.parent });
              blocklyJson.blocks.blocks.push(paramBlock);
            } else {
              let typeStr = typeName;
              if (param.dataLocation) typeStr += ` ${param.dataLocation.name}`;
              const paramBlockBlack: BlocklyBlock = {
                type: "func_inputs_black",
                fields: { TYPE: typeStr, NAME: name },
                id: functionParameterBlockId,
                parent: functionBlock.id
              };
              paramBlockBlack.data = JSON.stringify({ parentId: paramBlockBlack.parent });
              blocklyJson.blocks.blocks.push(paramBlockBlack);
            }
          });

          // Return values
          node.returnParameters?.forEach((value: any) => {
            const functionReturnValueBlockId: string = generateUniqueId();
            const returnValueBlock: BlocklyBlock = {
              type: "func_returnValues",
              fields: {
                TYPE: returnType[value.typeName.name] || "TYPE_UNKNOWN",
                NAME: value.name?.name || "value"
              },
              id: functionReturnValueBlockId,
              parent: functionBlock.id
            };
            returnValueBlock.data = JSON.stringify({ parentId: returnValueBlock.parent });
            blocklyJson.blocks.blocks.push(returnValueBlock);
          });

          if (node.body && node.body.statements) {
            //const sortedStatements = node.body.statements.slice().sort((a, b) => b.range[0] - a.range[0]);
            const sortedStatements = node.body.statements.slice().sort((a: any, b: any) => b.range[0] - a.range[0]);


            sortedStatements.forEach((statement: any) => {
              if (statement.type === "ExpressionStatement" && statement.expression.type === "FunctionCall") {
                if (statement.expression.expression.name === "require") {
                  console.log("require inside method rilevata!");

                  const requireNode = statement.expression;
                  console.log("AST requireNode:", requireNode);

                  let conditionType = "";
                  let left = "";
                  let right: any;

                  if (requireNode.arguments?.length > 0) {
                    const requireConditionBlockMethodId = generateUniqueId();
                    const requireConditionMethodBlock: BlocklyBlock = {
                      type: "require_condition_method1",
                      fields: {
                        MESSAGE: requireNode.arguments[1]?.value || ""
                      },
                      id: requireConditionBlockMethodId,
                      parent: functionBlock.id
                    };
                    requireConditionMethodBlock.data = JSON.stringify({ parentId: requireConditionMethodBlock.parent });
                    blocklyJson.blocks.blocks.push(requireConditionMethodBlock);

                    const requireArg = requireNode.arguments[0];
                    let conditionExpression: any = null;

                    if (requireArg?.expressions?.length) {
                      conditionExpression = requireArg.expressions[0];
                    } else {
                      conditionExpression = requireArg;
                    }

                    if (!conditionExpression) {
                      console.error("❌ Errore: impossibile trovare l'espressione logica nel require()");
                    } else {
                      console.log("✅ conditionExpression trovata:", conditionExpression);
                    }

                    if (conditionExpression && conditionExpression.operator) {
                      const solidityOperator = conditionExpression.operator;
                      console.log("Operatore trovato nel require:", solidityOperator);

                      conditionType = operatorMapping[solidityOperator] || "EQUAL";

                      let inputBlockRight: BlocklyBlock;
                      let requireConditionBlock: BlocklyBlock;

                      if (solidityOperator === "!") {
                        console.log("Mapping operatore Blockly:", conditionType);

                        right = conditionExpression.right;
                        console.log("Right:", right);

                        const requireConditionBlockId = generateUniqueId();
                        requireConditionBlock = {
                          type: "require_condition",
                          fields: {
                            OPERATOR: conditionType
                          },
                          id: requireConditionBlockId,
                          parent: requireConditionMethodBlock.id
                        };
                        requireConditionBlock.data = JSON.stringify({ parentId: requireConditionBlock.parent });
                        blocklyJson.blocks.blocks.push(requireConditionBlock);

                        if (right.type === "IndexAccess") {
                          console.log("IndexAccess Riconosciuto");
                          const baseExpr = right.baseExpression;
                          const baseName = baseExpr.name;
                          const keyExpr = right.indexExpression;
                          const keyName = keyExpr.name || keyExpr.value;
                          let key: string;

                          if (baseExpr && keyExpr) {
                            key = `${baseName}[${keyName}]`;
                          } else {
                            key = keyName;
                          }

                          console.log("Key:", key);
                          const inputBlockRightId = generateUniqueId();

                          const type = findVariableType(ast, key);

                          if (type) {
                            const typeToBlockMap: Record<string, string> = {
                              string: "variables_get_string",
                              uint: "variables_get_uint",
                              uint256: "variables_get_uint256",
                              uint8: "variables_get_uint8",
                              int: "variables_get_int",
                              bool: "variables_get_bool",
                              address: "variables_get_address",
                              bytes: "variables_get_bytes",
                              bytes32: "variables_get_bytes32"
                            };

                            const blockType = typeToBlockMap[type];

                            if (blockType) {
                              inputBlockRight = {
                                type: blockType,
                                fields: {
                                  VAR: right.name
                                },
                                id: inputBlockRightId,
                                parent: requireConditionBlock.id
                              };
                            } else {
                              inputBlockRight = {
                                type: "input",
                                fields: {
                                  input_name: key
                                },
                                id: inputBlockRightId,
                                parent: requireConditionBlock.id
                              };
                            }
                          } else {
                            console.log("non è una variabile");
                            inputBlockRight = {
                              type: "input",
                              fields: {
                                input_name: key
                              },
                              id: inputBlockRightId,
                              parent: requireConditionBlock.id
                            };
                          }

                          inputBlockRight.data = JSON.stringify({ parentId: inputBlockRight.parent });
                          blocklyJson.blocks.blocks.push(inputBlockRight);
                          console.log("inptBlockRight for UnaryOperation created!");
                        }
                      } else if (
                        solidityOperator === "==" || solidityOperator === "!=" ||
                        solidityOperator === ">=" || solidityOperator === "<=" ||
                        solidityOperator === ">" || solidityOperator === "<"
                      ) {
                        conditionType = operatorMapping[solidityOperator] || "EQUAL";
                        console.log("Mapping operatore Blockly:", conditionType);

                        const left = conditionExpression.left;
                        const right = conditionExpression.right;
                        console.log("Left:", left);
                        console.log("Right:", right);

                        const requireConditionBlockId = generateUniqueId();
                        requireConditionBlock = {
                          type: "require_condition",
                          fields: {
                            OPERATOR: conditionType
                          },
                          id: requireConditionBlockId,
                          parent: requireConditionMethodBlock.id
                        };
                        requireConditionBlock.data = JSON.stringify({ parentId: requireConditionBlock.parent });
                        blocklyJson.blocks.blocks.push(requireConditionBlock);

                        if (right) {
                          const inputBlockRightId = generateUniqueId();
                          let inputBlockRight: BlocklyBlock;

                          if ("name" in right && findVariable(ast, right.name)) {
                            const type = findVariableType(ast, right.name);
                            console.log("name:", type);

                            const typeMap: Record<string, string> = {
                              string: "variables_get_string",
                              uint: "variables_get_uint",
                              uint256: "variables_get_uint256",
                              uint8: "variables_get_uint8",
                              int: "variables_get_int",
                              bool: "variables_get_bool",
                              bytes: "variables_get_bytes",
                              bytes32: "variables_get_bytes32",
                              address: "variables_get_address"
                            };

                            const blockType = type ? typeMap[type] : undefined;
                            if (blockType) {
                              inputBlockRight = {
                                type: blockType,
                                fields: { VAR: right.name },
                                id: inputBlockRightId,
                                parent: requireConditionBlock.id
                              };
                            } else {
                              throw new Error(`❌ Tipo non supportato: ${type}`);
                            }

                          } else {
                            let rightOperand = "";

                            if (right.type === "MemberAccess" && "memberName" in right) {
                              rightOperand = `${right.expression.name}.${right.memberName}`;
                            } else if (
                              right.type === "BinaryOperation" &&
                              right.operator === "*"
                            ) {
                              const leftOp = right.left.value;
                              const rightOp = right.right;

                              const rightStr =
                                rightOp.type === "BinaryOperation" && rightOp.operator === "**"
                                  ? `${rightOp.left.value}${rightOp.operator} ${rightOp.right.expression.name}()`
                                  : "<unsupported>";

                              rightOperand = `${leftOp} * ${rightStr}`;
                            } else if (
                              right.type === "FunctionCall" &&
                              right.expression.type === "ElementaryTypeName" &&
                              right.expression.name === "address"
                            ) {
                              if (
                                right.arguments?.[0]?.type === "NumberLiteral" &&
                                right.arguments[0].value === "0"
                              ) {
                                rightOperand = "address(0)";
                              } else if (
                                right.arguments?.[0]?.type === "Identifier" &&
                                right.arguments[0].name === "this"
                              ) {
                                rightOperand = "address(this)";
                              }
                            } else if (
                              right.type === "MemberAccess" &&
                              right.expression.type === "FunctionCall" &&
                              right.expression.expression.type === "ElementaryTypeName" &&
                              right.expression.expression.name === "address" &&
                              right.expression.arguments?.[0]?.type === "Identifier" &&
                              right.expression.arguments[0].name === "this" &&
                              right.memberName === "balance"
                            ) {
                              rightOperand = "address(this).balance";
                            } else {
                              rightOperand =
                                typeof right === "object"
                                  ? (right as any).name ?? (right as any).value ?? ""
                                  : String(right);
                            }

                            inputBlockRight = {
                              type: "input_right",
                              fields: {
                                input_name: rightOperand
                              },
                              id: inputBlockRightId,
                              parent: requireConditionBlock.id
                            };
                          }

                          inputBlockRight.data = JSON.stringify({ parentId: inputBlockRight.parent });
                          blocklyJson.blocks.blocks.push(inputBlockRight);
                        }
                        const inputBlockLeftId = generateUniqueId();
                        let inputBlockLeft: BlocklyBlock;

                        if ("name" in left && findVariable(ast, left.name)) {
                          const type = findVariableType(ast, left.name);
                          console.log("name:", type);

                          const typeMap: Record<string, string> = {
                            string: "variables_get_string",
                            uint: "variables_get_uint",
                            uint256: "variables_get_uint256",
                            uint8: "variables_get_uint8",
                            int: "variables_get_int",
                            bool: "variables_get_bool",
                            bytes: "variables_get_bytes",
                            bytes32: "variables_get_bytes32",
                            address: "variables_get_address"
                          };

                          const blockType = type ? typeMap[type] : undefined;

                          if (blockType) {
                            inputBlockLeft = {
                              type: blockType,
                              fields: {
                                VAR: left.name
                              },
                              id: inputBlockLeftId,
                              parent: requireConditionBlock.id
                            };
                          } else {
                            throw new Error(`❌ Tipo non supportato o non trovato per la variabile ${left.name}`);
                          }
                        } else {
                          let leftOperand: string;
                          
                        if (left.type === "MemberAccess" && left.memberName) {
                          leftOperand = `${left.expression.name}.${left.memberName}`;

                        } else if (left.type === "BinaryOperation" && left.operator === "-") {
                          const leftOp = left.left;
                          const rightOp = left.right;

                          const leftStr =
                            leftOp.type === "MemberAccess"
                              ? `${leftOp.expression.name}.${leftOp.memberName}`
                              : "<unsupported>";

                          const rightStr =
                            rightOp.type === "IndexAccess"
                              ? `${rightOp.baseExpression.name}[${rightOp.indexExpression.name}]`
                              : "<unsupported>";

                          leftOperand = `${leftStr} - ${rightStr}`;

                        } else if (left.type === "BinaryOperation" && left.operator === "+") {
                          const leftOp = left.left;
                          const rightOp = left.right;

                          const leftStr =
                            leftOp.type === "MemberAccess"
                              ? `${leftOp.expression.name}.${leftOp.memberName}`
                              : "<unsupported>";

                          const rightStr =
                            rightOp.type === "IndexAccess"
                              ? `${rightOp.baseExpression.name}[${rightOp.indexExpression.name}]`
                              : "<unsupported>";

                          leftOperand = `${leftStr} + ${rightStr}`;

                        } else if (
                          left.type === "FunctionCall" &&
                          left.expression.type === "ElementaryTypeName" &&
                          left.expression.name === "address" &&
                          left.arguments?.[0].type === "NumberLiteral" &&
                          left.arguments[0].value === "0"
                        ) {
                          leftOperand = "address(0)";

                        } else if (
                          left.type === "FunctionCall" &&
                          left.expression.type === "ElementaryTypeName" &&
                          left.expression.name === "address" &&
                          left.arguments?.[0].type === "Identifier" &&
                          left.arguments[0].name === "this"
                        ) {
                          leftOperand = "address(this)";

                        } else if (
                          left.type === "MemberAccess" &&
                          left.expression.type === "FunctionCall" &&
                          left.expression.expression.type === "ElementaryTypeName" &&
                          left.expression.expression.name === "address" &&
                          left.expression.arguments?.[0].type === "Identifier" &&
                          left.expression.arguments[0].name === "this" &&
                          left.memberName === "balance"
                        ) {
                          leftOperand = "address(this).balance";

                        } else {
                          leftOperand =
                            typeof left === "object"
                              ? (left as any).name ?? (left as any).value
                              : String(left);
                        }

                        inputBlockLeft = {
                          type: "input",
                          fields: {
                            input_name: leftOperand
                          },
                          id: inputBlockLeftId,
                          parent: requireConditionBlock.id
                        };
                      }
                      inputBlockLeft.data = JSON.stringify({ parentId: inputBlockLeft.parent });
                      blocklyJson.blocks.blocks.push(inputBlockLeft);
                      console.log("✅ inputBlockLeft for BinaryOperation created!");
                    } else if ('name' in conditionExpression) {
                      // Caso di singolo identificatore booleano (es. require(isValid))
                      right = conditionExpression;
                      conditionType = "EQUAL";  // Default: isValid == true
                    }
                  } else {
                    console.error("❌ Errore: il nodo requireNode non ha argomenti!");
                  }
                }
                } else if (statement.expression.expression.memberName === "pop") {
                  const popBlockId = generateUniqueId();
                  const popArrayBlock = {
                    type: "array_pop",
                    fields: {
                      VAR: statement.expression.expression.expression.name
                    },
                    id: popBlockId,
                    parent: functionBlock.id,
                    data: JSON.stringify({ parentId: functionBlock.id })
                  };
                  //popArrayBlock.data = JSON.stringify({ parentId: popArrayBlock.parent });
                  blocklyJson.blocks.blocks.push(popArrayBlock);

                } else if (statement.expression.expression.memberName === "push") {
                  const arguments_ = statement.expression.arguments;
                  let pushBlock: BlocklyBlock;

                  if (
                    arguments_ &&
                    arguments_[0]?.type === "FunctionCall"
                  ) {
                    const pushBlockId = generateUniqueId();
                    pushBlock = {
                      type: "struct_push",
                      fields: {
                        VAR: statement.expression.expression.expression.name,
                      },
                      id: pushBlockId,
                      parent: functionBlock.id
                    };
                    pushBlock.data = JSON.stringify({ parentId: pushBlock.parent });
                    blocklyJson.blocks.blocks.push(pushBlock);

                    const structBlockId = generateUniqueId();
                    const name_new_struct: string | null = arguments_[0].expression.name ?? null;

                    const structValues: Record<string, string | boolean> = {};

                    if (
                      arguments_[0].arguments?.[0]?.type === "NamedArgument"
                    ) {
                      arguments_[0].arguments.forEach((namedArg: any) => {
                        const key = namedArg.name.name;
                        let val: string | boolean;

                        switch (namedArg.expression.type) {
                          case "BooleanLiteral":
                          case "NumberLiteral":
                            val = namedArg.expression.value;
                            break;
                          case "StringLiteral":
                            val = `"${namedArg.expression.value}"`;
                            break;
                          case "Identifier":
                            val = namedArg.expression.name;
                            break;
                          default:
                            val = `/* unsupported type: ${namedArg.expression.type} */`;
                        }

                        if (key) {
                          structValues[key] = val;
                        }
                      });
                    }

                    const structBlock = {
                      type: "new_struct",
                      fields: {
                        VAR: name_new_struct
                      },
                      id: structBlockId,
                      parent: pushBlock.id,
                      data: JSON.stringify({ parentId: pushBlock.id, values: structValues })
                    };

                    console.log("→ StructValues da salvare:", JSON.stringify(structValues, null, 2));
                    blocklyJson.blocks.blocks.push(structBlock);

                  } else {
                    const pushBlockId = generateUniqueId();
                    const pushArrayBlock = {
                      type: "array_push",
                      fields: {
                        VAR: statement.expression.expression.expression.name,
                        PARAMS1: arguments_?.[0]?.value ?? null,
                      },
                      id: pushBlockId,
                      parent: functionBlock.id,
                      data: JSON.stringify({ parentId: functionBlock.id })
                    };
                    //pushArrayBlock.data = JSON.stringify({ parentId: pushArrayBlock.parent });
                    blocklyJson.blocks.blocks.push(pushArrayBlock);
                  }
                } else {
                  // Caso di _mint o chiamata a funzione interna
                  const InternalFuncBlockId: string = generateUniqueId();
                  let output: string = "";

                  const expr = statement.expression.expression;
                  const args: string = statement.expression.arguments
                    ?.map((arg: any) => arg.name ?? arg.value ?? "") // fallback su value se non ha name
                    .join(", ") ?? "";

                  if (expr.type === "MemberAccess" && expr.expression.name === "super") {
                    const fnName = expr.memberName;
                    output = `super.${fnName}(${args});`;
                  } else if (expr.type === "Identifier") {
                    const fnName = expr.name;
                    output = `${fnName}(${args});`;
                  } else {
                    // fallback generico (se vuoi gestire anche altri casi in futuro)
                    output = `${expr.name ?? "unknownFunction"}(${args});`;
                  }

                  const InternalFuncBlock: BlocklyBlock = {
                    type: "internalFunc",
                    fields: {
                      CODE: output
                    },
                    id: InternalFuncBlockId,
                    parent: functionBlock.id
                  };

                  InternalFuncBlock.data = JSON.stringify({ parentId: InternalFuncBlock.parent });
                  blocklyJson.blocks.blocks.push(InternalFuncBlock);
                }
              } else if (
                  statement.type === "ExpressionStatement" &&
                  statement.expression.type === "Assignment"
                ) {
                  const assignment = statement.expression;
                  const varName = assignment.left.name;
                  let returnValue = assignment.right.name;

                  if (assignment.left.type === "MemberAccess") {
                    console.log("new_struct_value CASE");
                    const blockId = generateUniqueId();
                    const block = {
                      type: "new_struct_value",
                      fields: {
                        VAR: assignment.left.expression.name,
                        ATTRIBUTE: assignment.left.memberName,
                        VALUE: assignment.right.value
                      },
                      id: blockId,
                      parent: functionBlock.id,
                      data: JSON.stringify({ parentId:functionBlock.id })
                    };
                    //block.data = JSON.stringify({ parentId: block.parent });
                    blocklyJson.blocks.blocks.push(block);

                  } else if (variableTypes[varName]) {
                    const varType = variableTypes[varName];
                    const setBlockId = generateUniqueId();
                    let setblock: BlocklyBlock;

                    const blockTypeMap: Record<string, string> = {
                      string: "variables_set_string",
                      uint: "variables_set_uint",
                      uint256: "variables_set_uint256",
                      uint8: "variables_set_uint8",
                      int: "variables_set_int",
                      address: "variables_set_address",
                      bool: "variables_set_bool",
                      bytes: "variables_set_bytes",
                      bytes32: "variables_set_bytes32"
                    };

                    const blockType = blockTypeMap[varType];

                    if (!blockType) {
                      throw new Error(`❌ Tipo di variabile non gestito: ${varType}`);
                    }

                    setblock = {
                      type: blockType,
                      fields: { VAR: varName },
                      id: setBlockId,
                      parent: functionBlock.id
                    };
                    setblock.data = JSON.stringify({ parentId: setblock.parent });
                    blocklyJson.blocks.blocks.push(setblock);

                    const inputBlockId = generateUniqueId();
                    let returnvalueBlock: BlocklyBlock | undefined;

                    if (assignment.operator === "+=") {
                      const incValue = assignment.right.value || assignment.right.name;
                      returnvalueBlock = {
                        type: "input_somma",
                        fields: {
                          input_name: assignment.left.name,
                          input_increment: incValue
                        },
                        id: inputBlockId,
                        parent: setBlockId
                      };

                    } else if (assignment.operator === "-=") {
                      const decValue = assignment.right.value || assignment.right.name;
                      returnvalueBlock = {
                        type: "input_diff",
                        fields: {
                          input_name: assignment.left.name,
                          input_decrement: decValue
                        },
                        id: inputBlockId,
                        parent: setBlockId
                      };

                    } else if (assignment.operator === "=") {
                      if (assignment.right.type === "BinaryOperation") {
                        const inputValue = assignment.right.right.value || assignment.right.right.name;
                        const inputName = assignment.right.left.name;

                        returnvalueBlock = {
                          type: assignment.right.operator === "+" ? "input_somma" : "input_diff",
                          fields: {
                            input_name: inputName,
                            [assignment.right.operator === "+" ? "input_increment" : "input_decrement"]: inputValue
                          },
                          id: inputBlockId,
                          parent: setBlockId
                        };

                      } else if (assignment.right.type === "Identifier") {
                        returnvalueBlock = {
                          type: "input",
                          fields: { input_name: returnValue },
                          id: inputBlockId,
                          parent: setBlockId
                        };

                      } else if (assignment.right.type === "NumberLiteral") {
                        returnvalueBlock = {
                          type: "input",
                          fields: { input_name: assignment.right.value },
                          id: inputBlockId,
                          parent: setBlockId
                        };

                      } else if (assignment.right.baseExpression && assignment.right.indexExpression) {
                        returnValue = `${assignment.right.baseExpression.name}[${assignment.right.indexExpression.value}]`;
                        returnvalueBlock = {
                          type: "input",
                          fields: { input_name: returnValue },
                          id: inputBlockId,
                          parent: setBlockId
                        };
                      }
                    }

                    if (returnvalueBlock) {
                      returnvalueBlock.data = JSON.stringify({ parentId: returnvalueBlock.parent });
                      blocklyJson.blocks.blocks.push(returnvalueBlock);
                    }

                  } else if (assignment.left && assignment.left.type === "IndexAccess") {
                    let varName = "";
                    let param1 = "";
                    let param2 = "";
                    let block: BlocklyBlock | undefined;
                    const blockId = generateUniqueId();

                    const baseExpression = assignment.left.baseExpression;
                    const indexExpression = assignment.left.indexExpression;

                    if (baseExpression?.type === "Identifier") {
                      varName = baseExpression.name;
                    }

                    switch (assignment.right?.type) {
                      case "BooleanLiteral":
                      case "NumberLiteral":
                      case "StringLiteral":
                        param2 = assignment.right.value.toString();
                        break;
                    }

                    if (indexExpression?.type === "Identifier") {
                      param1 = indexExpression.name;
                      block = {
                        type: "getter_mappings",
                        fields: {
                          VAR: varName,
                          PARAMS1: param1,
                          PARAMS2: param2
                        },
                        id: blockId,
                        parent: functionBlock.id
                      };

                    } else if (indexExpression?.type === "NumberLiteral") {
                      param1 = indexExpression.value;
                      block = {
                        type: "array_values",
                        fields: {
                          VAR: varName,
                          PARAMS1: param1,
                          PARAMS2: param2
                        },
                        id: blockId,
                        parent: functionBlock.id
                      };
                    }

                    if (block) {
                      block.data = JSON.stringify({ parentId: block.parent });
                      blocklyJson.blocks.blocks.push(block);
                    }
                  }
              } else if (
                statement.type === "ExpressionStatement" &&
                statement.expression.type === "UnaryOperation"
              ) {
                const assignment = statement.expression;

                // CASE ARRAY (Delete)
                if (statement.expression.operator === "delete") {
                  const deleteBlockId: string = generateUniqueId();
                  const deleteBlock: BlocklyBlock = {
                    type: "array_delete",
                    fields: {
                      VAR: assignment.right.baseExpression.name,
                      PARAMS1: assignment.right.indexExpression.value,
                    },
                    id: deleteBlockId,
                    parent: functionBlock.id,
                  };
                  deleteBlock.data = JSON.stringify({ parentId: deleteBlock.parent });
                  blocklyJson.blocks.blocks.push(deleteBlock);
                } else {
                  const varName: string = assignment.left.name;
                  const varType: string = variableTypes[varName];
                  const setBlockId: string = generateUniqueId();
                  let setblock: BlocklyBlock;

                  switch (varType) {
                    case "string":
                      setblock = {
                        type: "variables_set_string",
                        fields: { VAR: varName },
                        id: setBlockId,
                        parent: functionBlock.id,
                      };
                      break;
                    case "uint":
                      setblock = {
                        type: "variables_set_uint",
                        fields: { VAR: varName },
                        id: setBlockId,
                        parent: functionBlock.id,
                      };
                      break;
                    case "uint256":
                      setblock = {
                        type: "variables_set_uint256",
                        fields: { VAR: varName },
                        id: setBlockId,
                        parent: functionBlock.id,
                      };
                      break;
                    case "uint8":
                      setblock = {
                        type: "variables_set_uint8",
                        fields: { VAR: varName },
                        id: setBlockId,
                        parent: functionBlock.id,
                      };
                      break;
                    case "int":
                      setblock = {
                        type: "variables_set_int",
                        fields: { VAR: varName },
                        id: setBlockId,
                        parent: functionBlock.id,
                      };
                      break;
                    case "address":
                      setblock = {
                        type: "variables_set_address",
                        fields: { VAR: varName },
                        id: setBlockId,
                        parent: functionBlock.id,
                      };
                      break;
                    case "bool":
                      setblock = {
                        type: "variables_set_bool",
                        fields: { VAR: varName },
                        id: setBlockId,
                        parent: functionBlock.id,
                      };
                      break;
                    case "bytes":
                      setblock = {
                        type: "variables_set_bytes",
                        fields: { VAR: varName },
                        id: setBlockId,
                        parent: functionBlock.id,
                      };
                      break;
                    case "bytes32":
                      setblock = {
                        type: "variables_set_bytes32",
                        fields: { VAR: varName },
                        id: setBlockId,
                        parent: functionBlock.id,
                      };
                      break;
                    default:
                      throw new Error(`❌ Tipo variabile non gestito: ${varType}`);
                  }

                  setblock.data = JSON.stringify({ parentId: setblock.parent });
                  blocklyJson.blocks.blocks.push(setblock);

                  const inputValue: string = "1";
                  const inputBlockId: string = generateUniqueId();
                  let returnvalueBlock: BlocklyBlock;

                  if (statement.expression.operator === "++") {
                    returnvalueBlock = {
                      type: "input_somma",
                      fields: {
                        input_name: assignment.left.name,
                        input_increment: inputValue,
                      },
                      id: inputBlockId,
                      parent: setBlockId,
                    };
                  } else if (statement.expression.operator === "--") {
                    returnvalueBlock = {
                      type: "input_diff",
                      fields: {
                        input_name: assignment.left.name,
                        input_decrement: inputValue,
                      },
                      id: inputBlockId,
                      parent: setBlockId,
                    };
                  } else {
                    throw new Error(`❌ Operatore unario non gestito: ${statement.expression.operator}`);
                  }

                  returnvalueBlock.data = JSON.stringify({ parentId: returnvalueBlock.parent });
                  blocklyJson.blocks.blocks.push(returnvalueBlock);
                }
              } else if (statement.type === "EmitStatement") {
                // Verifica che expression sia un Identifier con un campo 'name'
                const eventName: string =
                  statement.expression && statement.expression.name
                    ? statement.expression.name
                    : "UnnamedEvent";

                // Estrai i parametri dell'evento
                const params: string[] = [];
                if (statement.arguments && Array.isArray(statement.arguments)) {
                  statement.arguments.forEach((arg: any) => {
                    if (arg.type === "Identifier" && arg.name) {
                      params.push(arg.name);
                    }
                  });
                }

                const EmitEventBlockId: string = generateUniqueId();

                const EmitEventBlock: BlocklyBlock = {
                  type: "emit_event",
                  fields: {
                    VAR: eventName,
                    PARAMS: params.join(", "), // ⚠️ Se il blocco accetta solo stringa
                  },
                  id: EmitEventBlockId,
                  parent: functionBlock.id,
                };

                EmitEventBlock.data = JSON.stringify({ parentId: EmitEventBlock.parent });
                blocklyJson.blocks.blocks.push(EmitEventBlock);
              } else if (statement.type === "ReturnStatement") {
                const returnBlockId: string = generateUniqueId();

                if (!statement.expression) {
                  console.log("Null expression!");

                  const returnBlock: BlocklyBlock = {
                    type: "return_block",
                    fields: {
                      input_name: ""
                    },
                    id: returnBlockId,
                    parent: functionBlock.id
                  };

                  returnBlock.data = JSON.stringify({ parentId: returnBlock.parent });
                  blocklyJson.blocks.blocks.push(returnBlock);

                } else if (statement.expression.type === "Identifier") {
                  const varName: string = statement.expression.name;

                  const returnBlock: BlocklyBlock = {
                    type: "return_block",
                    fields: {
                      input_name: varName
                    },
                    id: returnBlockId,
                    parent: functionBlock.id
                  };

                  returnBlock.data = JSON.stringify({ parentId: returnBlock.parent });
                  blocklyJson.blocks.blocks.push(returnBlock);

                } else if (statement.expression.type === "IndexAccess") {
                  const base: string = statement.expression.baseExpression.name;
                  const index: string = statement.expression.indexExpression.name;
                  const returnValue: string = `${base}[${index}]`;

                  const returnBlock: BlocklyBlock = {
                    type: "return_block",
                    fields: {
                      input_name: returnValue
                    },
                    id: returnBlockId,
                    parent: functionBlock.id
                  };

                  returnBlock.data = JSON.stringify({ parentId: returnBlock.parent });
                  blocklyJson.blocks.blocks.push(returnBlock);

                } else if (statement.expression.type === "FunctionCall") {
                  const assignment = statement.expression;

                  const name: string = assignment.expression.expression.name;
                  const memberName: string = assignment.expression.memberName;
                  const varName: string = `${name}.${memberName}`;

                  const returnBlock: BlocklyBlock = {
                    type: "return_block",
                    fields: {
                      input_name: varName
                    },
                    id: returnBlockId,
                    parent: functionBlock.id
                  };

                  returnBlock.data = JSON.stringify({ parentId: returnBlock.parent });
                  blocklyJson.blocks.blocks.push(returnBlock);
                }
              } else if (statement.type === "VariableDeclarationStatement") {
                console.log("VariableDeclarationStatement");

                const supportedArrayTypes = ["uint", "int", "bool", "string", "address", "uint256", "uint8"];

                if (
                  statement.variable &&
                  statement.variable.typeName &&
                  statement.variable.typeName.baseType &&
                  supportedArrayTypes.includes(statement.variable.typeName.baseType.name) &&
                  statement.expression &&
                  statement.expression.type === "FunctionCall" &&
                  statement.expression.expression.type === "NewExpr"
                ) {
                  console.log("CASE Define_arrayVariable");

                  const baseType: string = statement.variable.typeName.baseType.name;
                  const varName: string = statement.variable.name.name;
                  const newType: string = statement.expression.expression.typeName.baseType.name;

                  const args = statement.expression.arguments;
                  const values: string = args.map((arg: any) => arg.value).join(", ");

                  const blockId: string = generateUniqueId();
                  const block: BlocklyBlock = {
                    type: "define_arrayVariable",
                    fields: {
                      TYPE: baseType,
                      NAME: varName,
                      TYPE1: newType,
                      VALUES: values
                    },
                    id: blockId,
                    parent: functionBlock.id
                  };
                  block.data = JSON.stringify({ parentId: block.parent });
                  blocklyJson.blocks.blocks.push(block);

                } else if (
                  statement.variable &&
                  statement.expression &&
                  statement.expression.type === "FunctionCall"
                ) {
                  const type: string = statement.variable.typeName.name;
                  const name: string = statement.variable.name.name;
                  const fnName: string = statement.expression.expression.name;

                  const args: string = statement.expression.arguments
                    .map((arg: any) => arg.name || "")
                    .join(", ");

                  const codeLine: string = `${type} ${name} = ${fnName}(${args});`;

                  const blockId: string = generateUniqueId();
                  const locVariableblock: BlocklyBlock = {
                    type: "localVariable",
                    fields: {
                      CODE: codeLine
                    },
                    id: blockId,
                    parent: functionBlock.id
                  };
                  locVariableblock.data = JSON.stringify({ parentId: locVariableblock.parent });
                  blocklyJson.blocks.blocks.push(locVariableblock);

                  console.log("Local Variable block ADDED");

                } else {
                  console.warn("Nodo non gestito:", statement.type);
                  const blackBlock: BlocklyBlock = generateBlackBlock(statement, functionBlock.id);
                  blackBlock.data = JSON.stringify({ parentId: blackBlock.parent });
                  blocklyJson.blocks.blocks.push(blackBlock);
                }
              } else if(statement.type === "IfStatement" ){ 
                let elseBlock: BlocklyBlock | undefined;
                let if_elseIf_else_Block: BlocklyBlock | undefined;
                let if_else_Block: BlocklyBlock | undefined;

                const operatorMapping: Record<string, string> = {
                  "!": "NOT",
                  "!=": "NOT_EQUAL",
                  "==": "EQUAL",
                  ">=": "BIGGER OR EQUAL TO",
                  "<=": "LOWER OR EQUAL TO",
                  ">": "BIGGER THAN",
                  "<": "LOWER THAN"
                };

                let conditionType = "";
                let left = "";
                let right = "";

                // 1) --> dichiaro if block:
                let ifBlock: BlocklyBlock | undefined;
                const ifBlockId: string = generateUniqueId();

                if (statement.elseStatement) {
                  // 1) --> dichiaro else block:
                  const elseBlockId: string = generateUniqueId();

                  // 2) Funzione ricorsiva per contare gli elseStatement di tipo 'IfStatement'
                  resetArrays();
                  const count = countElseIfStatements(statement);
                  console.log(count);
                  console.log(elseStatementnodes);
                  console.log(savedElseBlockStatements);
                  console.log(savedElseBlockStatements1);

                  if (count > 0) {
                    const if_elseif_else_BlockId: string = generateUniqueId();

                    if_elseIf_else_Block = {
                      type: "if_elseif_else_container",
                      id: if_elseif_else_BlockId,
                      parent: functionBlock.id,
                      fields: {}
                    };
                    if_elseIf_else_Block.data = JSON.stringify({ parentId: if_elseIf_else_Block.parent });
                    blocklyJson.blocks.blocks.push(if_elseIf_else_Block);
                    console.log("if_elseIf_else block added to json");

                    ifBlock = {
                      type: "if",
                      id: ifBlockId,
                      parent: if_elseIf_else_Block.id,
                      fields: {}
                    };
                    console.log("IF block with the if_elseif_else ID");

                    elseBlock = {
                      type: "else",
                      id: elseBlockId,
                      parent: if_elseIf_else_Block.id,
                      fields: {}
                    };
                    elseBlock.data = JSON.stringify({ parentId: elseBlock.parent });
                    blocklyJson.blocks.blocks.push(elseBlock);
                    console.log("Else block added to the json");

                    const sortedElseStatements = elseStatementnodes.slice().sort((a, b) => b.range[0] - a.range[0]);
                    sortedElseStatements.forEach((statement, i) => {
                      const elseifBlockId: string = generateUniqueId();
                      const elseifBlock: BlocklyBlock = {
                        type: "else_if",
                        id: elseifBlockId,
                        parent: if_elseIf_else_Block!.id,
                        fields: {}
                      };

                      elseifBlock.data = JSON.stringify({ parentId: elseifBlock.parent });
                      blocklyJson.blocks.blocks.push(elseifBlock);
                      console.log("elseIf block added to json " + i);

                      if (
                        statement.elseStatement?.condition &&
                        "operator" in statement.elseStatement.condition
                      ) {
                        const solidityOperator = statement.elseStatement.condition.operator;
                        console.log("Operatore trovato nel require:", solidityOperator);

                        const conditionType = operatorMapping[solidityOperator] || "EQUAL";

                        let inputBlockRight: BlocklyBlock | undefined;
                        let requireConditionBlock: BlocklyBlock;

                        if (solidityOperator === "!") {
                          const right = statement.elseStatement.condition.right;
                          console.log("Mapping operatore Blockly:", conditionType);
                          console.log("Right:", right);

                          const requireConditionBlockId = generateUniqueId();
                          requireConditionBlock = {
                            type: "require_condition",
                            fields: { OPERATOR: conditionType },
                            id: requireConditionBlockId,
                            parent: elseifBlock.id
                          };
                          requireConditionBlock.data = JSON.stringify({ parentId: requireConditionBlock.parent });
                          blocklyJson.blocks.blocks.push(requireConditionBlock);

                          const type = findVariableType(ast, right?.name);
                          console.log("name:", type);

                          const inputBlockRightId = generateUniqueId();
                          if (type) {
                            const typeToBlock: Record<string, string> = {
                              string: "variables_get_string",
                              uint: "variables_get_uint",
                              uint256: "variables_get_uint256",
                              uint8: "variables_get_uint8",
                              int: "variables_get_int",
                              bool: "variables_get_bool",
                              bytes: "variables_get_bytes",
                              bytes32: "variables_get_bytes32",
                              address: "variables_get_address"
                            };

                            const blockType = typeToBlock[type];
                            if (blockType) {
                              inputBlockRight = {
                                type: blockType,
                                fields: { VAR: right.name },
                                id: inputBlockRightId,
                                parent: requireConditionBlock.id
                              };
                              inputBlockRight.data = JSON.stringify({ parentId: inputBlockRight.parent });
                              blocklyJson.blocks.blocks.push(inputBlockRight);
                              console.log("inputBlockRight for UnaryOperation created!");
                            }
                          }

                        } else if (["==", "!=", ">=", "<=", ">", "<"].includes(solidityOperator)) {
                          const left = statement.elseStatement.condition.left;
                          const right = statement.elseStatement.condition.right;
                          console.log("Mapping operatore Blockly:", conditionType);
                          console.log("Left:", left);
                          console.log("Right:", right);

                          const requireConditionBlockId = generateUniqueId();
                          requireConditionBlock = {
                            type: "require_condition",
                            fields: { OPERATOR: conditionType },
                            id: requireConditionBlockId,
                            parent: elseifBlock.id
                          };
                          requireConditionBlock.data = JSON.stringify({ parentId: requireConditionBlock.parent });
                          blocklyJson.blocks.blocks.push(requireConditionBlock);

                          if (right){
                            const inputBlockRightId = generateUniqueId();
  
                             //&& "name" in right && 
                            if (findVariable(ast, right.name)) {
                              //const inputBlockRightId = generateUniqueId();
                              const type = findVariableType(ast, right.name);
                              console.log("name:", type);

                              const typeToBlock: Record<string, string> = {
                                string: "variables_get_string",
                                uint: "variables_get_uint",
                                uint256: "variables_get_uint256",
                                uint8: "variables_get_uint8",
                                int: "variables_get_int",
                                bool: "variables_get_bool",
                                bytes: "variables_get_bytes",
                                bytes32: "variables_get_bytes32",
                                address: "variables_get_address"
                              };

                              if (type && typeToBlock[type]) {

                                const blockType = typeToBlock[type];
                                if (blockType) {
                                  inputBlockRight = {
                                    type: blockType,
                                    fields: { VAR: right.name },
                                    id: inputBlockRightId,
                                    parent: requireConditionBlock.id
                                  };
                                  inputBlockRight.data = JSON.stringify({ parentId: inputBlockRight.parent });
                                  blocklyJson.blocks.blocks.push(inputBlockRight);
                                  console.log("inputBlockRight for rightOperand equal to a variable created!");
                                }
                              }

                            } else {
                              let rightOperand: string;

                              // Gestione MemberAccess: msg.sender, msg.value, account.length, ecc.
                              if (
                                right.type === "MemberAccess" &&
                                "memberName" in right &&
                                right.memberName &&
                                "expression" in right &&
                                typeof right.expression === "object" &&
                                "name" in right.expression
                              ) {
                                rightOperand = `${(right.expression as any).name}.${right.memberName}`;
                              }

                              // address(0)
                              else if (
                                right.type === "FunctionCall" &&
                                right.expression?.type === "ElementaryTypeName" &&
                                right.expression.name === "address" &&
                                right.arguments?.[0]?.type === "NumberLiteral" &&
                                right.arguments[0].value === "0"
                              ) {
                                rightOperand = "address(0)";
                              }

                              // address(this)
                              else if (
                                right.type === "FunctionCall" &&
                                right.expression?.type === "ElementaryTypeName" &&
                                right.expression.name === "address" &&
                                right.arguments?.[0]?.type === "Identifier" &&
                                right.arguments[0].name === "this"
                              ) {
                                rightOperand = "address(this)";
                              }

                              // address(this).balance
                              else if (
                                right.type === "MemberAccess" &&
                                right.expression?.type === "FunctionCall" &&
                                right.expression.expression?.type === "ElementaryTypeName" &&
                                right.expression.expression.name === "address" &&
                                right.expression.arguments?.[0]?.type === "Identifier" &&
                                right.expression.arguments[0].name === "this" &&
                                right.memberName === "balance"
                              ) {
                                rightOperand = "address(this).balance";
                              }

                              // fallback generico: numero, stringa, variabile
                              else {
                                if (typeof right === "object") {
                                  rightOperand = (right as any).name ?? (right as any).value ?? "undefined";
                                } else {
                                  rightOperand = String(right);
                                }
                              }

                              // Costruzione del blocco input_right
                              inputBlockRight = {
                                type: "input_right",
                                fields: {
                                  input_name: rightOperand
                                },
                                id: inputBlockRightId,
                                parent: requireConditionBlock.id
                              };

                              inputBlockRight.data = JSON.stringify({ parentId: inputBlockRight.parent });
                              blocklyJson.blocks.blocks.push(inputBlockRight);
                            }
                          }
                          let inputBlockLeftId: string = generateUniqueId();
                          let inputBlockLeft: BlocklyBlock | undefined;

                          const type: string | null = findVariableType(ast, left.name);

                          if (type !== null) {
                            console.log("name:", type);

                            if (type === "string") {
                              inputBlockLeft = {
                                type: "variables_get_string",
                                fields: {
                                  VAR: left.name,
                                },
                                id: inputBlockLeftId,
                                parent: requireConditionBlock.id,
                              };
                            } else if (type === "uint") {
                              inputBlockLeft = {
                                type: "variables_get_uint",
                                fields: {
                                  VAR: left.name,
                                },
                                id: inputBlockLeftId,
                                parent: requireConditionBlock.id,
                              };
                            } else if (type === "uint256") {
                              inputBlockLeft = {
                                type: "variables_get_uint256",
                                fields: {
                                  VAR: left.name,
                                },
                                id: inputBlockLeftId,
                                parent: requireConditionBlock.id,
                              };
                            } else if (type === "uint8") {
                              inputBlockLeft = {
                                type: "variables_get_uint8",
                                fields: {
                                  VAR: left.name,
                                },
                                id: inputBlockLeftId,
                                parent: requireConditionBlock.id,
                              };
                            } else if (type === "int") {
                              inputBlockLeft = {
                                type: "variables_get_int",
                                fields: {
                                  VAR: left.name,
                                },
                                id: inputBlockLeftId,
                                parent: requireConditionBlock.id,
                              };
                            } else if (type === "bool") {
                              inputBlockLeft = {
                                type: "variables_get_bool",
                                fields: {
                                  VAR: left.name,
                                },
                                id: inputBlockLeftId,
                                parent: requireConditionBlock.id,
                              };
                            } else if (type === "bytes") {
                              inputBlockLeft = {
                                type: "variables_get_bytes",
                                fields: {
                                  VAR: left.name,
                                },
                                id: inputBlockLeftId,
                                parent: requireConditionBlock.id,
                              };
                            } else if (type === "bytes32") {
                              inputBlockLeft = {
                                type: "variables_get_bytes32",
                                fields: {
                                  VAR: left.name,
                                },
                                id: inputBlockLeftId,
                                parent: requireConditionBlock.id,
                              };
                            } else if (type === "address") {
                              inputBlockLeft = {
                                type: "variables_get_address",
                                fields: {
                                  VAR: left.name,
                                },
                                id: inputBlockLeftId,
                                parent: requireConditionBlock.id,
                              };
                            }

                            if (inputBlockLeft) {
                              inputBlockLeft.data = JSON.stringify({ parentId: inputBlockLeft.parent });
                              blocklyJson.blocks.blocks.push(inputBlockLeft);
                              console.log("inputBlockLeft for leftOperand equal to a variable created!");
                            }
                          } else {
                            let leftOperand: string = "";

                            if (
                              left.type === "MemberAccess" &&
                              left.memberName &&
                              left.expression &&
                              typeof left.expression.name === "string"
                            ) {
                              leftOperand = `${left.expression.name}.${left.memberName}`;

                            } else if (
                              left.type === "FunctionCall" &&
                              left.expression?.type === "ElementaryTypeName" &&
                              left.expression.name === "address" &&
                              left.arguments &&
                              left.arguments[0]?.type === "NumberLiteral" &&
                              left.arguments[0]?.value === "0"
                            ) {
                              leftOperand = "address(0)";

                            } else if (
                              left.type === "FunctionCall" &&
                              left.expression?.type === "ElementaryTypeName" &&
                              left.expression.name === "address" &&
                              left.arguments &&
                              left.arguments[0]?.type === "Identifier" &&
                              left.arguments[0]?.name === "this"
                            ) {
                              leftOperand = "address(this)";

                            } else if (
                              left.type === "MemberAccess" &&
                              left.expression?.type === "FunctionCall" &&
                              left.expression.expression?.type === "ElementaryTypeName" &&
                              left.expression.expression?.name === "address" &&
                              left.expression.arguments &&
                              left.expression.arguments[0]?.type === "Identifier" &&
                              left.expression.arguments[0]?.name === "this" &&
                              left.memberName === "balance"
                            ) {
                              leftOperand = "address(this).balance";

                            } else if ("name" in left && typeof left.name === "string") {
                              leftOperand = left.name;

                            } else {
                              console.warn("⚠️ leftOperand non riconosciuto:", left);
                              leftOperand = "undefined";
                            }

                            const inputBlockLeft: BlocklyBlock = {
                              type: "input",
                              fields: {
                                input_name: leftOperand
                              },
                              id: inputBlockLeftId,
                              parent: requireConditionBlock.id,
                            };

                            inputBlockLeft.data = JSON.stringify({ parentId: inputBlockLeft.parent });
                            blocklyJson.blocks.blocks.push(inputBlockLeft);
                            console.log("✅ inputBlockLeft for Binary Operation created!");
                          }

                        }
                      } 
                      
                      if (statement.elseStatement?.ifStatement?.statements) {
                        const statements = statement.elseStatement.ifStatement.statements;

                        statements.forEach((statement: any) => {
                          if (
                            statement.type === "ExpressionStatement" &&
                            statement.expression.type === "Assignment"
                          ) {
                            console.log("Prima condizione letta");

                            const assignment = statement.expression;
                            const varName = assignment.left.name;
                            const returnValue = assignment.right.name;

                            if (variableTypes[varName]) {
                              const varType = variableTypes[varName];
                              const setBlockId = generateUniqueId();
                              let setblock: BlocklyBlock | undefined;

                              const baseSetBlock = {
                                fields: { VAR: varName },
                                id: setBlockId,
                                parent: elseifBlock.id,
                              };

                              switch (varType) {
                                case "string":
                                  setblock = { type: "variables_set_string", ...baseSetBlock };
                                  break;
                                case "uint":
                                  setblock = { type: "variables_set_uint", ...baseSetBlock };
                                  break;
                                case "uint256":
                                  setblock = { type: "variables_set_uint256", ...baseSetBlock };
                                  break;
                                case "uint8":
                                  setblock = { type: "variables_set_uint8", ...baseSetBlock };
                                  break;
                                case "int":
                                  setblock = { type: "variables_set_int", ...baseSetBlock };
                                  break;
                                case "address":
                                  setblock = { type: "variables_set_address", ...baseSetBlock };
                                  break;
                                case "bool":
                                  setblock = { type: "variables_set_bool", ...baseSetBlock };
                                  break;
                                case "bytes":
                                  setblock = { type: "variables_set_bytes", ...baseSetBlock };
                                  break;
                                case "bytes32":
                                  setblock = { type: "variables_set_bytes32", ...baseSetBlock };
                                  break;
                              }

                              if (setblock){
                                setblock.data = JSON.stringify({ parentId: setblock.parent });
                                blocklyJson.blocks.blocks.push(setblock);
                              }
                              
                              const inputBlockId = generateUniqueId();
                              let returnvalueBlock: BlocklyBlock | undefined;

                              if (statement.expression.operator === "+=") {
                                const incvalue = assignment.right.value ?? assignment.right.name;
                                returnvalueBlock = {
                                  type: "input_somma",
                                  fields: {
                                    input_name: assignment.left.name,
                                    input_increment: incvalue,
                                  },
                                  id: inputBlockId,
                                  parent: setBlockId,
                                };
                              } else if (statement.expression.operator === "-=") {
                                const decvalue = assignment.right.value ?? assignment.right.name;
                                returnvalueBlock = {
                                  type: "input_diff",
                                  fields: {
                                    input_name: assignment.left.name,
                                    input_decrement: decvalue,
                                  },
                                  id: inputBlockId,
                                  parent: setBlockId,
                                };
                              } else if (statement.expression.operator === "=") {
                                if (assignment.right.type === "BinaryOperation") {
                                  const inputvalue = assignment.right.right.value ?? assignment.right.right.name;
                                  const inputname = assignment.right.left.name;
                                  const innerInputBlockId = generateUniqueId();

                                  if (assignment.right.operator === "+") {
                                    returnvalueBlock = {
                                      type: "input_somma",
                                      fields: {
                                        input_name: inputname,
                                        input_increment: inputvalue,
                                      },
                                      id: innerInputBlockId,
                                      parent: setBlockId,
                                    };
                                  } else if (assignment.right.operator === "-") {
                                    returnvalueBlock = {
                                      type: "input_diff",
                                      fields: {
                                        input_name: inputname,
                                        input_decrement: inputvalue,
                                      },
                                      id: innerInputBlockId,
                                      parent: setBlockId,
                                    };
                                  }
                                } else if (assignment.right.type === "Identifier") {
                                  returnvalueBlock = {
                                    type: "input",
                                    fields: {
                                      input_name: returnValue,
                                    },
                                    id: inputBlockId,
                                    parent: setBlockId,
                                  };
                                }
                              }
                              if (returnvalueBlock){
                                returnvalueBlock.data = JSON.stringify({ parentId: returnvalueBlock.parent });
                                blocklyJson.blocks.blocks.push(returnvalueBlock);
                              }
                              
                            }
                          } else if (
                            statement.type === "ExpressionStatement" &&
                            statement.expression.type === "UnaryOperation"
                          ) {
                            console.log("Seconda condizione letta");

                            const assignment = statement.expression;
                            const varName = assignment.left.name;

                            if (variableTypes[varName]) {
                              const varType = variableTypes[varName];
                              const setBlockId = generateUniqueId();
                              let setblock: BlocklyBlock | undefined;

                              const baseSetBlock = {
                                fields: { VAR: varName },
                                id: setBlockId,
                                parent: elseifBlock.id,
                              };

                              switch (varType) {
                                case "string":
                                  setblock = { type: "variables_set_string", ...baseSetBlock };
                                  break;
                                case "uint":
                                  setblock = { type: "variables_set_uint", ...baseSetBlock };
                                  break;
                                case "uint256":
                                  setblock = { type: "variables_set_uint256", ...baseSetBlock };
                                  break;
                                case "uint8":
                                  setblock = { type: "variables_set_uint8", ...baseSetBlock };
                                  break;
                                case "int":
                                  setblock = { type: "variables_set_int", ...baseSetBlock };
                                  break;
                                case "address":
                                  setblock = { type: "variables_set_address", ...baseSetBlock };
                                  break;
                                case "bool":
                                  setblock = { type: "variables_set_bool", ...baseSetBlock };
                                  break;
                                case "bytes":
                                  setblock = { type: "variables_set_bytes", ...baseSetBlock };
                                  break;
                                case "bytes32":
                                  setblock = { type: "variables_set_bytes32", ...baseSetBlock };
                                  break;
                              }
                              if(setblock){
                                setblock.data = JSON.stringify({ parentId: setblock.parent });
                                blocklyJson.blocks.blocks.push(setblock);
                              }
                              
                              const inputvalue = "1";
                              const inputBlockId = generateUniqueId();
                              let returnvalueBlock: BlocklyBlock | undefined;

                              if (assignment.operator === "++") {
                                returnvalueBlock = {
                                  type: "input_somma",
                                  fields: {
                                    input_name: varName,
                                    input_increment: inputvalue,
                                  },
                                  id: inputBlockId,
                                  parent: setBlockId,
                                };
                              } else if (assignment.operator === "--") {
                                returnvalueBlock = {
                                  type: "input_diff",
                                  fields: {
                                    input_name: varName,
                                    input_decrement: inputvalue,
                                  },
                                  id: inputBlockId,
                                  parent: setBlockId,
                                };
                              }
                              if(returnvalueBlock){
                                returnvalueBlock.data = JSON.stringify({ parentId: returnvalueBlock.parent });
                                blocklyJson.blocks.blocks.push(returnvalueBlock);
                              }  
                            }
                          } else if (statement.type == "ReturnStatement"){
                            let returnBlock: BlocklyBlock | undefined;

                            const returnBlockId = generateUniqueId();

                            if (!statement.expression) {
                              console.log("Null expression!");

                              returnBlock = {
                                type: "return_block",
                                fields: {
                                  input_name: ""
                                },
                                id: returnBlockId,
                                parent: elseifBlock.id
                              };
                            } else if (statement.expression.type === "Identifier") {
                              console.log("Terza condizione letta");

                              const assignment = statement.expression; //as IdentifierNode;
                              const varName : string = assignment.name;

                              returnBlock = {
                                type: "return_block",
                                fields: {
                                  input_name: varName
                                },
                                id: returnBlockId,
                                parent: elseifBlock.id
                              };
                            } else if (statement.expression.type === "FunctionCall") {
                              const assignment = statement.expression; // as FunctionCallNode;

                              const name: string = assignment.expression.expression.name;
                              const membername: string = assignment.expression.memberName;
                              const varName: string  = `${name}.${membername}`;

                              returnBlock = {
                                type: "return_block",
                                fields: {
                                  input_name: varName
                                },
                                id: returnBlockId,
                                parent: elseifBlock.id
                              };
                            }
                            if (returnBlock){
                              returnBlock.data = JSON.stringify({ parentId: returnBlock.parent });
                              blocklyJson.blocks.blocks.push(returnBlock);
                            }
                            
                          } else {
                            console.warn("Nodo non gestito:", statement.type);
                            const blackBlock: BlocklyBlock = generateBlackBlock(statement, elseifBlock.id);
                            blackBlock.data = JSON.stringify({ parentId: blackBlock.parent });
                            blocklyJson.blocks.blocks.push(blackBlock);
                          }
                        });
                      }
                    });

                    (savedElseBlockStatements1 as any[]).forEach((statement, i) => {
                      (statement.elseStatement.statements as any[]).forEach((statement: any) => {
                        console.log("elsecondition rilevata");

                        if (statement.type === "ExpressionStatement" && statement.expression.type === "Assignment") {
                          console.log("Prima condizione letta nell'else");

                          const assignment = statement.expression;
                          const varName = assignment.left.name;
                          const returnValue = assignment.right.name || assignment.right.value;

                          if (variableTypes[varName]) {
                            const varType = variableTypes[varName];
                            const setBlockId = generateUniqueId();
                            let setblock: any;

                            if (elseBlock){
                            switch (varType) {
                              case "string":
                                setblock = { type: "variables_set_string", fields: { VAR: varName }, id: setBlockId, parent: elseBlock.id };
                                break;
                              case "uint":
                                setblock = { type: "variables_set_uint", fields: { VAR: varName }, id: setBlockId, parent: elseBlock.id };
                                break;
                              case "uint256":
                                setblock = { type: "variables_set_uint256", fields: { VAR: varName }, id: setBlockId, parent: elseBlock.id };
                                break;
                              case "uint8":
                                setblock = { type: "variables_set_uint8", fields: { VAR: varName }, id: setBlockId, parent: elseBlock.id };
                                break;
                              case "int":
                                setblock = { type: "variables_set_int", fields: { VAR: varName }, id: setBlockId, parent: elseBlock.id };
                                break;
                              case "address":
                                setblock = { type: "variables_set_address", fields: { VAR: varName }, id: setBlockId, parent: elseBlock.id };
                                break;
                              case "bool":
                                setblock = { type: "variables_set_bool", fields: { VAR: varName }, id: setBlockId, parent: elseBlock.id };
                                break;
                              case "bytes":
                                setblock = { type: "variables_set_bytes", fields: { VAR: varName }, id: setBlockId, parent: elseBlock.id };
                                break;
                              case "bytes32":
                                setblock = { type: "variables_set_bytes32", fields: { VAR: varName }, id: setBlockId, parent: elseBlock.id };
                                break;
                              }
                            }

                            setblock.data = JSON.stringify({ parentId: setblock.parent });
                            blocklyJson.blocks.blocks.push(setblock);

                            const inputBlockId = generateUniqueId();
                            let returnvalueBlock: any;

                            if (assignment.operator === "+=") {
                              console.log("siamo dentro: +=");
                              const incvalue = assignment.right.value || assignment.right.name;
                              returnvalueBlock = {
                                type: "input_somma",
                                fields: { input_name: assignment.left.name, input_increment: incvalue },
                                id: inputBlockId,
                                parent: setBlockId,
                              };
                            } else if (assignment.operator === "-=") {
                              console.log("siamo dentro: -=");
                              const decvalue = assignment.right.value || assignment.right.name;
                              returnvalueBlock = {
                                type: "input_diff",
                                fields: { input_name: assignment.left.name, input_decrement: decvalue },
                                id: inputBlockId,
                                parent: setBlockId,
                              };
                            } else if (assignment.operator === "=") {
                              if (assignment.right.type === "BinaryOperation") {
                                const inputvalue = assignment.right.right.value || assignment.right.right.name;
                                const inputname = assignment.right.left.name;

                                if (assignment.right.operator === "+") {
                                  returnvalueBlock = {
                                    type: "input_somma",
                                    fields: { input_name: inputname, input_increment: inputvalue },
                                    id: inputBlockId,
                                    parent: setBlockId,
                                  };
                                } else if (assignment.right.operator === "-") {
                                  returnvalueBlock = {
                                    type: "input_diff",
                                    fields: { input_name: inputname, input_decrement: inputvalue },
                                    id: inputBlockId,
                                    parent: setBlockId,
                                  };
                                }
                              } else if (assignment.right.type === "Identifier" || assignment.right.type === "NumberLiteral") {
                                console.log("Identifier");
                                returnvalueBlock = {
                                  type: "input",
                                  fields: { input_name: returnValue },
                                  id: inputBlockId,
                                  parent: setBlockId,
                                };
                              }
                            }

                            returnvalueBlock.data = JSON.stringify({ parentId: returnvalueBlock.parent });
                            blocklyJson.blocks.blocks.push(returnvalueBlock);
                          }
  
                        } else if (
                          statement.type === "ExpressionStatement" &&
                          statement.expression.type === "UnaryOperation"
                        ) {
                          console.log("Seconda condizione letta nell'else");
                          const assignment = statement.expression;
                          const varName: string = assignment.left.name;

                          if (variableTypes[varName]) {
                            const varType: string = variableTypes[varName];
                            const setBlockId: string = generateUniqueId();
                            let setblock: BlocklyBlock | undefined;

                            if (elseBlock){
                            switch (varType) {
                              case "string":
                                setblock = {
                                  type: "variables_set_string",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock.id,
                                };
                                break;
                              case "uint":
                                setblock = {
                                  type: "variables_set_uint",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock.id,
                                };
                                break;
                              case "uint256":
                                setblock = {
                                  type: "variables_set_uint256",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock.id,
                                };
                                break;
                              case "uint8":
                                setblock = {
                                  type: "variables_set_uint8",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock.id,
                                };
                                break;
                              case "int":
                                setblock = {
                                  type: "variables_set_int",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock.id,
                                };
                                break;
                              case "address":
                                setblock = {
                                  type: "variables_set_address",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock.id,
                                };
                                break;
                              case "bool":
                                setblock = {
                                  type: "variables_set_bool",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock.id,
                                };
                                break;
                              case "bytes":
                                setblock = {
                                  type: "variables_set_bytes",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock.id,
                                };
                                break;
                              case "bytes32":
                                setblock = {
                                  type: "variables_set_bytes32",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock.id,
                                };
                                break;
                              default:
                                return;
                            }
                            }
                            if (setblock){
                              setblock.data = JSON.stringify({ parentId: setblock.parent });
                              blocklyJson.blocks.blocks.push(setblock);
                            }
                            

                            const inputvalue = "1";
                            const inputBlockId: string = generateUniqueId();
                            let returnvalueBlock: {
                              type: string;
                              fields: Record<string, string>;
                              id: string;
                              parent: string;
                              data?: string;
                            };

                            if (assignment.operator === "++") {
                              returnvalueBlock = {
                                type: "input_somma",
                                fields: {
                                  input_name: assignment.left.name,
                                  input_increment: inputvalue,
                                },
                                id: inputBlockId,
                                parent: setBlockId,
                              };
                            } else if (assignment.operator === "--") {
                              returnvalueBlock = {
                                type: "input_diff",
                                fields: {
                                  input_name: assignment.left.name,
                                  input_decrement: inputvalue,
                                },
                                id: inputBlockId,
                                parent: setBlockId,
                              };
                            } else {
                              return;
                            }

                            returnvalueBlock.data = JSON.stringify({ parentId: returnvalueBlock.parent });
                            blocklyJson.blocks.blocks.push(returnvalueBlock);
                          }
                        } else if (statement.type === "ReturnStatement") {
                          let returnBlock: BlocklyBlock | undefined;

                          if (!statement.expression) {
                            console.log("Null expression!");
                            const returnBlockId = generateUniqueId();
                            if (elseBlock){
                            returnBlock = {
                              type: "return_block",
                              fields: { input_name: "" },
                              id: returnBlockId,
                              parent: elseBlock.id,
                            };
                            }
                          } else if (statement.expression.type === "Identifier") {
                            const assignment = statement.expression;
                            const varName: string = assignment.name;
                            const returnBlockId = generateUniqueId();
                            if (elseBlock){
                            returnBlock = {
                              type: "return_block",
                              fields: { input_name: varName },
                              id: returnBlockId,
                              parent: elseBlock.id,
                            };
                            }
                          } else if (statement.expression.type === "FunctionCall") {
                            const assignment = statement.expression;
                            const name = assignment.expression.expression.name;
                            const membername = assignment.expression.memberName;
                            const varName: string = name + "." + membername;
                            const returnBlockId = generateUniqueId();
                            if (elseBlock){
                              returnBlock = {
                              type: "return_block",
                              fields: { input_name: varName },
                              id: returnBlockId,
                              parent: elseBlock.id,
                            };
                            }
                          } else {
                            return;
                          }
                          if(returnBlock){
                            returnBlock.data = JSON.stringify({ parentId: returnBlock.parent });
                            blocklyJson.blocks.blocks.push(returnBlock);
                          }
                        } else {
                          console.warn("Nodo non gestito:", statement.type);
                          if(elseBlock){
                            const blackBlock = generateBlackBlock(statement, elseBlock.id);
                            blackBlock.data = JSON.stringify({ parentId: blackBlock.parent });
                            blocklyJson.blocks.blocks.push(blackBlock);
                          }
                        }
                      });
                    });

                  } else if (count < 1 && savedElseBlockStatements.length > 0) {
                    // Count < 1 && siamo nell'elseStatement
                    // PARENT: if_else_Block BLOCK

                    const if_else_BlockId: string = generateUniqueId();

                    const if_else_Block: BlocklyBlock = {
                      type: "if_else_container",
                      id: if_else_BlockId,
                      parent: functionBlock.id,
                      fields: {}
                    };

                    if_else_Block.data = JSON.stringify({ parentId: if_else_Block.parent });
                    blocklyJson.blocks.blocks.push(if_else_Block);
                    console.log("if_else block added to json");

                    // INIZIALIZZAZIONE IF_BLOCK con parent dell' if_else id
                    ifBlock = {
                      type: "if",
                      id: ifBlockId,
                      parent: if_else_Block.id,
                      fields: {}
                    };
                    console.log("IF block with the if_else ID");

                    // INIZIALIZZAZIONE ELSE_BLOCK con parent dell' if_else id
                    elseBlock = {
                      type: "else",
                      id: elseBlockId,
                      parent: if_else_Block.id,
                      fields: {}
                    };
                    console.log("ELSE block with the if_else ID");

                    // AGGIUNGI ELSE BLOCK AL JSON
                    elseBlock.data = JSON.stringify({ parentId: elseBlock.parent });
                    blocklyJson.blocks.blocks.push(elseBlock);
                    console.log("Else block added to the json");

                    savedElseBlockStatements.forEach((statement, i) => {
                      statement.statements.forEach((statement: any) => {
                        console.log("elsecondition rilevata");

                        if (statement.type === "ExpressionStatement" && statement.expression.type === "Assignment") {
                          console.log("Prima condizione letta nell'else");
                          const assignment = statement.expression;
                          const varName: string = assignment.left.name;
                          const returnValue: string = assignment.right.name;

                          if (variableTypes[varName]) {
                            const varType: string = variableTypes[varName];
                            const setBlockId: string = generateUniqueId();
                            let setblock: any;

                            switch (varType) {
                              case "string":
                                setblock = {
                                  type: "variables_set_string",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock?.id
                                };
                                break;
                              case "uint":
                                setblock = {
                                  type: "variables_set_uint",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock?.id
                                };
                                break;
                              case "uint256":
                                setblock = {
                                  type: "variables_set_uint256",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock?.id
                                };
                                break;
                              case "uint8":
                                setblock = {
                                  type: "variables_set_uint8",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock?.id
                                };
                                break;
                              case "int":
                                setblock = {
                                  type: "variables_set_int",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock?.id
                                };
                                break;
                              case "address":
                                setblock = {
                                  type: "variables_set_address",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock?.id
                                };
                                break;
                              case "bool":
                                setblock = {
                                  type: "variables_set_bool",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock?.id
                                };
                                break;
                              case "bytes":
                                setblock = {
                                  type: "variables_set_bytes",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock?.id
                                };
                                break;
                              case "bytes32":
                                setblock = {
                                  type: "variables_set_bytes32",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock?.id
                                };
                                break;
                            }

                            setblock.data = JSON.stringify({ parentId: setblock.parent });
                            blocklyJson.blocks.blocks.push(setblock);

                            let returnvalueBlock: any;
                            const inputBlockId: string = generateUniqueId();

                            if (statement.expression.operator === "+=") {
                              const incvalue = assignment.right.value || assignment.right.name;
                              returnvalueBlock = {
                                type: "input_somma",
                                fields: {
                                  input_name: assignment.left.name,
                                  input_increment: incvalue
                                },
                                id: inputBlockId,
                                parent: setBlockId
                              };

                            } else if (statement.expression.operator === "-=") {
                              const decvalue = assignment.right.value || assignment.right.name;
                              returnvalueBlock = {
                                type: "input_diff",
                                fields: {
                                  input_name: assignment.left.name,
                                  input_decrement: decvalue
                                },
                                id: inputBlockId,
                                parent: setBlockId
                              };

                            } else if (statement.expression.operator === "=") {
                              if (assignment.right.type === "BinaryOperation") {
                                const inputvalue = assignment.right.right.value || assignment.right.right.name;
                                const inputname = assignment.right.left.name;

                                if (assignment.right.operator === "+") {
                                  returnvalueBlock = {
                                    type: "input_somma",
                                    fields: {
                                      input_name: inputname,
                                      input_increment: inputvalue
                                    },
                                    id: inputBlockId,
                                    parent: setBlockId
                                  };
                                } else if (assignment.right.operator === "-") {
                                  returnvalueBlock = {
                                    type: "input_diff",
                                    fields: {
                                      input_name: inputname,
                                      input_decrement: inputvalue
                                    },
                                    id: inputBlockId,
                                    parent: setBlockId
                                  };
                                }
                              } else if (assignment.right.type === "Identifier") {
                                returnvalueBlock = {
                                  type: "input",
                                  fields: {
                                    input_name: returnValue
                                  },
                                  id: inputBlockId,
                                  parent: setBlockId
                                };
                              }
                            }

                            returnvalueBlock.data = JSON.stringify({ parentId: returnvalueBlock.parent });
                            blocklyJson.blocks.blocks.push(returnvalueBlock);
                          } 
                        } else if (statement.type === "ExpressionStatement" && statement.expression.type === "UnaryOperation") {
                          console.log("Seconda condizione letta nell'else");

                          const assignment = statement.expression;
                          const varName: string = assignment.left.name;

                          if (variableTypes[varName]) {
                            const varType: string = variableTypes[varName];
                            const setBlockId: string = generateUniqueId();
                            let setblock: any;

                            switch (varType) {
                              case "string":
                                setblock = {
                                  type: "variables_set_string",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock?.id,
                                };
                                break;
                              case "uint":
                                setblock = {
                                  type: "variables_set_uint",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock?.id,
                                };
                                break;
                              case "uint256":
                                setblock = {
                                  type: "variables_set_uint256",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock?.id,
                                };
                                break;
                              case "uint8":
                                setblock = {
                                  type: "variables_set_uint8",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock?.id,
                                };
                                break;
                              case "int":
                                setblock = {
                                  type: "variables_set_int",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock?.id,
                                };
                                break;
                              case "address":
                                setblock = {
                                  type: "variables_set_address",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock?.id,
                                };
                                break;
                              case "bool":
                                setblock = {
                                  type: "variables_set_bool",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock?.id,
                                };
                                break;
                              case "bytes":
                                setblock = {
                                  type: "variables_set_bytes",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock?.id,
                                };
                                break;
                              case "bytes32":
                                setblock = {
                                  type: "variables_set_bytes32",
                                  fields: { VAR: varName },
                                  id: setBlockId,
                                  parent: elseBlock?.id,
                                };
                                break;
                            }

                            setblock.data = JSON.stringify({ parentId: setblock.parent });
                            blocklyJson.blocks.blocks.push(setblock);

                            const inputvalue: string = "1";
                            const inputBlockId: string = generateUniqueId();
                            let returnvalueBlock: any;

                            if (assignment.operator === "++") {
                              returnvalueBlock = {
                                type: "input_somma",
                                fields: {
                                  input_name: assignment.left.name,
                                  input_increment: inputvalue,
                                },
                                id: inputBlockId,
                                parent: setBlockId,
                              };
                            } else if (assignment.operator === "--") {
                              returnvalueBlock = {
                                type: "input_diff",
                                fields: {
                                  input_name: assignment.left.name,
                                  input_decrement: inputvalue,
                                },
                                id: inputBlockId,
                                parent: setBlockId,
                              };
                            }

                            returnvalueBlock.data = JSON.stringify({ parentId: returnvalueBlock.parent });
                            blocklyJson.blocks.blocks.push(returnvalueBlock);
                          }
                        } else if (statement.type == "ReturnStatement"){
                          let returnBlock: BlocklyBlock | undefined;

                          if (!statement.expression) {
                            console.log("Null expression!");
                            const returnBlockId: string = generateUniqueId();
                            returnBlock = {
                              type: "return_block",
                              fields: {
                                input_name: ""
                              },
                              id: returnBlockId,
                              parent: elseBlock?.id, // Safe access in caso elseBlock sia undefined
                              // section: "DO"
                            };
                          } else if (statement.expression.type === "Identifier") {
                            console.log("Terza condizione letta");
                            const assignment = statement.expression;
                            const varName = assignment.name;
                            const returnBlockId: string = generateUniqueId();
                            returnBlock = {
                              type: "return_block",
                              fields: {
                                input_name: varName
                              },
                              id: returnBlockId,
                              parent: elseBlock?.id
                            };

                          } else if (statement.expression.type === "FunctionCall") {
                            const assignment = statement.expression;
                            const name = assignment.expression.expression.name;
                            const membername = assignment.expression.memberName;
                            const varName = `${name}.${membername}`;
                            const returnBlockId: string = generateUniqueId();
                            returnBlock = {
                              type: "return_block",
                              fields: {
                                input_name: varName
                              },
                              id: returnBlockId,
                              parent: elseBlock?.id
                            };
                          }

                          // Impostazione proprietà extra e push nel JSON Blockly
                          if (returnBlock) {
                            returnBlock.data = JSON.stringify({ parentId: returnBlock.parent });
                            blocklyJson.blocks.blocks.push(returnBlock);
                          }
                        } else {
                            console.warn("Nodo non gestito:", statement.type);
                            if (elseBlock){
                              const blackBlock = generateBlackBlock(statement, elseBlock.id);
                              blackBlock.data = JSON.stringify({ parentId: blackBlock.parent });
                              blocklyJson.blocks.blocks.push(blackBlock);
                            }     
                        }
                      });
                    });
                  }  
                } else {
                  // if block
                  ifBlock = {
                    type: "if", // oppure "controls_if"
                    id: ifBlockId,
                    parent: functionBlock.id,
                    fields: {}
                  }; //as any; // oppure crea un tipo specifico se desideri

                  // AGGIUNGI IF BLOCK AL JSON
                  ifBlock.data = JSON.stringify({ parentId: ifBlock.parent });
                  blocklyJson.blocks.blocks.push(ifBlock);
                  console.log("If block added to the json");
                }

                // condizioni per if block
                if (statement.condition && statement.condition.operator) {
                  const solidityOperator: string = statement.condition.operator;
                  console.log("Operatore trovato nel require:", solidityOperator);
                  const conditionType: string = operatorMapping[solidityOperator] || "EQUAL";

                  let inputBlockLeft: BlocklyBlock | undefined;
                  let inputBlockRight: BlocklyBlock | undefined;
                  let requireConditionBlock: BlocklyBlock | undefined;

                  // 1 Condition: UnaryOperator "!"
                  if (solidityOperator === "!") {
                    console.log("Mapping operatore Blockly:", conditionType);
                    const right = statement.condition.right;
                    console.log("Right:", right);

                    const requireConditionBlockId = generateUniqueId();
                    requireConditionBlock = {
                      type: "require_condition",
                      fields: {
                        OPERATOR: conditionType
                      },
                      id: requireConditionBlockId,
                      parent: ifBlock?.id
                    };
                    requireConditionBlock.data = JSON.stringify({ parentId: requireConditionBlock.parent });
                    blocklyJson.blocks.blocks.push(requireConditionBlock);

                    //const type: string = findVariableType(ast, right.name);
                    const typeFound = findVariableType(ast, right.name);
                    if (typeFound){
                      const type: string = typeFound;
                    
                    console.log("name:", type);
                    const inputBlockRightId = generateUniqueId();

                    switch (type) {
                      case "string":
                        inputBlockRight = {
                          type: "variables_get_string",
                          fields: { VAR: right.name },
                          id: inputBlockRightId,
                          parent: requireConditionBlock.id
                        };
                        break;
                      case "uint":
                        inputBlockRight = {
                          type: "variables_get_uint",
                          fields: { VAR: right.name },
                          id: inputBlockRightId,
                          parent: requireConditionBlock.id
                        };
                        break;
                      case "uint256":
                        inputBlockRight = {
                          type: "variables_get_uint256",
                          fields: { VAR: right.name },
                          id: inputBlockRightId,
                          parent: requireConditionBlock.id
                        };
                        break;
                      case "uint8":
                        inputBlockRight = {
                          type: "variables_get_uint8",
                          fields: { VAR: right.name },
                          id: inputBlockRightId,
                          parent: requireConditionBlock.id
                        };
                        break;
                      case "int":
                        inputBlockRight = {
                          type: "variables_get_int",
                          fields: { VAR: right.name },
                          id: inputBlockRightId,
                          parent: requireConditionBlock.id
                        };
                        break;
                      case "bool":
                        inputBlockRight = {
                          type: "variables_get_bool",
                          fields: { VAR: right.name },
                          id: inputBlockRightId,
                          parent: requireConditionBlock.id
                        };
                        break;
                      case "bytes":
                        inputBlockRight = {
                          type: "variables_get_bytes",
                          fields: { VAR: right.name },
                          id: inputBlockRightId,
                          parent: requireConditionBlock.id
                        };
                        break;
                      case "bytes32":
                        inputBlockRight = {
                          type: "variables_get_bytes32",
                          fields: { VAR: right.name },
                          id: inputBlockRightId,
                          parent: requireConditionBlock.id
                        };
                        break;
                      case "address":
                        inputBlockRight = {
                          type: "variables_get_address",
                          fields: { VAR: right.name },
                          id: inputBlockRightId,
                          parent: requireConditionBlock.id
                        };
                        break;
                    }
                  }
                    if (inputBlockRight){
                      inputBlockRight.data = JSON.stringify({ parentId: inputBlockRight.parent });
                      blocklyJson.blocks.blocks.push(inputBlockRight);
                      console.log("inputBlockRight for UnaryOperation created!");
                    }
                    

                  // 2 Condition: BinaryOperator (==, !=, >=, <=, >, <)
                  } else if (
                    solidityOperator === "==" || solidityOperator === "!=" ||
                    solidityOperator === ">=" || solidityOperator === "<=" ||
                    solidityOperator === ">" || solidityOperator === "<"
                  ) {
                    const conditionType: string = operatorMapping[solidityOperator] || "EQUAL";
                    console.log("Mapping operatore Blockly:", conditionType);

                    const left = statement.condition.left || statement.elseStatement?.condition.left;
                    console.log("Left:", left);
                    const right = statement.condition.right || statement.elseStatement?.condition.right;
                    console.log("Right:", right);

                    const requireConditionBlockId = generateUniqueId();
                    requireConditionBlock = {
                      type: "require_condition",
                      fields: {
                        OPERATOR: conditionType
                      },
                      id: requireConditionBlockId,
                      parent: ifBlock?.id
                    };
                    requireConditionBlock.data = JSON.stringify({ parentId: requireConditionBlock.parent });
                    blocklyJson.blocks.blocks.push(requireConditionBlock);

                    // Resto del codice per inputBlockLeft e inputBlockRight puoi copiarlo dallo stesso schema di sopra
                    if (right) {
                      const inputBlockRightId: string = generateUniqueId();

                      if (findVariable(ast, right.name) === true) {
                        const type: string = findVariableType(ast, right.name)!;
                        console.log("name:", type);

                        if (type === "string") {
                          inputBlockRight = {
                            type: "variables_get_string",
                            fields: { VAR: right.name },
                            id: inputBlockRightId,
                            parent: requireConditionBlock.id
                          };
                        } else if (type === "uint") {
                          inputBlockRight = {
                            type: "variables_get_uint",
                            fields: { VAR: right.name },
                            id: inputBlockRightId,
                            parent: requireConditionBlock.id
                          };
                        } else if (type === "uint256") {
                          inputBlockRight = {
                            type: "variables_get_uint256",
                            fields: { VAR: right.name },
                            id: inputBlockRightId,
                            parent: requireConditionBlock.id
                          };
                        } else if (type === "uint8") {
                          inputBlockRight = {
                            type: "variables_get_uint8",
                            fields: { VAR: right.name },
                            id: inputBlockRightId,
                            parent: requireConditionBlock.id
                          };
                        } else if (type === "int") {
                          inputBlockRight = {
                            type: "variables_get_int",
                            fields: { VAR: right.name },
                            id: inputBlockRightId,
                            parent: requireConditionBlock.id
                          };
                        } else if (type === "bool") {
                          inputBlockRight = {
                            type: "variables_get_bool",
                            fields: { VAR: right.name },
                            id: inputBlockRightId,
                            parent: requireConditionBlock.id
                          };
                        } else if (type === "bytes") {
                          inputBlockRight = {
                            type: "variables_get_bytes",
                            fields: { VAR: right.name },
                            id: inputBlockRightId,
                            parent: requireConditionBlock.id
                          };
                        } else if (type === "bytes32") {
                          inputBlockRight = {
                            type: "variables_get_bytes32",
                            fields: { VAR: right.name },
                            id: inputBlockRightId,
                            parent: requireConditionBlock.id
                          };
                        } else if (type === "address") {
                          inputBlockRight = {
                            type: "variables_get_address",
                            fields: { VAR: right.name },
                            id: inputBlockRightId,
                            parent: requireConditionBlock.id
                          };
                        }

                        console.log("inputBlockRight for rightOperand equal to a variable created!");

                      } else {
                        let rightOperand: string = "";

                        if (right.type === "MemberAccess" && right.memberName) {
                          rightOperand = right.expression.name + "." + right.memberName;

                        } else if (
                          right.type === "FunctionCall" &&
                          right.expression.type === "ElementaryTypeName" &&
                          right.expression.name === "address" &&
                          right.arguments?.[0].type === "NumberLiteral" &&
                          right.arguments[0].value === "0"
                        ) {
                          rightOperand = "address(0)";

                        } else if (
                          right.type === "FunctionCall" &&
                          right.expression.type === "ElementaryTypeName" &&
                          right.expression.name === "address" &&
                          right.arguments?.[0].type === "Identifier" &&
                          right.arguments[0].name === "this"
                        ) {
                          rightOperand = "address(this)";

                        } else if (
                          right.type === "MemberAccess" &&
                          right.expression.type === "FunctionCall" &&
                          right.expression.expression.type === "ElementaryTypeName" &&
                          right.expression.expression.name === "address" &&
                          right.expression.arguments?.[0].type === "Identifier" &&
                          right.expression.arguments[0].name === "this" &&
                          right.memberName === "balance"
                        ) {
                          rightOperand = "address(this).balance";

                        } else {
                          rightOperand = typeof right === 'object' ? (right.name ?? right.value) : right;
                        }

                        inputBlockRight = {
                          type: "input_right",
                          fields: {
                            input_name: rightOperand
                          },
                          id: inputBlockRightId,
                          parent: requireConditionBlock.id
                        };
                      }
                      if(inputBlockRight){
                        inputBlockRight.data = JSON.stringify({ parentId: inputBlockRight.parent });
                        blocklyJson.blocks.blocks.push(inputBlockRight);
                      }  
                    }

                    const inputBlockLeftId: string = generateUniqueId();

                    if (findVariable(ast, left.name) === true) {
                      const type: string = findVariableType(ast, left.name)!;
                      console.log("name:", type);

                      if (type === "string") {
                        inputBlockLeft = {
                          type: "variables_get_string",
                          fields: { VAR: left.name },
                          id: inputBlockLeftId,
                          parent: requireConditionBlock.id
                        };
                      } else if (type === "uint") {
                        inputBlockLeft = {
                          type: "variables_get_uint",
                          fields: { VAR: left.name },
                          id: inputBlockLeftId,
                          parent: requireConditionBlock.id
                        };
                      } else if (type === "uint256") {
                        inputBlockLeft = {
                          type: "variables_get_uint256",
                          fields: { VAR: left.name },
                          id: inputBlockLeftId,
                          parent: requireConditionBlock.id
                        };
                      } else if (type === "uint8") {
                        inputBlockLeft = {
                          type: "variables_get_uint8",
                          fields: { VAR: left.name },
                          id: inputBlockLeftId,
                          parent: requireConditionBlock.id
                        };
                      } else if (type === "int") {
                        inputBlockLeft = {
                          type: "variables_get_int",
                          fields: { VAR: left.name },
                          id: inputBlockLeftId,
                          parent: requireConditionBlock.id
                        };
                      } else if (type === "bool") {
                        inputBlockLeft = {
                          type: "variables_get_bool",
                          fields: { VAR: left.name },
                          id: inputBlockLeftId,
                          parent: requireConditionBlock.id
                        };
                      } else if (type === "bytes") {
                        inputBlockLeft = {
                          type: "variables_get_bytes",
                          fields: { VAR: left.name },
                          id: inputBlockLeftId,
                          parent: requireConditionBlock.id
                        };
                      } else if (type === "bytes32") {
                        inputBlockLeft = {
                          type: "variables_get_bytes32",
                          fields: { VAR: left.name },
                          id: inputBlockLeftId,
                          parent: requireConditionBlock.id
                        };
                      } else if (type === "address") {
                        inputBlockLeft = {
                          type: "variables_get_address",
                          fields: { VAR: left.name },
                          id: inputBlockLeftId,
                          parent: requireConditionBlock.id
                        };
                      }

                    } else {
                      let leftOperand: string;

                      if (left.type === "MemberAccess" && left.memberName) {
                        leftOperand = `${left.expression.name}.${left.memberName}`;
                      } else if (
                        left.type === "FunctionCall" &&
                        left.expression.type === "ElementaryTypeName" &&
                        left.expression.name === "address" &&
                        left.arguments?.[0].type === "NumberLiteral" &&
                        left.arguments[0].value === "0"
                      ) {
                        leftOperand = "address(0)";
                      } else if (
                        left.type === "FunctionCall" &&
                        left.expression.type === "ElementaryTypeName" &&
                        left.expression.name === "address" &&
                        left.arguments?.[0].type === "Identifier" &&
                        left.arguments[0].name === "this"
                      ) {
                        leftOperand = "address(this)";
                      } else if (
                        left.type === "MemberAccess" &&
                        left.expression.type === "FunctionCall" &&
                        left.expression.expression.type === "ElementaryTypeName" &&
                        left.expression.expression.name === "address" &&
                        left.expression.arguments?.[0].type === "Identifier" &&
                        left.expression.arguments[0].name === "this" &&
                        left.memberName === "balance"
                      ) {
                        leftOperand = "address(this).balance";
                      } else {
                        leftOperand = typeof left === "object" ? (left.name ?? left.value) : (left as string);
                      }

                      inputBlockLeft = {
                        type: "input",
                        fields: {
                          input_name: leftOperand
                        },
                        id: inputBlockLeftId,
                        parent: requireConditionBlock.id
                      };
                    }
                    // Aggiunta al JSON finale
                    if(inputBlockLeft){
                      inputBlockLeft.data = JSON.stringify({ parentId: inputBlockLeft.parent });
                      blocklyJson.blocks.blocks.push(inputBlockLeft);
                      console.log("inputBlockLeft for Binary Operation created!");
                    }
                  }
                }

                if (statement.ifStatement && statement.ifStatement.statements) {
                  const statements = statement.ifStatement.statements;
                  const sortedIfStatements = statements.slice().sort((a: any, b: any) => b.range[0] - a.range[0]);

                  sortedIfStatements.forEach((statement: any) => {
                    if (
                      statement.type === "ExpressionStatement" &&
                      statement.expression.type === "Assignment"
                    ) {
                      const assignment = statement.expression;
                      const varName = assignment.left.name;
                      const returnValue = assignment.right.name;

                      if (variableTypes[varName]) {
                        const varType = variableTypes[varName];
                        const setBlockId = generateUniqueId();
                        let setblock: BlocklyBlock | undefined;

                        switch (varType) {
                          case "string":
                          case "uint":
                          case "uint256":
                          case "uint8":
                          case "int":
                          case "address":
                          case "bool":
                          case "bytes":
                          case "bytes32":
                            setblock = {
                              type: `variables_set_${varType}`,
                              fields: { VAR: varName },
                              id: setBlockId,
                              parent: ifBlock?.id,
                            };
                            break;
                        }
                        if (setblock){
                          setblock.data = JSON.stringify({ parentId: setblock.parent });
                          blocklyJson.blocks.blocks.push(setblock);
                        }

                        let returnvalueBlock: BlocklyBlock | undefined;
                        const inputBlockId = generateUniqueId();

                        if (statement.expression.operator === "+=") {
                          const incvalue = assignment.right.value || assignment.right.name;
                          returnvalueBlock = {
                            type: "input_somma",
                            fields: {
                              input_name: assignment.left.name,
                              input_increment: incvalue,
                            },
                            id: inputBlockId,
                            parent: setBlockId,
                          };
                        } else if (statement.expression.operator === "-=") {
                          const decvalue = assignment.right.value || assignment.right.name;
                          returnvalueBlock = {
                            type: "input_diff",
                            fields: {
                              input_name: assignment.left.name,
                              input_decrement: decvalue,
                            },
                            id: inputBlockId,
                            parent: setBlockId,
                          };
                        } else if (statement.expression.operator === "=") {
                          if (assignment.right.type === "BinaryOperation") {
                            const inputvalue = assignment.right.right.value || assignment.right.right.name;
                            const inputname = assignment.right.left.name;

                            if (assignment.right.operator === "+") {
                              returnvalueBlock = {
                                type: "input_somma",
                                fields: {
                                  input_name: inputname,
                                  input_increment: inputvalue,
                                },
                                id: inputBlockId,
                                parent: setBlockId,
                              };
                            } else if (assignment.right.operator === "-") {
                              returnvalueBlock = {
                                type: "input_diff",
                                fields: {
                                  input_name: inputname,
                                  input_decrement: inputvalue,
                                },
                                id: inputBlockId,
                                parent: setBlockId,
                              };
                            }
                          } else if (assignment.right.type === "Identifier") {
                            returnvalueBlock = {
                              type: "input",
                              fields: {
                                input_name: returnValue,
                              },
                              id: inputBlockId,
                              parent: setBlockId,
                            };
                          }
                        }
                        if(returnvalueBlock){
                          returnvalueBlock.data = JSON.stringify({ parentId: returnvalueBlock.parent });
                          blocklyJson.blocks.blocks.push(returnvalueBlock);
                        }
                        
                      } else {
                        const lhs =
                          assignment.left.baseExpression.name +
                          "[" +
                          assignment.left.indexExpression.name +
                          "]";
                        const rhs =
                          assignment.right.expression.name + "." + assignment.right.memberName;
                        const code = `${lhs} = ${rhs};`;

                        const returnvalueBlockId = generateUniqueId();
                        const returnvalueBlock = {
                          type: "internalAss",
                          fields: {
                            CODE: code,
                          },
                          id: returnvalueBlockId,
                          parent: ifBlock?.id,
                          data: JSON.stringify({ parentId: ifBlock?.id})
                        };
                        //returnvalueBlock.data = JSON.stringify({ parentId: returnvalueBlock.parent });
                        blocklyJson.blocks.blocks.push(returnvalueBlock);
                      }
                    } else if (
                      statement.type === "ExpressionStatement" &&
                      statement.expression.type === "UnaryOperation"
                    ) {
                      console.log("Seconda condizione letta");

                      const assignment = statement.expression;
                      const varName = assignment.left.name;

                      if (variableTypes[varName]) {
                        const varType: string = variableTypes[varName];
                        const setBlockId = generateUniqueId();
                        let setblock: BlocklyBlock | undefined;

                        switch (varType) {
                          case "string":
                          case "uint":
                          case "uint256":
                          case "uint8":
                          case "int":
                          case "address":
                          case "bool":
                          case "bytes":
                          case "bytes32":
                            setblock = {
                              type: `variables_set_${varType}`,
                              fields: { VAR: varName },
                              id: setBlockId,
                              parent: ifBlock?.id,
                            };
                            break;
                        }
                        if (setblock){
                          setblock.data = JSON.stringify({ parentId: setblock.parent });
                          blocklyJson.blocks.blocks.push(setblock);
                        }
                        
                        const inputvalue = "1";
                        const inputBlockId = generateUniqueId();
                        let returnvalueBlock: any;

                        if (assignment.operator === "++") {
                          returnvalueBlock = {
                            type: "input_somma",
                            fields: {
                              input_name: assignment.left.name,
                              input_increment: inputvalue,
                            },
                            id: inputBlockId,
                            parent: setBlockId,
                          };
                        } else if (assignment.operator === "--") {
                          returnvalueBlock = {
                            type: "input_diff",
                            fields: {
                              input_name: assignment.left.name,
                              input_decrement: inputvalue,
                            },
                            id: inputBlockId,
                            parent: setBlockId,
                          };
                        }

                        returnvalueBlock.data = JSON.stringify({ parentId: returnvalueBlock.parent });
                        blocklyJson.blocks.blocks.push(returnvalueBlock);
                      }
                    } else if (statement.type === "ReturnStatement") {
                      console.log("Terza condizione letta");

                      let returnBlock: BlocklyBlock | undefined;

                      if (!statement.expression) {
                        console.log("Null expression!");
                        const returnBlockId: string = generateUniqueId();
                        returnBlock = {
                          type: "return_block",
                          fields: {
                            input_name: ""
                          },
                          id: returnBlockId,
                          parent: ifBlock?.id
                        };

                      } else if (statement.expression.type === "Identifier") {
                        const assignment = statement.expression;
                        const varName: string = assignment.name;
                        const returnBlockId: string = generateUniqueId();
                        returnBlock = {
                          type: "return_block",
                          fields: {
                            input_name: varName
                          },
                          id: returnBlockId,
                          parent: ifBlock?.id
                        };

                      } else if (statement.expression.type === "FunctionCall") {
                        const assignment = statement.expression;

                        const name1: string | undefined = assignment?.expression?.expression?.name;
                        const membername: string | undefined = assignment?.expression?.memberName;

                        const varName: string = `${name1}.${membername}`;
                        const returnBlockId: string = generateUniqueId();
                        returnBlock = {
                          type: "return_block",
                          fields: {
                            input_name: varName
                          },
                          id: returnBlockId,
                          parent: ifBlock?.id
                        };
                      }
                      if (returnBlock){
                        returnBlock.data = JSON.stringify({ parentId: returnBlock.parent });
                        blocklyJson.blocks.blocks.push(returnBlock);
                      }
                      
                    } else {
                      console.warn("Nodo non gestito:", statement.type);
                      if (ifBlock) {
                        const blackBlock: BlocklyBlock = generateBlackBlock(statement, ifBlock.id);
                        blackBlock.data = JSON.stringify({ parentId: blackBlock.parent });
                        blocklyJson.blocks.blocks.push(blackBlock);
                      }
                    }
                });
                }
              //}
              } else {
                console.warn("Nodo non gestito:", statement.type);

                const blackBlock: BlocklyBlock = generateBlackBlock(statement, functionBlock.id);
                blackBlock.data = JSON.stringify({ parentId: blackBlock.parent });
                blocklyJson.blocks.blocks.push(blackBlock);
              }
            });
          }
        }
        break;
      }
      

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
          addStruct(structName);
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
          addMapping(node.name.name);
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
            addStructArray(varName); 
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
              addArray(arrayName); 
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
              addArray(node.name.name); 
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

      case "StructDefinition": {
        var structBlockId = generateUniqueId();
        addStruct(node.name.name); 

        var structBlock = {
          type: "contract_structures",
          fields: { NAME: node.name.name },
          id: structBlockId,
          parent: parentBlockId || undefined,
          statements: [],
          data: JSON.stringify({ parentId: parentBlockId })
        };

        console.log("StructDefinition - ID: " + structBlock.id + ", Parent: " + parentBlockId);
        blocklyJson.blocks.blocks.push(structBlock);

        var attributes : any = [];
        node.members.forEach(function(member: any) {
          attributes.push({
            name: member.name.name,
            type: member.typeName.name
          });
          traverse(member, structBlock.id); // per generare i blocchi visivi, se necessario
        });

        structRegistry[node.name.name] = attributes;
        saveStruct(node.name.name, attributes); 
        console.log(attributes);
        break;

      }

      case "StructMember": {
        const memberBlockId: string = generateUniqueId();
        console.log(`StructMember - ID: ${memberBlockId}, Parent: ${parentBlockId}`);

        const returnTypeStruct: { [key: string]: string } = {
          bool: "TYPE_BOOL",
          int: "TYPE_INT",
          uint: "TYPE_UINT",
          uint256: "TYPE_UINT256",
          uint8: "TYPE_UINT8",
          string: "TYPE_STRING",
          address: "TYPE_ADDRESS",
          bytes: "TYPE_BYTES",
          bytes32: "TYPE_BYTES32",
        };

        let typeStr: string = "";
        let name: string = node.name.name;

        if (
          node.typeName.name === "int" ||
          node.typeName.name === "uint" ||
          node.typeName.name === "bool" ||
          node.typeName.name === "uint256" ||
          node.typeName.name === "uint8" ||
          node.typeName.name === "string" ||
          node.typeName.name === "address" ||
          node.typeName.name === "bytes32"
        ) {
          console.log("casi definiti");
          typeStr = returnTypeStruct[node.typeName.name];

          const memberBlock: BlocklyBlock = {
            type: "struct_variables",
            fields: {
              TYPE: typeStr,
              NAME: name
            },
            id: memberBlockId,
            parent: parentBlockId || undefined,
            data: JSON.stringify({ parentId: parentBlockId })
          };
          //memberBlock.data = JSON.stringify({ parentId: memberBlock.parent });
          blocklyJson.blocks.blocks.push(memberBlock);
          console.log(`🎯 Creazione blocco: ID=${memberBlock.id}, Tipo=${memberBlock.type}, Parent=${memberBlock.parent}`);
        } else {
          console.log("caso NON contemplato in returnType");
          typeStr = node.typeName.name;

          const memberBlock_black: BlocklyBlock = {
            type: "structVariables_black",
            fields: {
              TYPE: typeStr,
              NAME: name
            },
            id: memberBlockId,
            parent: parentBlockId || undefined,
            data: JSON.stringify({ parentId: parentBlockId })
          };
          //memberBlock_black.data = JSON.stringify({ parentId: memberBlock_black.parent });
          blocklyJson.blocks.blocks.push(memberBlock_black);
        }
        break;

      }

      case "EventDefinition": {
        const returnTypeEvent: { [key: string]: string } = {
          bool: "TYPE_BOOL",
          int: "TYPE_INT",
          uint: "TYPE_UINT",
          uint256: "TYPE_UINT256",
          uint8: "TYPE_UINT8",
          string: "TYPE_STRING",
          address: "TYPE_ADDRESS",
          bytes: "TYPE_BYTES",
          bytes32: "TYPE_BYTES32",
        };

        const eventBlockId: string = generateUniqueId();

        const eventBlock: BlocklyBlock = {
          type: "event",
          fields: { NAME: node.name.name },
          //statements: [],
          id: eventBlockId,
          parent: parentBlockId || undefined,
          data: JSON.stringify({ parentId: parentBlockId })
        };

        addEvent(node.name.name); 
        blocklyJson.blocks.blocks.push(eventBlock);

        if (node.parameters) {
          node.parameters.forEach((param: any) => {
            const paramBlockId: string = generateUniqueId();
            let typeStr: string = "";
            const paramName: string = param.name ? param.name.name : "param";

            if (
              param.typeName.name === "int" ||
              param.typeName.name === "bool" ||
              param.typeName.name === "uint" ||
              param.typeName.name === "uint256" ||
              param.typeName.name === "uint8" ||
              param.typeName.name === "string" ||
              param.typeName.name === "address" ||
              param.typeName.name === "bytes32"
            ) {
              console.log("casi definiti");
              typeStr = returnTypeEvent[param.typeName.name];

              let completeName = paramName;
              if (param.dataLocation?.name) {
                completeName = `${param.dataLocation.name} ${paramName}`;
              }

              const paramBlock: BlocklyBlock = {
                type: "func_inputs",
                fields: {
                  TYPE: typeStr,
                  NAME: completeName
                },
                id: paramBlockId,
                parent: eventBlockId,
                data: JSON.stringify({ parentId: eventBlockId })
              };

              blocklyJson.blocks.blocks.push(paramBlock);

            } else {
              console.log("caso NON contemplato in returnType");
              typeStr = param.typeName.name;
              if (param.dataLocation?.name) {
                typeStr += ` ${param.dataLocation.name}`;
              }

              const paramBlockBlack: BlocklyBlock = {
                type: "func_inputs_black",
                fields: {
                  TYPE: typeStr,
                  NAME: paramName
                },
                id: paramBlockId,
                parent: eventBlockId,
                data: JSON.stringify({ parentId: eventBlockId })
              };

              blocklyJson.blocks.blocks.push(paramBlockBlack);
            }
          });
        }
        break;

      }

      case "ModifierDefinition": {
        const returnTypeModifier: Record<string, string> = {
          "bool": "TYPE_BOOL",
          "int": "TYPE_INT",
          "uint": "TYPE_UINT",
          "uint256": "TYPE_UINT256",
          "uint8": "TYPE_UINT8",
          "string": "TYPE_STRING",
          "address": "TYPE_ADDRESS",
          "bytes": "TYPE_BYTES",
          "bytes32": "TYPE_BYTES32",
        };

        const firstStatement = (node.body?.statements?.[0]) || {};
        const args = (firstStatement.expression?.arguments) || [];

        const modifierBlockId: string = generateUniqueId();
        const modifierBlock: BlocklyBlock = {
          type: "modifier1",
          fields: {
            NAME: node.name?.name || "",
            MESSAGE: args[1]?.value || ""
          },
          //statements: [],
          id: modifierBlockId,
          parent: parentBlockId || undefined,
          data: JSON.stringify({ parentId: parentBlockId })
        };
        //modifierBlock.data = JSON.stringify({ parentId: modifierBlock.parent });
        addModifier(node.name.name);
        blocklyJson.blocks.blocks.push(modifierBlock);

        if (node.parameters) {
          node.parameters.forEach((param: any) => {
            const paramBlockId: string = generateUniqueId();
            let typeStr = "";
            let name = param.name?.name || "param";

            if (
              ["int", "bool", "uint", "uint256", "uint8", "string", "address", "bytes32"].includes(param.typeName?.name)
            ) {
              console.log("casi definiti");
              typeStr = returnTypeModifier[param.typeName.name];

              let datalocation = param.dataLocation?.name || "";
              let completeName = datalocation ? `${datalocation} ${name}` : name;

              const paramBlock: BlocklyBlock = {
                type: "func_inputs",
                fields: {
                  TYPE: typeStr,
                  NAME: completeName
                },
                id: paramBlockId,
                parent: modifierBlock.id
              };
              paramBlock.data = JSON.stringify({ parentId: paramBlock.parent });
              blocklyJson.blocks.blocks.push(paramBlock);

            } else {
              console.log("caso NON contemplato in returnType");
              typeStr = param.typeName?.name || "unknown";
              if (param.dataLocation) {
                typeStr += ` ${param.dataLocation.name}`;
              }

              const paramBlockBlack: BlocklyBlock = {
                type: "func_inputs_black",
                fields: {
                  TYPE: typeStr,
                  NAME: name
                },
                id: paramBlockId,
                parent: modifierBlock.id
              };
              paramBlockBlack.data = JSON.stringify({ parentId: paramBlockBlack.parent });
              blocklyJson.blocks.blocks.push(paramBlockBlack);
            }
          });
        }
        // continua qui
        const operatorMapping: Record<string, string> = {
          "!": "NOT",
          "!=": "NOT_EQUAL",
          "==": "EQUAL",
          ">=": "BIGGER OR EQUAL TO",
          "<=": "LOWER OR EQUAL TO",
          ">": "BIGGER THAN",
          "<": "LOWER THAN"
        };
        console.log("operatorMapping definito");

        if (
          firstStatement.expression?.type === "FunctionCall" &&
          firstStatement.expression.expression?.name === "require"
        ) {
          const requireNode = firstStatement.expression;
          console.log("AST requireNode:", requireNode);

          let conditionType = "";
          let right: any = "";

          if (requireNode.arguments?.length > 0) {
            const requireArg = requireNode.arguments[0];
            let conditionExpression = requireArg?.expressions?.length
              ? requireArg.expressions[0]
              : requireArg;

            if (!conditionExpression) {
              console.error("❌ Errore: impossibile trovare l'espressione logica nel require()");
            } else {
              console.log("✅ conditionExpression trovata:", conditionExpression);
            }

            if (conditionExpression && conditionExpression.operator) {
              const solidityOperator: string = conditionExpression.operator;
              console.log("Operatore trovato nel require:", solidityOperator);

              conditionType = operatorMapping[solidityOperator] || "EQUAL";

              let inputBlockRight: BlocklyBlock | null = null;
              let requireConditionBlock: BlocklyBlock;

              if (solidityOperator === "!") {
                right = conditionExpression.right;
                console.log("Right:", right);

                const requireConditionBlockId = generateUniqueId();
                requireConditionBlock = {
                  type: "require_condition",
                  fields: {
                    OPERATOR: conditionType
                  },
                  id: requireConditionBlockId,
                  parent: modifierBlock.id
                };
                requireConditionBlock.data = JSON.stringify({ parentId: requireConditionBlock.parent });
                blocklyJson.blocks.blocks.push(requireConditionBlock);

                if (right) {
                  const inputBlockRightId = generateUniqueId();

                  if (findVariable(ast, right.name) === true) {
                    const type = findVariableType(ast, right.name);
                    console.log("name:", type);

                    if (type){
                    const baseType = type.toLowerCase();
                    
                    const blockTypeMap: Record<string, string> = {
                      string: "variables_get_string",
                      uint: "variables_get_uint",
                      uint256: "variables_get_uint256",
                      uint8: "variables_get_uint8",
                      int: "variables_get_int",
                      bool: "variables_get_bool",
                      address: "variables_get_address",
                      bytes: "variables_get_bytes",
                      bytes32: "variables_get_bytes32"
                    };

                    const blockType = blockTypeMap[baseType];
                    if (blockType) {
                      inputBlockRight = {
                        type: blockType,
                        fields: { VAR: right.name },
                        id: inputBlockRightId,
                        parent: requireConditionBlock.id
                      };
                    }
                    console.log("inputBlockRight for rightOperand equal to a variable created!");
                  }
                  } else {
                    let rightOperand = "";

                    if (right.baseExpression && right.indexExpression) {
                      const base = right.baseExpression.name;
                      const index = right.indexExpression.name;
                      rightOperand = `${base}[${index}]`;
                    } else if (right.name) {
                      rightOperand = right.name;
                    }

                    inputBlockRight = {
                      type: "input",
                      fields: {
                        input_name: rightOperand
                      },
                      id: inputBlockRightId,
                      parent: requireConditionBlock.id
                    };
                  }

                  if (inputBlockRight) {
                    inputBlockRight.data = JSON.stringify({ parentId: inputBlockRight.parent });
                    blocklyJson.blocks.blocks.push(inputBlockRight);
                    console.log("inputBlockRight for UnaryOperation created!");
                  }
                }
              
              } else if (
                solidityOperator === "==" || solidityOperator === "!=" ||
                solidityOperator === ">=" || solidityOperator === "<=" ||
                solidityOperator === ">" || solidityOperator === "<"
              ) {
                conditionType = operatorMapping[solidityOperator] || "EQUAL";
                console.log("Mapping operatore Blockly:", conditionType);

                const left = conditionExpression.left;
                const right = conditionExpression.right;
                console.log("Left:", left);
                console.log("Right:", right);

                const requireConditionBlockId = generateUniqueId();
                const requireConditionBlock: BlocklyBlock = {
                  type: "require_condition",
                  fields: { OPERATOR: conditionType },
                  id: requireConditionBlockId,
                  parent: modifierBlock.id
                };
                requireConditionBlock.data = JSON.stringify({ parentId: requireConditionBlock.parent });
                blocklyJson.blocks.blocks.push(requireConditionBlock);

                if (right) {
                  const inputBlockRightId = generateUniqueId();
                  let inputBlockRight: BlocklyBlock;

                  if (findVariable(ast, right.name)) {
                    const type = findVariableType(ast, right.name);
                    console.log("Tipo:", type);

                    const typeMap: Record<string, string> = {
                      string: "variables_get_string",
                      uint: "variables_get_uint",
                      uint256: "variables_get_uint256",
                      uint8: "variables_get_uint8",
                      int: "variables_get_int",
                      bool: "variables_get_bool",
                      address: "variables_get_address",
                      bytes: "variables_get_bytes",
                      bytes32: "variables_get_bytes32"
                    };

                    if (type && type in typeMap) {
                    const blockType = typeMap[type];
                    
                    if (blockType) {
                      inputBlockRight = {
                        type: blockType,
                        fields: { VAR: right.name },
                        id: inputBlockRightId,
                        parent: requireConditionBlock.id
                      };
                      console.log("inputBlockRight for variable created!");
                    
                    } else {
                      throw new Error(`❌ Tipo non supportato: ${type}`);
                    }
                    
                  
                  
                  } else {
                    let rightOperand: string = "";

                    if (
                      right.type === "MemberAccess" &&
                      right.expression.type === "Identifier"
                    ) {
                      if (right.expression.name === "msg") {
                        if (right.memberName === "sender") rightOperand = "msg.sender";
                        else if (right.memberName === "value") rightOperand = "msg.value";
                      }
                    } else if (
                      right.type === "FunctionCall" &&
                      right.expression.type === "ElementaryTypeName" &&
                      right.expression.name === "address"
                    ) {
                      if (
                        right.arguments &&
                        right.arguments[0].type === "NumberLiteral" &&
                        right.arguments[0].value === "0"
                      ) {
                        rightOperand = "address(0)";
                      } else if (
                        right.arguments &&
                        right.arguments[0].type === "Identifier" &&
                        right.arguments[0].name === "this"
                      ) {
                        rightOperand = "address(this)";
                      }
                    } else if (
                      right.type === "MemberAccess" &&
                      right.expression.type === "FunctionCall" &&
                      right.expression.expression.type === "ElementaryTypeName" &&
                      right.expression.expression.name === "address" &&
                      right.expression.arguments &&
                      right.expression.arguments[0].type === "Identifier" &&
                      right.expression.arguments[0].name === "this" &&
                      right.memberName === "balance"
                    ) {
                      rightOperand = "address(this).balance";
                    } else {
                      rightOperand = typeof right === "object"
                        ? (right.name ?? right.value ?? "")
                        : String(right);
                    }

                    inputBlockRight = {
                      type: "input_right",
                      fields: { input_name: rightOperand },
                      id: inputBlockRightId,
                      parent: requireConditionBlock.id
                    };
                  }
                

                  inputBlockRight.data = JSON.stringify({ parentId: inputBlockRight.parent });
                  blocklyJson.blocks.blocks.push(inputBlockRight);
                  console.log("✅ inputBlockRight creato");
                
                
                }

                let inputBlockLeft: BlocklyBlock;
                const inputBlockLeftId = generateUniqueId();

                if (
                  left.type === "MemberAccess" &&
                  left.expression.type === "Identifier" &&
                  left.expression.name === "msg"
                ) {
                  let leftOperand = "";

                  if (left.memberName === "sender") {
                    leftOperand = "msg.sender";
                  } else if (left.memberName === "value") {
                    leftOperand = "msg.value";
                  }

                  inputBlockLeft = {
                    type: "input",
                    fields: {
                      input_name: leftOperand
                    },
                    id: inputBlockLeftId,
                    parent: requireConditionBlock.id
                  };

                } else if (
                  left.type === "FunctionCall" &&
                  left.expression.type === "ElementaryTypeName" &&
                  left.expression.name === "address"
                ) {
                  let leftOperand = "";

                  if (
                    left.arguments?.[0]?.type === "NumberLiteral" &&
                    left.arguments[0].value === "0"
                  ) {
                    leftOperand = "address(0)";
                  } else if (
                    left.arguments?.[0]?.type === "Identifier" &&
                    left.arguments[0].name === "this"
                  ) {
                    leftOperand = "address(this)";
                  }

                  inputBlockLeft = {
                    type: "input",
                    fields: {
                      input_name: leftOperand
                    },
                    id: inputBlockLeftId,
                    parent: requireConditionBlock.id
                  };

                } else if (
                  left.type === "MemberAccess" &&
                  left.expression.type === "FunctionCall" &&
                  left.expression.expression.type === "ElementaryTypeName" &&
                  left.expression.expression.name === "address" &&
                  left.expression.arguments?.[0]?.type === "Identifier" &&
                  left.expression.arguments[0].name === "this" &&
                  left.memberName === "balance"
                ) {
                  const leftOperand = "address(this).balance";

                  inputBlockLeft = {
                    type: "input",
                    fields: {
                      input_name: leftOperand
                    },
                    id: inputBlockLeftId,
                    parent: requireConditionBlock.id
                  };

                } else {
                  // Trattamento come variabile Solidity
                  const type = findVariableType(ast, left.name);
                  console.log("Tipo variabile:", type);

                  const typeToBlockMap: Record<string, string> = {
                    string: "variables_get_string",
                    uint: "variables_get_uint",
                    uint256: "variables_get_uint256",
                    uint8: "variables_get_uint8",
                    int: "variables_get_int",
                    bool: "variables_get_bool",
                    bytes: "variables_get_bytes",
                    bytes32: "variables_get_bytes32",
                    address: "variables_get_address"
                  };
                  
                  if (type && type in typeToBlockMap) {
                  const blockType = typeToBlockMap[type];

                  inputBlockLeft = {
                    type: blockType,
                    fields: {
                      VAR: left.name
                    },
                    id: inputBlockLeftId,
                    parent: requireConditionBlock.id
                  };
                } else {
                  throw new Error(`❌ Tipo non gestito o nullo per la variabile: ${type}`);
                }
              }
              

                // Salvataggio e aggiunta al JSON Blockly
                inputBlockLeft.data = JSON.stringify({ parentId: inputBlockLeft.parent });
                blocklyJson.blocks.blocks.push(inputBlockLeft);
                console.log("✅ inputBlockLeft creato per BinaryOperation");
              }
              break;
            }
          }
        }
      }
    }
  }
  }

  traverse(ast);
  return blocklyJson;
}

function generateUniqueId(): string {
  return 'block_' + Math.random().toString(36).slice(2, 11);
}

//cd backend, npx ts-node src/app.ts
//cd frontend, npm run dev



type ASTNode = {
  range?: [number, number];
  [key: string]: any;
};


function extractSolidityCodeFromNode(node: ASTNode): string {
  if (!node || !node.range || node.range.length !== 2) {
    return "// Node not valid or without range";
  }

  const [start, end] = node.range;

  if (typeof start !== 'number' || typeof end !== 'number') {
    return "// Interval not valid";
  }

  if (start < 0 || end > globalSourceCode.length || start >= end) {
    return "// Range out of limits";
  }

  return globalSourceCode.slice(start, end);
}

function generateBlackBlock(node: ASTNode, parentId: string): BlocklyBlock {
  const rawCode: string = extractSolidityCodeFromNode(node);
  const blackBlockId: string = generateUniqueId();

  return {
    type: "unknownCode",
    fields: {
      CODE: rawCode
    },
    id: blackBlockId,
    parent: parentId
  };
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
    console.log(`Positioned block ${block.type} (ID: ${block.id}) a X:${x}, Y:${y}`);
  }

  // Primo passaggio: posizionare il blocco di tipo "structure"
  blocks.forEach((block) => {
    if (!block) return;
    console.log(`Positioniong blocks: ID=${block.id}, Tipo=${block.type}, Parent=${block.data}`);

    if (["structure"].includes(block.type)) {
      placeBlock(block, x, y);
      console.log(`Parent ${block.type} (ID: ${block.id}) positioned at X:${x}, Y:${y}`);
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
      console.warn(`⚠️ Error in parsing data of block ${block.id}:`, e);
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
    } else if (block.type === "mapping" || block.type === "assign_values_to_variable_array" || block.type === "define_variable" || block.type === "array" || block.type === "define_variable_with_assignment" ||block.type === "define_struct_variable_with_assignment" || block.type === "define_variable_with_assignment1" || block.type === "method" || block.type === "contract_constructor" || block.type === "modifier1" || block.type ===  "event" || block.type === "contract_structures"){
        const parent = blocks.find(b => b.type === "contract" && parentId === b.id); 
        if (parent){ 
          const inputVariables = parent.getInput('VARIABLES');
          const inputStructs = parent.getInput('STRUCTS');
          const inputMappings = parent.getInput('MAPPINGS');
          const inputEvents = parent.getInput('EVENTS');
          const inputConstructor = parent.getInput('CONSTRUCTOR');
          const inputModifiers = parent.getInput('MODIFIERS');
          const inputmethods = parent.getInput('METHODS');  // Troviamo lo spazio input
          const inputArrays = parent.getInput('ARRAYS');
          
          
          if (inputVariables && inputVariables.connection) {
            // Se il blocco non è di tipo "method", lo connettiamo a STATES
            if (block.type === "define_variable" || block.type === "define_variable_with_assignment" || block.type === "define_variable_with_assignment1") {
              if (block.previousConnection){
                inputVariables.connection.connect(block.previousConnection);
              }
            }
          }
          if (inputStructs && inputStructs.connection) {
            // Se il blocco non è di tipo "method", lo connettiamo a STATES
            if (block.type === "contract_structures" || block.type === "define_struct_variable_with_assignment") {
              if (block.previousConnection){
                inputStructs.connection.connect(block.previousConnection);
              }
            }
          }
          if (inputMappings && inputMappings.connection) {
            // Se il blocco non è di tipo "method", lo connettiamo a STATES
            if (block.type === "mapping") {
              if (block.previousConnection){
                inputMappings.connection.connect(block.previousConnection);
              }
            }
          }
          if (inputEvents && inputEvents.connection) {
            // Se il blocco non è di tipo "method", lo connettiamo a STATES
            if (block.type === "event") {
              if (block.previousConnection){
                inputEvents.connection.connect(block.previousConnection);
              }
            }
          }
          if (inputArrays?.connection) {
            const arrayBlocks = blocks.filter(
              b =>
                b.type === 'array' ||
                b.type === 'structs_array' ||
                b.type === 'assign_values_to_variable_array'
            );

            let prevBlock: Blockly.Block | null = null;

            arrayBlocks.forEach((arrayBlock, i) => {
              if (i === 0) {
                if(arrayBlock.previousConnection){
                  inputArrays.connection!.connect(arrayBlock.previousConnection);
                }
                } else if (prevBlock?.nextConnection && arrayBlock.previousConnection) {
                prevBlock.nextConnection.connect(arrayBlock.previousConnection);
              }
              prevBlock = arrayBlock;
            });
          }
          if (inputConstructor && inputConstructor.connection) {
            // Se il blocco non è di tipo "method", lo connettiamo a STATES
            if (block.type === "contract_constructor") {
              if (block.previousConnection){
                inputConstructor.connection.connect(block.previousConnection);
              }
            }
          }
          if (inputModifiers && inputModifiers.connection) {
            // Se il blocco non è di tipo "method", lo connettiamo a STATES
            if (block.type === "modifier1") {
              if (block.previousConnection){
                inputModifiers.connection.connect(block.previousConnection);
              }
            }
          }  
          if (inputmethods?.connection) {
            const type = block.type as string;

            if (
              type === "method" ||
              type === "variables_get_u" ||
              type === "variables_get_s" ||
              type === "variables_get_b" ||
              type === "variables_get_a" ||
              type === "variables_get_i" ||
              type === "variables_get_u8" ||
              type === "variables_get_u256" ||
              type === "variables_get_bytes" ||
              type === "variables_get_bytes32"
            ) {
              if (block.previousConnection) {
                inputmethods.connection.connect(block.previousConnection);
              }
            }
          }    
        }  
        } else if (
          [
            "variables_get_string", "variables_get_string_constants", "variables_get_string_immutables",
            "variables_get_uint", "variables_get_uint_constants", "variables_get_uint_immutables",
            "variables_get_uint8", "variables_get_uint8_constants", "variables_get_uint8_immutables",
            "variables_get_int", "variables_get_int_constants", "variables_get_int_immutables",
            "variables_get_address", "variables_get_address_constants", "variables_get_address_immutables",
            "variables_get_bool", "variables_get_bool_constants", "variables_get_bool_immutables",
            "variables_get_uint256", "variables_get_uint256_constants", "variables_get_uint256_immutables",
            "variables_get_bytes", "variables_get_bytes_constants", "variables_get_bytes_immutables",
            "variables_get_bytes32", "variables_get_bytes32_constants", "variables_get_bytes32_immutables",
            "variables_black_block"
          ].includes(block.type as string)
        ) {
          const parent = blocks.find(
            (b: Blockly.Block) =>
              ["define_variable", "require_condition", "define_variable_with_assignment", "define_variable_with_assignment1"].includes(b.type as string) &&
              parentId === b.id
          );

          if (parent) {
            if (parent.type === "define_variable") {
              const inputValue = parent.getInput("VALUE");
              if (inputValue?.connection && block.outputConnection) {
                console.log(`Collegamento getter ${block.id} a define_variable ${parent.id}`);
                inputValue.connection.connect(block.outputConnection);
              }
            } else if (parent.type === "define_variable_with_assignment") {
              const input = parent.getInput("VALUE");
              if (input?.connection&& block.outputConnection) {
                console.log(`Collegamento getter ${block.id} a define_variable_WITH_ASS ${parent.id}`);
                input.connection.connect(block.outputConnection);
              }
            } else if (parent.type === "define_variable_with_assignment1") {
              const input1 = parent.getInput("VALUE");
              if (input1?.connection && block.outputConnection) {
                console.log(`Collegamento getter ${block.id} a define_variable_WITH_ASS_1 ${parent.id}`);
                input1.connection.connect(block.outputConnection);
              }
            } else if (parent.type === "require_condition") {
              const inputValueLeft = parent.getInput("LEFT");
              const inputValueRight = parent.getInput("RIGHT");

              if (inputValueLeft?.connection) {
                const connectedBlockL = inputValueLeft.connection.targetBlock();
                if (!connectedBlockL && block.outputConnection) {
                  console.log(`Collegamento input ${block.id} a LEFT di require_condition ${parent.id}`);
                  inputValueLeft.connection.connect(block.outputConnection);
                }
              }

              if (inputValueRight?.connection) {
                const connectedBlockR = inputValueRight.connection.targetBlock();
                if (!connectedBlockR && block.outputConnection) {
                  console.log(`Collegamento input ${block.id} a RIGHT di require_condition ${parent.id}`);
                  inputValueRight.connection.connect(block.outputConnection);
                }
              }
            }
          }
        } else if (block.type === "internalAss") {
          const parent = blocks.find(
            (b): b is Blockly.Block => ["method", "if"].includes(b.type) && parentId === b.id
          );
          if (parent && parent.type === "if") {
            const doInput = parent.getInput("DO");
            if (doInput?.connection && block.previousConnection) {
              doInput.connection.connect(block.previousConnection);
            }
          }

        } else if (block.type === "return_block") {
          const parent = blocks.find(
            (b): b is Blockly.Block =>
              ["method", "if", "else_if", "else", "controls_if", "controls_ifelse"].includes(b.type) && parentId === b.id
          );
          if (parent) {
            if (parent.type === "method") {
              const inputReturn = parent.getInput("STACK");
              if (inputReturn?.connection && block.previousConnection) {
                inputReturn.connection.connect(block.previousConnection);
              }
            } else if (["if", "else_if", "else"].includes(parent.type)) {
              const doInput = parent.getInput("DO");
              if (doInput?.connection && block.previousConnection) {
                doInput.connection.connect(block.previousConnection);
              }
            } else if (["controls_if", "controls_ifelse"].includes(parent.type)) {
              let n = 0;
              let doInput: Blockly.Input | null;
              while ((doInput = parent.getInput("DO" + n))) {
                if (doInput.connection && !doInput.connection.isConnected() && block.previousConnection) {
                  doInput.connection.connect(block.previousConnection);
                  break;
                }
                n++;
              }
            }
          }

        } else if (block.type === "internalFunc" || block.type === "localVariable") {
          const parent = blocks.find(
            (b): b is Blockly.Block => b.type === "method" && parentId === b.id
          );
          if (parent) {
            const inputMethod = parent.getInput("STACK");
            if (inputMethod?.connection && block.previousConnection) {
              inputMethod.connection.connect(block.previousConnection);
            }
          }

        } else if (block.type === "unknownCode") {
          const parent = blocks.find(
            (b): b is Blockly.Block => ["method", "if", "else", "else_if"].includes(b.type) && parentId === b.id
          );
          if (parent) {
            if (["else_if", "if", "else"].includes(parent.type)) {
              const inputMethod = parent.getInput("DO");
              if (inputMethod?.connection && block.previousConnection) {
                inputMethod.connection.connect(block.previousConnection);
              }
            } else if (parent.type === "method") {
              const inputMethod = parent.getInput("STACK");
              if (inputMethod?.connection && block.previousConnection) {
                inputMethod.connection.connect(block.previousConnection);
              }
            }
          }
        } else if (block.type === "if") {
          const parent = blocks.find(
            (b): b is Blockly.Block =>
              ["if_else_container", "if_elseif_else_container", "method"].includes(b.type) && parentId === b.id
          );
          if (parent) {
            if (["if_else_container", "if_elseif_else_container"].includes(parent.type)) {
              const inputReturn = parent.getInput("IF");
              if (inputReturn?.connection && block.previousConnection) {
                inputReturn.connection.connect(block.previousConnection);
              }
            } else if (parent.type === "method") {
              const inputReturn = parent.getInput("STACK");
              if (inputReturn?.connection && block.previousConnection) {
                inputReturn.connection.connect(block.previousConnection);
              }
            }
          }

        } else if (block.type === "emit_event") {
          const parent = blocks.find((b): b is Blockly.Block => b.type === "method" && parentId === b.id);
          if (parent) {
            const inputReturn = parent.getInput("STACK");
            if (inputReturn?.connection && block.previousConnection) {
              inputReturn.connection.connect(block.previousConnection);
            }
          }

        } else if (
          ["define_arrayVariable", "array_pop", "new_struct_value", "array_push", "array_delete", "struct_push"].includes(block.type)
        ) {
          const parent = blocks.find((b): b is Blockly.Block => b.type === "method" && parentId === b.id);
          if (parent) {
            const inputReturn = parent.getInput("STACK");
            if (inputReturn?.connection) {
              const arrayBlocks = blocks.filter(
                b =>
                  [
                    "define_arrayVariable",
                    "array_pop",
                    "new_struct_value",
                    "array_push",
                    "array_delete",
                    "struct_push"
                  ].includes(b.type)
              );
              let prevBlock: Blockly.Block | null = null;
              arrayBlocks.forEach((block, i) => {
                if (i === 0) {
                  if (inputReturn.connection && block.previousConnection) {
                    inputReturn.connection.connect(block.previousConnection);
                  }
                } else if (prevBlock?.nextConnection && block.previousConnection) {
                  prevBlock.nextConnection.connect(block.previousConnection);
                }
                prevBlock = block;
              });
            }
          }

        } else if (block.type === "new_struct") {
          const parent = blocks.find(
            (b): b is Blockly.Block =>
              ["struct_push", "define_struct_variable_with_assignment"].includes(b.type) && parentId === b.id
          );
          if (parent) {
            if (parent.type === "struct_push") {
              const inputPush = parent.getInput("PARAMS1");
              if (inputPush?.connection && block.outputConnection) {
                inputPush.connection.connect(block.outputConnection);
              }
            } else if (parent.type === "define_struct_variable_with_assignment") {
              const inputPush = parent.getInput("ASSIGNED_STRUCT");
              if (inputPush?.connection && block.outputConnection) {
                inputPush.connection.connect(block.outputConnection);
              }
            }
          }

        } else if (block.type === "getter_mappings" || block.type === "array_values") {
          const parent = blocks.find((b): b is Blockly.Block => b.type === "method" && parentId === b.id);
          if (parent) {
            const inputReturn = parent.getInput("STACK");
            if (inputReturn?.connection && block.previousConnection) {
              inputReturn.connection.connect(block.previousConnection);
            }
          }

        } else if (block.type === "else_if") {
          const parent = blocks.find((b): b is Blockly.Block => b.type === "if_elseif_else_container" && parentId === b.id);
          if (parent) {
            const inputReturn = parent.getInput("ELSE_IF");
            if (inputReturn?.connection && block.previousConnection) {
              inputReturn.connection.connect(block.previousConnection);
            }
          }

        } else if (block.type === "else") {
          const parent = blocks.find(
            (b): b is Blockly.Block => ["if_else_container", "if_elseif_else_container"].includes(b.type) && parentId === b.id
          );
          if (parent) {
            const inputReturn = parent.getInput("ELSE");
            if (inputReturn?.connection && block.previousConnection) {
              inputReturn.connection.connect(block.previousConnection);
            }
          }
        } else if (block.type === "controls_if" || block.type === "controls_ifelse") {
          const parent = blocks.find(b => b.type === "method" && parentId === b.id);
          if (parent) {
            const inputReturn = parent.getInput('STACK');
            if (inputReturn?.connection && block.previousConnection) {
              inputReturn.connection.connect(block.previousConnection);
            }
          }
        } else if (block.type === "if_else_container" || block.type === "if_elseif_else_container") {
          const parent = blocks.find(b => b.type === "method" && parentId === b.id);
          if (parent) {
            const inputReturn = parent.getInput('STACK');
            if (inputReturn?.connection && block.previousConnection) {
              inputReturn.connection.connect(block.previousConnection);
            }
          }
        } else if (block.type === "func_inputs" || block.type === "func_inputs_black") {
          const parent = blocks.find(b =>
            ["method", "contract_constructor", "modifier1", "event", "variables_get_modifiers"].includes(b.type)
            && parentId === b.id);
          if (parent) {
            const inputParams = parent.getInput('PARAMS');
            if (inputParams?.connection && block.previousConnection) {
              inputParams.connection.connect(block.previousConnection);
            }
          }
        } else if (block.type === "func_returnValues") {
          const parent = blocks.find(b => b.type === "method" && parentId === b.id);
          if (parent) {
            const inputReturnValues = parent.getInput('RETURN_VALUES');
            if (inputReturnValues?.connection && block.previousConnection) {
              inputReturnValues.connection.connect(block.previousConnection);
            }
          }
        } else if (block.type === "struct_variables" || block.type === "structVariables_black") {
          //console.log(`🔍 Prima del posizionamento: ID=${block.id}, Tipo=${block.type}, Parent=${block.parent}`);
          const parent = blocks.find(b => b.type === "contract_structures" && parentId === b.id);
          if (parent) {
            console.log(`Found parent: ${parent.id}, Type: ${parent.type}`);
          } else {
            console.log(`❌ Parent non found for struct_variables ${block.id}`);
          }

          if (parent) {
            const input = parent.getInput('STATES');
            if (input?.connection && block.previousConnection) {
              input.connection.connect(block.previousConnection);
            }
          }
        } else if (
          [
            "variables_set_string", "variables_set_bytes", "variables_set_bytes32", "variables_set_uint",
            "variables_set_uint256", "variables_set_uint8", "variables_set_int", "variables_set_address",
            "variables_set_bool"
          ].includes(block.type)
        ) {
          const parent = blocks.find(b =>
            ["method", "if", "else_if", "else", "controls_if", "controls_ifelse", "contract_constructor", "modifier1"]
              .includes(b.type) && parentId === b.id);

          console.log("section: " + section);

          if (parent) {
            if (["method", "contract_constructor", "modifier1"].includes(parent.type)) {
              const inputCode = parent.getInput('STACK');
              if (inputCode?.connection && block.previousConnection) {
                inputCode.connection.connect(block.previousConnection);
              }
            } else if (["if", "else_if", "else"].includes(parent.type)) {
              const doInput = parent.getInput('DO');
              if (doInput?.connection && block.previousConnection) {
                doInput.connection.connect(block.previousConnection);
              }
            } else if (["controls_if", "controls_ifelse"].includes(parent.type)) {
              let doInput, elseInput;

              if (section === "DO") {
                let n = 0;
                while ((doInput = parent.getInput("DO" + n))) {
                  if (doInput.connection && block.previousConnection) {
                    doInput.connection.connect(block.previousConnection);
                    break;
                  }
                  n++;
                }
              } else if (section === "ELSE") {
                elseInput = parent.getInput("ELSE");
                if (elseInput?.connection && block.previousConnection) {
                  elseInput.connection.connect(block.previousConnection);
                }
              }
            }
          }
        } else if (block.type === "input") {
          const parent = blocks.find(b =>
            [
              "variables_set_string", "variables_set_uint", "variables_set_bytes", "variables_set_bytes32",
              "variables_set_uint256", "variables_set_uint8", "variables_set_int", "variables_set_address",
              "variables_set_bool", "require_condition"
            ].includes(b.type) && parentId === b.id
          );

          if (parent?.type &&
            [
              "variables_set_string", "variables_set_bytes", "variables_set_bytes32", "variables_set_uint",
              "variables_set_uint256", "variables_set_uint8", "variables_set_int", "variables_set_address",
              "variables_set_bool"
            ].includes(parent.type)
          ) {
            const inputValue = parent.getInput('VALUE');
            if (inputValue?.connection && block.outputConnection) {
              inputValue.connection.connect(block.outputConnection);
            }
          } else if (parent?.type === "require_condition") {
            const inputValueLeft = parent.getInput("LEFT");
            if (inputValueLeft?.connection && block.outputConnection) {
              inputValueLeft.connection.connect(block.outputConnection);
            }
          }

        } else if (block.type === "input_right") {
          const parent = blocks.find(b => b.type === "require_condition" && parentId === b.id);
          if (parent?.type === "require_condition") {
            const inputValueRight = parent.getInput("RIGHT");
            if (inputValueRight?.connection && block.outputConnection) {
              inputValueRight.connection.connect(block.outputConnection);
            }
          }

        } else if (block.type === 'input_somma' || block.type === 'input_diff') {
          const parent = blocks.find(b =>
            [
              "variables_set_string", "variables_set_uint", "variables_set_uint256", "variables_set_uint8",
              "variables_set_int", "variables_set_address", "variables_set_bool",
              "variables_set_bytes", "variables_set_bytes32", "require_condition"
            ].includes(b.type) && parentId === b.id
          );

          if (parent?.type &&
            [
              "variables_set_string", "variables_set_bytes", "variables_set_bytes32", "variables_set_uint",
              "variables_set_uint256", "variables_set_uint8", "variables_set_int", "variables_set_address",
              "variables_set_bool"
            ].includes(parent.type)
          ) {
            const inputValue = parent.getInput('VALUE');
            if (inputValue?.connection && block.outputConnection) {
              inputValue.connection.connect(block.outputConnection);
            }
          }

        } else if (block.type === "require_condition") {
          const parent = blocks.find(b =>
            [
              "modifier1", "if", "else_if", "else", "controls_if", "controls_ifelse", "require_condition_method1"
            ].includes(b.type) && parentId === b.id
          );

          if (parent) {
            if (parent.type === "controls_if" || parent.type === "controls_ifelse") {
              let n = 0;
              let ifInput;
              do {
                ifInput = parent.getInput("IF" + n);
                n++;
              } while (!ifInput && parent.getInput("IF" + n));

              if (ifInput?.connection && block.outputConnection) {
                ifInput.connection.connect(block.outputConnection);
              }
            } else if (parent.type === "if") {
              const doInput = parent.getInput('IF');
              if (doInput?.connection && block.outputConnection) {
                doInput.connection.connect(block.outputConnection);
              }
            } else if (parent.type === "else_if") {
              const doInput = parent.getInput('ELSE_IF');
              if (doInput?.connection && block.outputConnection) {
                doInput.connection.connect(block.outputConnection);
              }
            } else if (
              parent.type === "modifier1" ||
              parent.type === "require_condition_method1"
            ) {
              const conditionInput = parent.getInput("CONDITION");
              if (conditionInput?.connection && block.outputConnection) {
                conditionInput.connection.connect(block.outputConnection);
              }
            }
          }

        } else if (block.type === "variables_get_modifiers") {
          const parent = blocks.find(b => b.type === "method" && parentId === b.id);
          if (parent) {
            const modifierInput = parent.getInput("MODIFIERS");
            if (modifierInput?.connection && block.previousConnection) {
              modifierInput.connection.connect(block.previousConnection);
            }
          }

        } else if (block.type === "require_condition_method1") {
          const parent = blocks.find(b => b.type === "method" && parentId === b.id);
          if (parent) {
            const requireInput = parent.getInput("REQUIRE");
            if (requireInput?.connection && block.previousConnection) {
              requireInput.connection.connect(block.previousConnection);
            }
          }
        }
  });
}


// Tipizzazione generica per i nodi, puoi specificare un'interfaccia migliore se nota
let elseStatementnodes: any[] = [];
let savedElseBlockStatements: any[] = [];
let savedElseBlockStatements1: any[] = [];

// Funzione per svuotare gli array
function resetArrays(): void {
  savedElseBlockStatements = [];
  savedElseBlockStatements1 = [];
  elseStatementnodes = [];
}

/*
// Tipo generico per ASTNode (puoi adattarlo secondo la tua definizione completa dell'AST)
interface ASTNode {
  type: string;
  elseStatement?: ASTNode;
  nodes?: ASTNode[];
  [key: string]: any;
}*/

function countElseIfStatements(node: ASTNode): number {
  let count = 0;

  if (node.type === "IfStatement") {
    if (node.elseStatement && node.elseStatement.type === "IfStatement") {
      count++;
      elseStatementnodes.push(node);

      // Salva blocco annidato in un IfStatement → Block
      if (
        node.elseStatement.elseStatement &&
        node.elseStatement.elseStatement.type === "Block"
      ) {
        savedElseBlockStatements1.push(node.elseStatement);
      }

      // Ricorsione
      count += countElseIfStatements(node.elseStatement);
    }

    // else finale di tipo Block
    if (node.elseStatement && node.elseStatement.type === "Block") {
      savedElseBlockStatements.push(node.elseStatement);
    }
  }

  // Esplora eventuali nodi figli
  if (node.nodes && Array.isArray(node.nodes)) {
    node.nodes.forEach((childNode) => {
      count += countElseIfStatements(childNode);
    });
  }

  return count;
}


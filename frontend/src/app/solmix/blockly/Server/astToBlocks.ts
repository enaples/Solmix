import { SourceUnit, ImportDirective, ContractDefinition } from "solidity-antlr4";
import * as Blockly from "blockly";
import { structRegistry } from "../dropdown/dropdown";
import { createGetterSetterBlocks } from "../toolbox/create_dynamic_variables";
import { SolidityAccess, addEvent, addMapping, addArray, addModifier, addStruct, saveStruct, addStructArray, findVariable, findVariableType} from "../dropdown/dropdown";
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

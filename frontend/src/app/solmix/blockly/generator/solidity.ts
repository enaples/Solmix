import * as Blockly from "blockly";
import { variableTypes } from "../blocks/variable_types";
import {getSolidityEvent, getSolidityMapping, getSolidityArray, getSolidityModifier} from "../dropdown/dropdown";
import {getSolidityStringVariable, getSolidityStringConstantsVariable, getSolidityStringImmutablesVariable } from "../dropdown/dropdown";
import {getSolidityIntVariable, getSolidityIntConstantsVariable, getSolidityIntImmutablesVariable} from "../dropdown/dropdown";
import {getSolidityAddressVariable, getSolidityAddressConstantsVariable, getSolidityAddressImmutablesVariable} from "../dropdown/dropdown";
import {getSolidityUintVariable, getSolidityUintConstantsVariable, getSolidityUintImmutablesVariable, getSolidityUint256Variable, getSolidityUint256ConstantsVariable, getSolidityUint256ImmutablesVariable, getSolidityUint8Variable, getSolidityUint8ConstantsVariable, getSolidityUint8ImmutablesVariable} from "../dropdown/dropdown";
import {getSolidityStruct, structRegistry} from "../dropdown/dropdown";
//import { javascriptGenerator } from "blockly/javascript";

//import {addEvent} from "../blocks/dynamicEventBloks";

export const solidityGenerator = new Blockly.Generator("Solidity");

// Define order constants for proper precedence
const Order = {
    ATOMIC: 0,
    ASSIGNMENT: 1,
    FUNCTION_CALL: 2,
};

// Type mappings for reusability
const SOLIDITY_TYPES = {
    TYPE_BOOL: "bool",
    TYPE_INT: "int",
    TYPE_UINT: "uint",
    TYPE_UINT256: "uint256",
    TYPE_UINT8: "uint8",
    TYPE_STRING: "string",
    TYPE_ADDRESS: "address",
    TYPE_BYTES32: "bytes32",
    TYPE_BYTES: "bytes",
} as const;

const ARRAY_TYPES = {
    TYPE_BOOL: "bool[]",
    TYPE_INT: "int[]",
    TYPE_UINT: "uint[]",
    TYPE_UINT256: "uint256[]",
    TYPE_UINT8: "uint8[]",
    TYPE_STRING: "string[]",
    TYPE_ADDRESS: "address[]",
    TYPE_BYTES32: "bytes32[]",
    TYPE_BYTES: "bytes[]",
} as const;

const ACCESS_MODIFIERS = {
    TYPE_PUBLIC: "public",
    TYPE_PRIVATE: "private",
    TYPE_INTERNAL: "internal",
    TYPE_EXTERNALE: "external",
} as const;

const RETURN_TYPES = {
    TYPE_YES: "returns",
    TYPE_FALSE: "",
} as const;

const VIEW_TYPES = {
    TYPE_YES: "view",
    TYPE_FALSE: "",
} as const;

const PURE_TYPES = {
    TYPE_YES: "pure",
    TYPE_FALSE: "",
} as const;

const PAYABLE_TYPES = {
    TYPE_YES: "payable",
    TYPE_FALSE: "",
} as const;

const REQUIRE_OPERATORS = {
    NOT: "!",
    NOT_EQUAL: "!=",
    EQUAL: "==",
    "BIGGER OR EQUAL TO": ">=",
    "LOWER OR EQUALTO": "<=",
    "BIGGER THAN": ">",
    "LOWER THAN": "<",
} as const;

// # Variable set generator
Object.keys(variableTypes).forEach((type: string) => {
    solidityGenerator.forBlock[`solidity_set_${type}`] = function (
        block: Blockly.Block
    ) {
      console.log("New block:", block);
        const varName = block.getFieldValue("NAME");
        const value = block.getFieldValue(`${type.toUpperCase()}_VAL`);
        return `${varName} = ${value};\n`;
    };

    solidityGenerator.forBlock[`solidity_get_${type}`] = function (
        block: Blockly.Block
    ) {
        const varName = block.getFieldValue("VAR");
        return [varName, Order.ATOMIC];
    };
});

solidityGenerator.forBlock["emit_event"] = function (block){
  //block: Blockly.Block,
  //generator: Blockly.Generator
//): string {
  const variableName = block.getFieldValue("VAR");
  const event = getSolidityEvent(variableName);
  const params = block.getFieldValue("PARAMS");
  const code = event
    ? `emit ${event.name}(${params});\n`
    : "// emit event (undefined)\n";
  return code;
};


solidityGenerator.forBlock["getter_mappings"] = function(
  block: Blockly.Block
): string {
  const variableName = block.getFieldValue("VAR");
  const myVar = getSolidityMapping(variableName);

  if (!myVar) {
    throw new Error(`Mapping '${variableName}' non trovato in solidityMappings.`);
  }

  const param1 = block.getFieldValue("PARAMS1") || "";
  const param2 = block.getFieldValue("PARAMS2") || "";

  const code = `${myVar.name}[${param1}] = ${param2};\n`;

  return code;
};

solidityGenerator.forBlock["new_struct_value"] = function (
  block: Blockly.Block
): string {
  const variableName = block.getFieldValue("VAR");
  const myVar = getSolidityStruct(variableName);

  if (!myVar || !myVar.name || !structRegistry[myVar.name]) {
    console.warn(
      "❌ Struct non trovato o non definito:",
      variableName,
      myVar
    );
    return `/* Errore: struct ${variableName} non trovato */\n`;
  }

  const attribute = block.getFieldValue("ATTRIBUTE");
  const value = block.getFieldValue("VALUE");

  const attributes = structRegistry[myVar.name];
  const selectedAttr = attributes.find((attr) => attr.name === attribute);

  if (!selectedAttr) {
    console.warn(
      "❌ Attributo non trovato nello struct:",
      attribute,
      "in",
      attributes
    );
    return `/* Errore: attributo ${attribute} non trovato nello struct ${myVar.name} */\n`;
  }

  const needsQuotes =
    selectedAttr.type === "string" || selectedAttr.type === "address";

  const code = `${myVar.name}.${attribute} = ${needsQuotes ? `"${value}"` : value};\n`;
  return code;
};

solidityGenerator.forBlock["structs_array"] = function (
  block: Blockly.Block
): string {
  const variableName = block.getFieldValue("VAR");
  const variableNameArray = block.getFieldValue("NAME");
  const type3 = block.getFieldValue("TYPE3");

  const myVar = getSolidityStruct(variableName);

  if (!myVar) {
    console.warn(`❌ Struct '${variableName}' non trovato.`);
    return `/* Errore: struct '${variableName}' non trovato */\n`;
  }

  const typesMap: Record<string, string> = {
    TYPE_PUBLIC: "public",
    TYPE_PRIVATE: "private",
    TYPE_INTERNAL: "internal",
    TYPE_EXTERNAL: "external"
  };

  const visibility = typesMap[type3] || "public";

  const code = `${myVar.name}[] ${visibility} ${variableNameArray};\n`;
  return code;
};

solidityGenerator.forBlock["struct_push"] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
): string {
  const arrayName = block.getFieldValue("VAR") || "";
  const inputBlock = block.getInputTargetBlock("PARAMS1");

  const pushParam =
    generator.valueToCode(block, "PARAMS1", Order.ATOMIC) || "";

  const isNewStruct = inputBlock && inputBlock.type === "new_struct";

  const code = isNewStruct
    ? `${arrayName}.push${pushParam};\n`
    : `${arrayName}.push(${pushParam});\n`;

  return code;
};

solidityGenerator.forBlock["new_struct"] = function (
  block: Blockly.Block
): [string, number] {
  const variableName = block.getFieldValue("VAR");
  const myVar = getSolidityStruct(variableName);

  if (!myVar || !myVar.name || !structRegistry[myVar.name]) {
    console.warn("❌ Errore: struct non trovata:", myVar);
    return [`/* struct ${variableName} non trovata */`, Order.ATOMIC];
  }

  const attributes = structRegistry[myVar.name];
  const values = block.data ? JSON.parse(block.data).values || {} : {};

  // 🔹 Genera la stringa degli attributi per la sintassi { key: value }
  const attributeString = attributes
    .map((attr) => {
      const value = values[attr.name];
      const needsQuotes = attr.type === "string" || attr.type === "address";

      if (value !== undefined && value !== null) {
        return `${attr.name}: ${needsQuotes ? `"${value}"` : value}`;
      } else {
        return `${attr.name}: ${
          needsQuotes ? `"/* ${attr.type} */"` : `/* ${attr.type} */`
        }`;
      }
    })
    .join(",\n ");

  // 🔹 Genera la stringa dei valori per la sintassi (..., ...)
  const attributeValue = attributes
    .map((attr) => {
      const value = values[attr.name];
      const needsQuotes = attr.type === "string" || attr.type === "address";

      if (value !== undefined && value !== null) {
        return `${needsQuotes ? `"${value}"` : value}`;
      } else {
        return `${
          needsQuotes
            ? `"/* yourValue_${attr.type} */"`
            : `/* yourValue_${attr.type} */`
        }`;
      }
    })
    .join(", ");

  // 🔹 Verifica se il blocco è figlio di struct_push o assign_values_to_struct
  const parent = block.getParent();
  const inPush =
    parent &&
    (parent.type === "struct_push" || parent.type === "assign_values_to_struct");

  const code = inPush
    ? `${myVar.name}({\n ${attributeString}\n})`
    : `${myVar.name}(${attributeValue})`;

  return [code, Order.ASSIGNMENT];
};

solidityGenerator.forBlock["array_pop"] = function (
  block: Blockly.Block
): string {
  const variableName = block.getFieldValue("VAR");
  const myVar = getSolidityArray(variableName);

  if (!myVar || !myVar.name) {
    console.warn(`❌ Errore: array '${variableName}' non trovato.`);
    return `/* Errore: array '${variableName}' non trovato */\n`;
  }

  const code = `${myVar.name}.pop();\n`;
  return code;
};

solidityGenerator.forBlock["array_push"] = function (
  block: Blockly.Block
): string {
  const variableName = block.getFieldValue("VAR");
  const myVar = getSolidityArray(variableName);

  if (!myVar || !myVar.name) {
    console.warn(`❌ Errore: array '${variableName}' non trovato.`);
    return `/* Errore: array '${variableName}' non trovato */\n`;
  }

  const pushParam = block.getFieldValue("PARAMS1") || "0";

  const code = `${myVar.name}.push(${pushParam});\n`;
  return code;
};

solidityGenerator.forBlock["array_push_S_A_B"] = function (
  block: Blockly.Block
): string {
  const variableName = block.getFieldValue("VAR");
  const myVar = getSolidityArray(variableName);

  if (!myVar || !myVar.name) {
    console.warn(`❌ Errore: array '${variableName}' non trovato.`);
    return `/* Errore: array '${variableName}' non trovato */\n`;
  }

  const pushParam = block.getFieldValue("PARAMS1") || "";

  const code = `${myVar.name}.push("${pushParam}");\n`;
  return code;
};

solidityGenerator.forBlock["array_delete"] = function (
  block: Blockly.Block
): string {
  const variableName = block.getFieldValue("VAR");
  const myVar = getSolidityArray(variableName);

  if (!myVar || !myVar.name) {
    console.warn(`❌ Errore: array '${variableName}' non trovato.`);
    return `/* Errore: array '${variableName}' non trovato */\n`;
  }

  const index = block.getFieldValue("PARAMS1") || "0";

  const code = `delete ${myVar.name}[${index}];\n`;
  return code;
};

solidityGenerator.forBlock["variables_get_modifiers"] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
): string {
  const variableName = block.getFieldValue("VAR");
  const myVar = getSolidityModifier(variableName);

  if (!myVar || !myVar.name) {
    console.warn(`❌ Errore: modifier '${variableName}' non trovato.`);
    return `/* Errore: modifier '${variableName}' non trovato */\n`;
  }

  const params = generator.statementToCode(block, "PARAMS");
  const parentBlock = block.getParent();

  if (parentBlock && (parentBlock.type === "method" || parentBlock.type === "variables_get_modifiers")) {
    const code = `${myVar.name}(${params}) `;
    return code;
  }

  return "";
};








// # import block code generator
solidityGenerator.forBlock["import"] = function (block) {
    const imp1 = block.getFieldValue("Imp1");
    const imp2 = block.getFieldValue("Imp2");
    return "import {" + imp1 + '} from "' + imp2 + '";\n';
};

// # Code generator for structure
solidityGenerator.forBlock["structure"] = function (block, generator) {
    const imports = generator.statementToCode(block, "IMPORT");
    const pragma = block.getFieldValue("PRAGMA");
    const contract = generator.statementToCode(block, "CONTRACT");
    const code =
        "pragma solidity " +
        pragma +
        ";\n\n" +
        imports +
        " \n" +
        contract +
        " \n";

    return code;
};

// # Code generator for contract
solidityGenerator.forBlock["contract"] = function (block, generator) {
    const variables = generator.statementToCode(block, "VARIABLES") || "";
    const structures = generator.statementToCode(block, "STRUCTS");
    const mappings = generator.statementToCode(block, "MAPPINGS");
    const events = generator.statementToCode(block, "EVENTS");
    const arrays = generator.statementToCode(block, "ARRAYS");
    const constructor = generator.statementToCode(block, "CONSTRUCTOR");
    const modifiers = generator.statementToCode(block, "MODIFIERS");
    const is_ = block.getFieldValue("IS");
    //const imports = generator.statementToCode(block, 'IMPORT');
    //const ctor = generator.statementToCode(block, 'CTOR');

    const methods = generator.statementToCode(block, "METHODS");
    const code = //'pragma solidity ^0.8.2;\n\n'
        //+ imports + ' \n'
        "contract " +
        block.getFieldValue("NAME") +
        " is " +
        is_ +
        " {\n" + //credo che posso usare il 'getFieldValue' come proprietà del blocco
        variables + //states
        structures +
        mappings +
        events +
        arrays +
        constructor +
        modifiers +
        methods +
        "}\n";

    return code;
};

// # Code generator for array
solidityGenerator.forBlock["array"] = function (block) {
    const name = block.getFieldValue("NAME");
    //addArray(name);
    const solidityType = block.getFieldValue(
        "TYPE1"
    ) as keyof typeof SOLIDITY_TYPES;
    //addArray(name, type1);
    const visibility = block.getFieldValue(
        "TYPE3"
    ) as keyof typeof ACCESS_MODIFIERS;
    const code =
        SOLIDITY_TYPES[solidityType] +
        " " +
        ACCESS_MODIFIERS[visibility] +
        " " +
        name +
        ";\n";
    return code;
};

//  # Code generation for mapping
solidityGenerator.forBlock["mapping"] = function (block) {
    const name = block.getFieldValue("NAME");
    const solidityVar1 = block.getFieldValue(
        "TYPE1"
    ) as keyof typeof SOLIDITY_TYPES;
    const solidityVar2 = block.getFieldValue(
        "TYPE2"
    ) as keyof typeof SOLIDITY_TYPES;
    const visibility = block.getFieldValue(
        "TYPE3"
    ) as keyof typeof ACCESS_MODIFIERS;
    const code =
        "mapping(" +
        SOLIDITY_TYPES[solidityVar1] +
        "=>" +
        SOLIDITY_TYPES[solidityVar2] +
        ") " +
        ACCESS_MODIFIERS[visibility] +
        " " +
        name +
        ";\n";
    return code;
};

// # Code generator for event
solidityGenerator.forBlock["event"] = function (block, generator) {
    const params = generator.statementToCode(block, "PARAMS");
    const name = block.getFieldValue("NAME");
    //addEvent(name); --> funziona, aggiorna l'array, ma ho poi introdotto l'aggiornamento con il listener perchè in questo modo andava a inserire nel Ddown ogni singola nuovca lettera;
    const code = "event " + name + "(" + params + ");\n";
    return code;
};

// # Code generator for function input
solidityGenerator.forBlock["func_inputs"] = function (block) {
    const name = block.getFieldValue("NAME");
    const type = block.getFieldValue("TYPE") as keyof typeof SOLIDITY_TYPES;

    const nextBlock = block.getNextBlock();
    let parentBlock = block.getParent();

    // Walk up the chain until we find the true parent of type 'variables_get_modifieri'
    while (parentBlock) {
        if (parentBlock.type === "variables_get_modifiers") {
            break;
        }
        parentBlock = parentBlock.getParent();
    }

    let code;
    if (parentBlock && parentBlock.type === "variables_get_modifiers") {
        const sep = nextBlock && nextBlock.type == block.type ? ", " : "";
        code = name + sep;
    } else {
        const sep = nextBlock && nextBlock.type == block.type ? ", " : "";
        code = SOLIDITY_TYPES[type] + " " + name + sep;
    }
    return code;
};

// # Code generator for function return type
solidityGenerator.forBlock["function_return"] = function (block) {
    const type = block.getFieldValue("TYPE") as keyof typeof SOLIDITY_TYPES;
    const name = block.getFieldValue("NAME");
    const nextBlock = block.getNextBlock();

    const sep = nextBlock && nextBlock.type == block.type ? ", " : "";
    const code = SOLIDITY_TYPES[type] + " " + name + sep;
    return code;
};

// # Code generator for contract state
solidityGenerator.forBlock["state"] = function (block) {
    const name = block.getFieldValue("NAME");
    let value = block.getFieldValue("VALUE");
    const type = block.getFieldValue("TYPE") as keyof typeof SOLIDITY_TYPES;

    const defaultValue = {
        TYPE_BOOL: "false",
        TYPE_INT: "0",
        TYPE_UINT: "0",
        TYPE_UINT256: "0",
        TYPE_UINT8: "0",
        TYPE_STRING: '""',
        TYPE_ADDRESS: "address(0)",
        TYPE_BYTES32: "0x0",
        TYPE_BYTES: "0x0",
    };

    if (value === "") {
        value = defaultValue[type];
    }

    return SOLIDITY_TYPES[type] + " " + name + " = " + value + ";\n";
};

// # Code generator for contract structures
solidityGenerator.forBlock["contract_structures"] = function (block) {
    const name = block.getFieldValue("NAME");
    const firstFieldBlock = block.getInputTargetBlock("STATES");

    let code = "";
    let current = firstFieldBlock;
    while (current) {
        const type = current.getFieldValue(
            "TYPE"
        ) as keyof typeof SOLIDITY_TYPES;
        const varName = current.getFieldValue("NAME");
        code += `  ${SOLIDITY_TYPES[type]} ${varName};\n`;
        current = current.getNextBlock();
    }

    return `struct ${name} {\n${code}}\n`;
};

// # Code generator for struct variables
solidityGenerator.forBlock["struct_variables"] = function (block) {
    const name = block.getFieldValue("NAME");
    const type = block.getFieldValue("TYPE") as keyof typeof SOLIDITY_TYPES;
    return SOLIDITY_TYPES[type] + " " + name + ";\n";
};

// # Code generator for contract variables
solidityGenerator.forBlock["variables"] = function (block) {
    const name = block.getFieldValue("NAME");
    const type = block.getFieldValue("TYPE") as keyof typeof SOLIDITY_TYPES;
    const accessType = block.getFieldValue(
        "TYPE3"
    ) as keyof typeof ACCESS_MODIFIERS;

    return (
        SOLIDITY_TYPES[type] +
        " " +
        ACCESS_MODIFIERS[accessType] +
        " " +
        name +
        ";\n"
    );
};

// # Code generator for unknown code
solidityGenerator.forBlock["unknown_code"] = function (block) {
    const code = block.getFieldValue("CODE");
    return code + "\n";
};

// # Code generator for internal function
solidityGenerator.forBlock["internal_function"] = function (block) {
    const text = block.getFieldValue("CODE");
    return "" + text + "\n";
};

// # Code generator for internal assignment
solidityGenerator.forBlock["internalAss"] = function (block) {
    const text = block.getFieldValue("CODE");
    return "" + text + "\n";
};

// # Code generator for local variables
solidityGenerator.forBlock["localVariable"] = function (block) {
    const text = block.getFieldValue("CODE");
    return "" + text + "\n";
};

// # Code generator for contract constructor
solidityGenerator.forBlock["contract_constructor"] = function (
    block,
    generator
) {
    const params = generator.statementToCode(block, "PARAMS").trim() || "";
    const branch = generator.statementToCode(block, "STACK").trim() || "";
    const modifiers = block.getFieldValue("MODIFIERS");
    console.log("Branch code inside constructor:", branch);
    const code =
        "constructor " +
        "(" +
        params +
        ") " +
        modifiers +
        " {\n" +
        branch +
        "}\n";

    return code;
};

// # Code generator for modifier
solidityGenerator.forBlock["modifier"] = function (block, generator) {
    const name = block.getFieldValue("NAME");
    const params = generator.statementToCode(block, "PARAMS").trim() || "";
    const branch = generator.statementToCode(block, "STACK").trim() || "";
    const code =
        "modifier " +
        name +
        "(" +
        params +
        ") {\n" +
        "require(" +
        branch +
        ");\n" +
        "_;\n" +
        "}\n";

    return code;
};

// # Code generator for require condition
solidityGenerator.forBlock["require"] = function (
    block: Blockly.Block,
    generator: Blockly.Generator
) {
    const operator = block.getFieldValue("OPERATOR");
    const leftOperand =
        generator.valueToCode(block, "LEFT", Order.ATOMIC) || "false";
    const rightOperand =
        generator.valueToCode(block, "RIGHT", Order.ATOMIC) || "false";

    let code = "";

    if (operator === "NOT") {
        code = "! " + leftOperand;
    } else if (operator in REQUIRE_OPERATORS && operator !== "NOT") {
        const operatorSymbol =
            REQUIRE_OPERATORS[operator as keyof typeof REQUIRE_OPERATORS];
        code = leftOperand + " " + operatorSymbol + " " + rightOperand;
    }

    return [code, Order.ATOMIC];
};

// Require statement generator
solidityGenerator.forBlock["require_statement"] = function (
    block: Blockly.Block,
    generator: Blockly.Generator
) {
    const condition =
        generator.valueToCode(block, "CONDITION", Order.ATOMIC) || "false";
    const message = block.getFieldValue("MESSAGE") || "Error";
    const code = "require(" + condition + ', "' + message + '");\n';
    return code;
};


// # Solidity code generator for require condition inside the modifier
solidityGenerator.forBlock["require_condition"] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
): [string, number] {
  const operator = block.getFieldValue("OPERATOR");
  const leftOperand = generator.valueToCode(block, "LEFT", Order.ATOMIC) || "false";
  const rightOperand = generator.valueToCode(block, "RIGHT", Order.ATOMIC) || "false";

  let code: string;

  switch (operator) {
    case "NOT":
      code = `!${leftOperand}`;
      break;
    case "NOT_EQUAL":
      code = `${leftOperand} != ${rightOperand}`;
      break;
    case "EQUAL":
      code = `${leftOperand} == ${rightOperand}`;
      break;
    case "BIGGER OR EQUAL TO":
      code = `${leftOperand} >= ${rightOperand}`;
      break;
    case "LOWER OR EQUAL TO":
      code = `${leftOperand} <= ${rightOperand}`;
      break;
    case "BIGGER THAN":
      code = `${leftOperand} > ${rightOperand}`;
      break;
    case "LOWER THAN":
      code = `${leftOperand} < ${rightOperand}`;
      break;
    default:
      code = "false"; // fallback di sicurezza
  }

  return [code, Order.ATOMIC];
};

// # Solidity code generator for require condition 
solidityGenerator.forBlock["require_condition_method1"] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
): string {
  const message = block.getFieldValue("MESSAGE");
  const condition = generator.valueToCode(block, "CONDITION", Order.ATOMIC) || "false";

  const code = `require(${condition}, "${message}");\n`;
  return code;
};



// Import block generator (from your example)
solidityGenerator.forBlock["import"] = function (block: Blockly.Block) {
    const imp1 = block.getFieldValue("Imp1");
    const imp2 = block.getFieldValue("Imp2");
    return "import {" + imp1 + '} from "' + imp2 + '";\n';
};

// Modifier block generator
solidityGenerator.forBlock["modifier1"] = function (
    block: Blockly.Block,
    generator: Blockly.Generator
) {
    const name = block.getFieldValue("NAME");
    const message = block.getFieldValue("MESSAGE");
    const params = generator.statementToCode(block, "PARAMS").trim();
    const condition =
        generator.valueToCode(block, "CONDITION", Order.ATOMIC) || "false";

    const code =
        "modifier " +
        name +
        "( " +
        params +
        ") {\n" +
        "require(" +
        condition +
        ', "' +
        message +
        '");\n' +
        "_;\n" +
        "}\n";

    return code;
};

// If statement generator
solidityGenerator.forBlock["if"] = function (
    block: Blockly.Block,
    generator: Blockly.Generator
) {
    const condition =
        generator.valueToCode(block, "IF", Order.ATOMIC) || "false";
    const branch = generator.statementToCode(block, "DO");
    const code = "if " + condition + " {\n" + branch + "}";
    return code;
};

// Else if statement generator
solidityGenerator.forBlock["else_if"] = function (
    block: Blockly.Block,
    generator: Blockly.Generator
) {
    const condition =
        generator.valueToCode(block, "ELSE_IF", Order.ATOMIC) || "false";
    const branch = generator.statementToCode(block, "DO");
    const code = "else if " + condition + " {\n" + branch + "}";
    return code;
};

// Else statement generator
solidityGenerator.forBlock["else"] = function (
    block: Blockly.Block,
    generator: Blockly.Generator
) {
    const branch = generator.statementToCode(block, "DO");
    const code = "else {\n" + branch + "}";
    return code;
};

// If container generator
solidityGenerator.forBlock["if_container"] = function (
    block: Blockly.Block,
    generator: Blockly.Generator
) {
    const ifCondition = generator.statementToCode(block, "IF");
    const elseIfCondition = generator.statementToCode(block, "ELSE_IF");
    const elseStatement = generator.statementToCode(block, "ELSE");
    let code = ifCondition;

    if (elseIfCondition) {
        code += elseIfCondition;
    }

    if (elseStatement) {
        code += elseStatement;
    }

    return code;
};

// If-else container generator
solidityGenerator.forBlock["if_else_container"] = function (
    block: Blockly.Block,
    generator: Blockly.Generator
) {
    const ifCondition = generator.statementToCode(block, "IF");
    const elseStatement = generator.statementToCode(block, "ELSE");
    let code = ifCondition;

    if (elseStatement) {
        code += elseStatement;
    }

    return code;
};

// If-elseif-else container generator
solidityGenerator.forBlock["if_elseif_else_container"] = function (
    block: Blockly.Block,
    generator: Blockly.Generator
) {
    const ifCondition = generator.statementToCode(block, "IF");
    const elseIfCondition = generator.statementToCode(block, "ELSE_IF");
    const elseStatement = generator.statementToCode(block, "ELSE");
    let code = ifCondition;

    if (elseIfCondition) {
        code += elseIfCondition;
    }

    if (elseStatement) {
        code += elseStatement;
    }

    return code;
};

// Method/Function generator
solidityGenerator.forBlock["method"] = function (
    block: Blockly.Block,
    generator: Blockly.Generator
) {
    const name = block.getFieldValue("NAME");
    const access = block.getFieldValue("ACCESS");
    // const type = block.getFieldValue("TYPE");
    const view = block.getFieldValue("VIEW");
    const pure = block.getFieldValue("PURE");
    const payable = block.getFieldValue("PAYABLE");
    const return_ = block.getFieldValue("RETURN");
    const override = block.getFieldValue("OVERRIDE");

    const params = generator.statementToCode(block, "PARAMS").trim();
    const values = generator.statementToCode(block, "RETURN_VALUES").trim();
    const modifiers =
        generator.valueToCode(block, "MODIFIERS", Order.ASSIGNMENT) || "";
    const branch = generator.statementToCode(block, "STACK");
    const require = generator.statementToCode(block, "REQUIRE").trim() || "";

    const accessValue =
        ACCESS_MODIFIERS[access as keyof typeof ACCESS_MODIFIERS];
    const returnValue = RETURN_TYPES[return_ as keyof typeof RETURN_TYPES];
    const viewValue = VIEW_TYPES[view as keyof typeof VIEW_TYPES];
    const pureValue = PURE_TYPES[pure as keyof typeof PURE_TYPES];
    const payableValue = PAYABLE_TYPES[payable as keyof typeof PAYABLE_TYPES];

    let code =
        "function " +
        name +
        "( " +
        params +
        ")" +
        " " +
        accessValue +
        " " +
        payableValue +
        " " +
        viewValue +
        " " +
        pureValue +
        " " +
        modifiers +
        " " +
        returnValue;

    // Add the return type only if there is a return value
    if (returnValue === "returns") {
        code += " ( " + values + " )";
    }

    // Handle override
    if (override) {
        code =
            "function " +
            name +
            "( " +
            params +
            ")" +
            " " +
            accessValue +
            " " +
            payableValue +
            " " +
            viewValue +
            " " +
            pureValue +
            " override(" +
            override +
            ")" +
            " " +
            modifiers +
            " " +
            returnValue;
        if (returnValue === "returns") {
            code += " ( " + values + " )";
        }
    }

    // Add function body
    if (require) {
        code += " {\n" + require + "\n" + branch + "\n" + "}\n";
    } else {
        code += " {\n" + branch + "\n" + "}\n";
    }

    return code;
};

// Variable definition generator
solidityGenerator.forBlock["define_variable"] = function (
    block: Blockly.Block,
    generator: Blockly.Generator
) {
    const value =
        generator.valueToCode(block, "VALUE", Order.ASSIGNMENT) || "null";
    return value + ";\n";
};

// Variable definition with assignment generator
solidityGenerator.forBlock["define_variable_with_assignment"] = function (
    block: Blockly.Block,
    generator: Blockly.Generator
) {
    const value =
        generator.valueToCode(block, "VALUE", Order.ASSIGNMENT) || "null";
    const assigned_value = block.getFieldValue("ASSIGNED_VALUE") || "";

    console.log("VALUE:", value, "ASSIGNED_VALUE:", assigned_value);

    if (assigned_value.trim() !== "") {
        return value + " = " + assigned_value + ";\n";
    } else {
        return "";
    }
};

// Struct variable definition with assignment generator
solidityGenerator.forBlock["define_struct_variable_with_assignment"] =
    function (block: Blockly.Block, generator: Blockly.Generator) {
        const assigned_struct =
            generator.valueToCode(block, "ASSIGNED_STRUCT", Order.ASSIGNMENT) ||
            "null";
        const structName = block.getFieldValue("NAME") || "";
        const type_struct = block.getFieldValue("TYPE") || "";

        console.log("NAME:", structName, "ASSIGNED_STRUCT:", assigned_struct);

        if (assigned_struct.trim() !== "") {
            return (
                type_struct + " " + structName + " = " + assigned_struct + ";\n"
            );
        } else {
            return "";
        }
    };

// Array variable definition generator
solidityGenerator.forBlock["define_arrayVariable"] = function (
    block: Blockly.Block
) {
    const arrayName = block.getFieldValue("NAME") || "";
    const type_array = block.getFieldValue("TYPE") || "";
    const type_array1 = block.getFieldValue("TYPE1") || "";
    const values = block.getFieldValue("VALUES") || "";

    console.log("ARRAY VARIABLE: ", arrayName, type_array, type_array1, values);
    return (
        type_array +
        "[] " +
        arrayName +
        " = new " +
        type_array1 +
        "[]( " +
        values +
        " );\n"
    );
};

// Assign values to variable array generator
solidityGenerator.forBlock["assign_values_to_variable_array"] = function (
    block: Blockly.Block
) {
    const arrayName = block.getFieldValue("NAME");
    const type_array = block.getFieldValue("TYPE1");
    const type_access = block.getFieldValue("TYPE3");
    const values = block.getFieldValue("VALUES") || "";

    const typeValue = ARRAY_TYPES[type_array as keyof typeof ARRAY_TYPES];
    const accessValue =
        ACCESS_MODIFIERS[type_access as keyof typeof ACCESS_MODIFIERS];

    return (
        typeValue +
        " " +
        accessValue +
        " " +
        arrayName +
        " = " +
        "[ " +
        values +
        " ];\n"
    );
};

solidityGenerator.forBlock["array_values"] = function (
  block: Blockly.Block
): string {
  const variableName = block.getFieldValue("VAR");
  const myVar = getSolidityArray(variableName);

  if (!myVar || !myVar.name) {
    console.warn(`❌ Errore: array '${variableName}' non trovato.`);
    return `/* Errore: array '${variableName}' non trovato */\n`;
  }

  const index = block.getFieldValue("PARAMS1") || "0";
  const param2 = block.getFieldValue("PARAMS2") || "0";

  const code = `${myVar.name}[${index}] = ${param2};\n`;
  return code;
};


// String variable definition with assignment generator
solidityGenerator.forBlock["define_variable_with_assignment1"] = function (
    block: Blockly.Block,
    generator: Blockly.Generator
) {
    const value =
        generator.valueToCode(block, "VALUE", Order.ASSIGNMENT) || "null";
    const assigned_value = block.getFieldValue("ASSIGNED_VALUE") || "";

    console.log("VALUE:", value, "ASSIGNED_VALUE:", assigned_value);

    if (assigned_value.trim() !== "") {
        return value + " = " + " '" + assigned_value + "';\n";
    } else {
        return "";
    }
};

// Input generators
solidityGenerator.forBlock["input"] = function (block: Blockly.Block) {
    const textValue = block.getFieldValue("input_name");
    return [textValue, 0];
};

solidityGenerator.forBlock["input_right"] = function (block: Blockly.Block) {
    const textValue = block.getFieldValue("input_name");
    return [textValue, 0];
};

// Return block generator
solidityGenerator.forBlock["return_block"] = function (block: Blockly.Block) {
    const textValue = block.getFieldValue("input_name");
    return "return " + textValue + ";\n";
};

// Mathematical operation generators
solidityGenerator.forBlock["input_somma"] = function (block: Blockly.Block) {
    const textValue = block.getFieldValue("input_name");
    const value = block.getFieldValue("input_increment");
    const code = textValue + "+ " + value;
    return [code, 0];
};

solidityGenerator.forBlock["input_diff"] = function (block: Blockly.Block) {
    const textValue = block.getFieldValue("input_name");
    const value = block.getFieldValue("input_decrement");
    const code = textValue + "- " + value;
    return [code, 0];
};

// Address-related generators
solidityGenerator.forBlock["address_zero"] = function () {
    const code = "address(0)";
    return [code, Order.ATOMIC];
};

solidityGenerator.forBlock["address_this"] = function () {
    const code = "address(this)";
    return [code, Order.ATOMIC];
};

solidityGenerator.forBlock["address_this_balance"] = function () {
    const code = "address(this).balance";
    return [code, Order.ATOMIC];
};

// # Code generator for ERC20 template
solidityGenerator.forBlock["erc20"] = function (block) {
    const name = block.getFieldValue("NAME");
    const mintable = block.getFieldValue("Mintable");
    const burnable = block.getFieldValue("Burnable");
    const pausable = block.getFieldValue("Pausable");
    const callback = block.getFieldValue("Callback");
    const permit = block.getFieldValue("Permit");
    const flash_Minting = block.getFieldValue("Flash_Minting");
    const imports = [];

    // Import base
    imports.push(
        'import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";'
    );

    // Condizionali
    if (mintable === "TYPE_YES") {
        imports.push(
            'import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";'
        );
    }

    if (burnable === "TYPE_YES") {
        imports.push(
            'import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";'
        );
    }

    if (permit === "TYPE_YES") {
        imports.push(
            'import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";'
        );
    }

    if (pausable === "TYPE_YES") {
        if (mintable === "TYPE_NOT") {
            imports.push(
                'import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";\n import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";'
            );
        } else {
            imports.push(
                'import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";'
            );
        }
    }

    if (flash_Minting === "TYPE_YES") {
        imports.push(
            'import {ERC20FlashMint} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";'
        );
    }

    if (callback === "TYPE_YES") {
        imports.push(
            'import {ERC1363} from "@openzeppelin/contracts/token/ERC20/extensions/ERC1363.sol";'
        );
    }

    let constructor = "";
    if (mintable === "TYPE_YES" || pausable === "TYPE_YES") {
        constructor =
            'constructor(address initialOwner)\n ERC20("MyToken", "MTK")\n ERC20Permit("MyToken")\n Ownable(initialOwner)\n  {}\n';
    } else {
        constructor =
            'constructor() ERC20("MyToken", "MTK") ERC20Permit("MyToken") {}';
    }

    const methods = [];
    if (mintable === "TYPE_YES") {
        methods.push(
            "function mint(address to, uint256 amount) public onlyOwner {\n _mint(to, amount);\n}\n\n"
        );
    }
    if (pausable === "TYPE_YES") {
        methods.push(
            "function pause() public onlyOwner{\n _pause();\n }\n\n function unpause() public onlyOwner {\n _unpause();\n }\n\n function _update(address from, address to, uint256 value)\n internal\n override(ERC20, ERC20Pausable)\n {\n super._update(from, to, value);\n}\n\n"
        );
    }

    const contract_is = [];
    contract_is.push("is ERC20, ERC20Permit");
    if (mintable === "TYPE_NOT") {
        contract_is.push("Ownable");
    }
    if (pausable === "TYPE_YES") {
        if (mintable === "TYPE_NOT") {
            contract_is.push("ERC20Pausable, Ownable");
        } else {
            contract_is.push("ERC20Pausable");
        }
    }
    if (burnable === "TYPE_YES") {
        contract_is.push("ERC20Burnable");
    }
    /*if (permit === 'TYPE_YES') {
    contract_is.push('ERC20Pausable');
  }*/
    if (flash_Minting === "TYPE_YES") {
        contract_is.push("ERC20FlashMint");
    }
    if (callback === "TYPE_YES") {
        contract_is.push("ERC1363");
    }

    // Generazione finale del codice
    const code = `pragma solidity ^0.8.27;\n\n${imports.join(
        "\n"
    )}\n\n contract ${name} ${contract_is.join(
        ", "
    )} {\n\n ${constructor}\n ${methods.join("\n")}\n}`;
    return code;
};

// # Code generator for Governor template
solidityGenerator.forBlock["Governor"] = function (block, generator) {
    const name = block.getFieldValue("NAME");
    const delay = block.getFieldValue("voting_delay");
    const voting_period = block.getFieldValue("voting_period");
    const quorum = block.getFieldValue("quorum");
    const methods = generator.statementToCode(block, "METHODS");
    const proposal_threshold = block.getFieldValue("proposal_threshold");

    const imports =
        'import {Governor} from "@openzeppelin/contracts/governance/Governor.sol";\n' +
        'import {GovernorCountingSimple} from "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";\n' +
        'import {GovernorSettings} from "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";\n' +
        'import {GovernorTimelockControl} from "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";\n' +
        'import {GovernorVotes} from "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";\n' +
        'import {GovernorVotesQuorumFraction} from "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";\n' +
        'import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";\n' +
        'import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";\n';

    const internalMthod1 =
        "function _queueOperations(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)\n" +
        "internal\n" +
        "override(Governor, GovernorTimelockControl)\n" +
        "returns (uint48)\n" +
        "{\n" +
        "return super._queueOperations(proposalId, targets, values, calldatas, descriptionHash);\n" +
        "}\n";

    const internalMethod2 =
        "function _executeOperations(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)\n" +
        "internal\n" +
        "override(Governor, GovernorTimelockControl)\n" +
        "{\n" +
        "return super._executeOperations(proposalId, targets, values, calldatas, descriptionHash);\n" +
        "}\n";

    const internalMethod3 =
        "function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)\n" +
        "internal\n" +
        "override(Governor, GovernorTimelockControl)\n" +
        "returns (uint256)\n" +
        "{\n" +
        "return super._cancel(targets, values, calldatas, descriptionHash);\n" +
        "}\n";

    const internalMethod4 =
        "function _executor()\n" +
        "internal\n" +
        "view" +
        "override(Governor, GovernorTimelockControl)\n" +
        "returns (address)\n" +
        "{\n" +
        "return super._executor();\n" +
        "}\n";

    const code =
        "pragma solidity ^0.8.27;\n\n" +
        imports +
        "\n\n" +
        "contract" +
        name +
        "is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction, GovernorTimelockControl" +
        " {\n\n" +
        "constructor(IVotes _token, TimelockController _timelock)\n" +
        'Governor(" ' +
        name +
        ' ")\n' +
        "GovernorSettings(" +
        delay +
        ", " +
        voting_period +
        ", " +
        proposal_threshold +
        ")\n" /*7200 /* 1 day */ /*, 50400 /* 1 week */ /*, 0)'*/ +
        "GovernorVotes(_token)\n" +
        "GovernorVotesQuorumFraction( " +
        quorum +
        ")\n" +
        "GovernorTimelockControl(_timelock)\n" +
        "{}\n\n" +
        methods +
        "\n\n" +
        internalMthod1 +
        "\n\n" +
        internalMethod2 +
        "\n\n" +
        internalMethod3 +
        "\n\n" +
        internalMethod4 +
        "\n\n" +
        "}\n";

    return code;
};

solidityGenerator.forBlock["state"] = function () {
    const code =
        "function state(uint256 proposalId)\n" +
        "public\n" +
        "view\n" +
        "override(Governor, GovernorTimelockControl)\n" +
        "returns (ProposalState)\n" +
        "{\n" +
        "return super.state(proposalId);\n" +
        "}\n";
    return code;
};

// # Code generator for proposalNeedsQueuing
solidityGenerator.forBlock["proposalNeedsQueuing"] = function () {
    const code =
        "function proposalNeedsQueuing(uint256 proposalId)\n" +
        "public\n" +
        "view\n" +
        "override(Governor, GovernorTimelockControl)\n" +
        "returns (bool)\n" +
        "{\n" +
        "return super.proposalNeedsQueuing(proposalId);\n" +
        "}\n";
    return code;
};

// # Code generator for proposalThreshold
solidityGenerator.forBlock["proposalThreshold"] = function () {
    const code =
        "function proposalThreshold()\n" +
        "public\n" +
        "view\n" +
        "override(Governor, GovernorTimelockControl)\n" +
        "returns (uint256)\n" +
        "{\n" +
        "return super.proposalThreshold();\n" +
        "}\n";
    return code;
};

//STRING VARIABLES 
// ## variables_get_string
solidityGenerator.forBlock['variables_get_string'] = function(block): [string, number] {
  const variable_name = block.getFieldValue('VAR');
  const myVar = getSolidityStringVariable(variable_name);

  if (!myVar) {
    console.warn(`❌ Variabile stringa '${variable_name}' non trovata.`);
    return [`/* Errore: variabile ${variable_name} non trovata */`, Order.ATOMIC];
  }

  const parentBlock = block.getParent();
  let code: string;

  if (parentBlock) {
    if (parentBlock.type === 'define_variable' || parentBlock.type === 'define_variable_with_assignment1') {
      code = `${myVar.type} ${myVar.access} ${myVar.name}`;
      return [code, Order.FUNCTION_CALL];
    } else if (parentBlock.type === 'variables_set_string' || parentBlock.type === 'require_condition') {
      code = myVar.name;
      return [code, Order.ATOMIC];
    }
  } else {
    code = `get_${myVar.name}() returns (${myVar.type}) {\n  return ${myVar.name};\n}`;
    return [code, Order.ATOMIC];
  }

  // Fallback
  return [myVar.name, Order.ATOMIC];
};

// ## variables set string
solidityGenerator.forBlock['variables_set_string'] = function(block, generator) {
  const variable_name = block.getFieldValue('VAR');
  const value = generator.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || '""';

  const parentBlock = block.getParent();
  let code: string;

  if (!parentBlock) {
    // ⚠️ Fallback generazione setter Solidity
    code = `function set_${variable_name}(string memory _value) public {\n  ${variable_name} = _value;\n}\n`;
  } else {
    // Assegnazione inline
    code = `${variable_name} = ${value};\n`;
  }

  return code;
};

// ## variables_get_string_constants
solidityGenerator.forBlock['variables_get_string_constants'] = function (
  block: Blockly.Block,
  generator: Blockly.Generator
): [string, number] {
  const variable_name = block.getFieldValue('VAR');
  const myVar = getSolidityStringConstantsVariable(variable_name);
  const parentBlock = block.getParent();
  
  if (!myVar) {
    console.warn(`❌ Variabile costante non trovata: ${variable_name}`);
    return [`/* costante ${variable_name} non trovata */`, Order.ATOMIC];
  }

  let code: string;

  if (parentBlock) {
    switch (parentBlock.type) {
      case 'define_variable_with_assignment1':
        code = `${myVar.type} ${myVar.access} constant ${myVar.name}`;
        return [code, Order.FUNCTION_CALL];

      case 'variables_set_string':
      case 'require_condition':
        code = myVar.name;
        return [code, Order.ATOMIC];
    }
  }

  code = `get_${myVar.name}() returns (${myVar.type}) {\n  return ${myVar.name};\n}`;
  return [code, Order.ATOMIC];
};

// ## variables_get_string_immutables
solidityGenerator.forBlock['variables_get_string_immutables'] = function (block: Blockly.Block, generator: any): [string, number] {
  const variableName = block.getFieldValue('VAR');
  const myVar = getSolidityStringImmutablesVariable(variableName);

  const parentBlock = block.getParent();
  let code: string;

  if (myVar) {
    if (parentBlock) {
      if (parentBlock.type === 'define_variable' || parentBlock.type === 'define_variable_with_assignment1') {
        code = `${myVar.type} ${myVar.access} immutable ${myVar.name}`;
        return [code, Order.FUNCTION_CALL]; // Presupponendo che tu abbia definito Order.FUNCTION_CALL
      } else if (parentBlock.type === 'variables_set_string' || parentBlock.type === 'require_condition') {
        code = myVar.name;
        return [code, Order.ATOMIC];
      }
    } else {
      code = `get_${myVar.name}() returns (${myVar.type}){\n  return ${myVar.name};\n}`;
      return [code, Order.ATOMIC];
    }
  }

  // In caso myVar non venga trovato
  code = `/* Variabile immutable non trovata: ${variableName} */`;
  return [code, Order.ATOMIC];
};

// ## variables_get_s
solidityGenerator.forBlock['variables_get_s'] = function (block, generator) {
  const variableName = block.getFieldValue('VAR');
  const myVar = getSolidityStringVariable(variableName);

  if (!myVar) {
    console.warn(`❌ Variabile stringa non trovata: ${variableName}`);
    return `/* Errore: variabile ${variableName} non trovata */\n`;
  }

  const code = `function get_${myVar.name}() public view returns (${myVar.type}) {\n  return ${myVar.name};\n}\n`;
  return code;
};

// UINT VARIABLES
// ## variables_get_uint
solidityGenerator.forBlock['variables_get_uint'] = function (block, generator) {
  const variable_name = block.getFieldValue('VAR');
  const myVar = getSolidityUintVariable(variable_name);
  const parentBlock = block.getParent();
  let code: string;

  if (!myVar) {
    console.warn(`❌ Variabile uint "${variable_name}" non trovata.`);
    return ["/* uint variable not found */", Order.ATOMIC];
  }

  if (parentBlock) {
    if (
      parentBlock.type === 'define_variable' ||
      parentBlock.type === 'define_variable_with_assignment'
    ) {
      code = `${myVar.type} ${myVar.access} ${myVar.name}`;
      return [code, Order.FUNCTION_CALL];
    } else if (
      parentBlock.type === 'variables_set_uint' ||
      parentBlock.type === 'require_condition'
    ) {
      code = myVar.name;
      return [code, Order.ATOMIC];
    }
  } else {
    code = `get_${myVar.name}() returns (${myVar.type}){\n  return ${myVar.name};\n}`;
    return [code, Order.ATOMIC];
  }

  // Fallback di sicurezza
  return [myVar.name, Order.ATOMIC];
};

// ## variables_set_uint
solidityGenerator.forBlock['variables_set_uint'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
): string {
  const variableName: string = block.getFieldValue('VAR');
  const value: string = generator.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || '""';

  const parentBlock = block.getParent();
  let code: string;

  if (!parentBlock) {
    code =
      `function set_${variableName}(${value}) {\n` +
      `  ${variableName} = ${value};\n` +
      `}`;
  } else {
    code = `${variableName} = ${value};\n`;
  }

  return code;
};

// ## variables_get_uint_constants
solidityGenerator.forBlock['variables_get_uint_constants'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
): [string, number] {
  const variableName: string = block.getFieldValue('VAR');
  const myVar = getSolidityUintConstantsVariable(variableName);
  const parentBlock = block.getParent();

  if (!myVar) {
    console.warn("Variabile non trovata:", variableName);
    return [`/* constant ${variableName} not found */`, Order.ATOMIC];
  }

  let code: string;

  if (parentBlock) {
    if (parentBlock.type === 'define_variable_with_assignment') {
      code = `${myVar.type} ${myVar.access} constant ${myVar.name}`;
      return [code, Order.FUNCTION_CALL];
    } else if (
      parentBlock.type === 'variables_set_uint' ||
      parentBlock.type === 'require_condition'
    ) {
      return [myVar.name, Order.ATOMIC];
    }
  }

  code =
    `function get_${myVar.name}() public view returns (${myVar.type}) {\n` +
    `  return ${myVar.name};\n` +
    `}`;
  return [code, Order.ATOMIC];
};

// ## variables_get_uint_immutables
solidityGenerator.forBlock['variables_get_uint_immutables'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
): [string, number] {
  const variableName: string = block.getFieldValue('VAR');
  const myVar = getSolidityUintImmutablesVariable(variableName);
  const parentBlock = block.getParent();

  if (!myVar) {
    console.warn("Variabile immutable non trovata:", variableName);
    return [`/* immutable ${variableName} not found */`, Order.ATOMIC];
  }

  let code: string;

  if (parentBlock) {
    if (parentBlock.type === 'define_variable' || parentBlock.type === 'define_variable_with_assignment') {
      code = `${myVar.type} ${myVar.access} immutable ${myVar.name}`;
      return [code, Order.FUNCTION_CALL];
    } else if (
      parentBlock.type === 'variables_set_uint' ||
      parentBlock.type === 'require_condition'
    ) {
      return [myVar.name, Order.ATOMIC];
    }
  }

  code =
    `function get_${myVar.name}() public view returns (${myVar.type}) {\n` +
    `  return ${myVar.name};\n` +
    `}`;
  return [code, Order.ATOMIC];
};

// ## variables_get_u
solidityGenerator.forBlock['variables_get_u'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
): string {
  const variableName: string = block.getFieldValue('VAR');
  const myVar = getSolidityUintVariable(variableName);

  if (!myVar) {
    console.warn("Variabile uint non trovata:", variableName);
    return `/* Getter for ${variableName} not found */\n`;
  }

  const code =
    `function get_${myVar.name}() public view returns (${myVar.type}) {\n` +
    `  return ${myVar.name};\n` +
    `}\n`;

  return code;
};

// ## variables_get_uint256
solidityGenerator.forBlock['variables_get_uint256'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
): [string, number] {
  const variable_name: string = block.getFieldValue('VAR');
  const myVar = getSolidityUint256Variable(variable_name);

  if (!myVar) {
    console.warn("Variabile uint256 non trovata:", variable_name);
    return [`/* Variable ${variable_name} not found */`, Order.ATOMIC];
  }

  const parentBlock = block.getParent();
  let code: string;

  if (parentBlock) {
    if (parentBlock.type === 'define_variable' || parentBlock.type === 'define_variable_with_assignment') {
      code = `${myVar.type} ${myVar.access} ${myVar.name}`;
      return [code, Order.FUNCTION_CALL];
    } else if (parentBlock.type === 'variables_set_uint256' || parentBlock.type === 'require_condition') {
      code = myVar.name;
      return [code, Order.ATOMIC];
    }
  }

  code =
    `get_${myVar.name}() returns (${myVar.type}) {\n` +
    `  return ${myVar.name};\n` +
    `}`;
  return [code, Order.ATOMIC];
};

// ## variables_set_uint256
solidityGenerator.forBlock['variables_set_uint256'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
): string {
  const variable_name: string = block.getFieldValue('VAR');
  const value: string = generator.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || '""';

  const parentBlock = block.getParent();
  let code: string;

  if (!parentBlock) {
    code =
      `function set_${variable_name}(${value}) public {\n` +
      `  ${variable_name} = ${value};\n` +
      `}`;
  } else {
    code = `${variable_name} = ${value};\n`;
  }

  return code;
};

// ## variables_get_uint256_constants
solidityGenerator.forBlock['variables_get_uint256_constants'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
): [string, number] {
  const variable_name: string = block.getFieldValue('VAR');
  const myVar = getSolidityUint256ConstantsVariable(variable_name);
  const parentBlock = block.getParent();
  let code: string;

  if (!myVar) {
    code = variable_name;
    return [code, Order.ATOMIC];
  }

  if (parentBlock) {
    if (parentBlock.type === 'define_variable_with_assignment') {
      code = `${myVar.type} ${myVar.access} constant ${myVar.name}`;
      return [code, Order.FUNCTION_CALL];
    } else if (
      parentBlock.type === 'variables_set_uint256' ||
      parentBlock.type === 'require_condition'
    ) {
      code = myVar.name;
      return [code, Order.ATOMIC];
    }
  } else {
    code = `get_${myVar.name}() returns (${myVar.type}){\n  return ${myVar.name};\n}`;
    return [code, Order.ATOMIC];
  }

  return [variable_name, Order.ATOMIC]; // fallback
};

// ## variables_get_uint256_immutables
solidityGenerator.forBlock['variables_get_uint256_immutables'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
): [string, number] {
  const variable_name: string = block.getFieldValue('VAR');
  const myVar = getSolidityUint256ImmutablesVariable(variable_name);
  const parentBlock = block.getParent();
  let code: string;

  if (!myVar) {
    code = variable_name; // fallback in caso di variabile non trovata
    return [code, Order.ATOMIC];
  }

  if (parentBlock) {
    if (parentBlock.type === 'define_variable' || parentBlock.type === 'define_variable_with_assignment') {
      code = `${myVar.type} ${myVar.access} immutable ${myVar.name}`;
      return [code, Order.FUNCTION_CALL];
    } else if (
      parentBlock.type === 'variables_set_uint256' ||
      parentBlock.type === 'require_condition'
    ) {
      code = myVar.name;
      return [code, Order.ATOMIC];
    }
  } else {
    code = `get_${myVar.name}() returns (${myVar.type}){\n  return ${myVar.name};\n}`;
    return [code, Order.ATOMIC];
  }

  return [variable_name, Order.ATOMIC]; // ulteriore fallback
};

// ## variables_get_u256
solidityGenerator.forBlock['variables_get_u256'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
): string {
  const variable_name: string = block.getFieldValue('VAR');
  const myVar = getSolidityUint256Variable(variable_name);

  if (!myVar) {
    return `// Error: variable ${variable_name} not found\n`;
  }

  const code = `function get_${myVar.name}() public view returns (${myVar.type}) {\n  return ${myVar.name};\n}`;
  return code;
};

// ## variables_get_uint8
solidityGenerator.forBlock['variables_get_uint8'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
): [string, number] {
  const variable_name: string = block.getFieldValue('VAR');
  const myVar = getSolidityUint8Variable(variable_name);

  if (!myVar) {
    return [`// Error: variable ${variable_name} not found`, Order.ATOMIC];
  }

  const parentBlock = block.getParent();
  let code: string;

  if (parentBlock) {
    if (
      parentBlock.type === 'define_variable' ||
      parentBlock.type === 'define_variable_with_assignment'
    ) {
      code = `${myVar.type} ${myVar.access} ${myVar.name}`;
      return [code, Order.FUNCTION_CALL];
    } else if (
      parentBlock.type === 'variables_set_uint8' ||
      parentBlock.type === 'require_condition'
    ) {
      code = myVar.name;
      return [code, Order.ATOMIC];
    }
  }

  code = `get_${myVar.name}() returns (${myVar.type}) {\n  return ${myVar.name};\n}`;
  return [code, Order.ATOMIC];
};

// ## variables_set_uint8
solidityGenerator.forBlock['variables_set_uint8'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
): string {
  const variable_name: string = block.getFieldValue('VAR');
  const value: string = generator.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || '0';

  const parentBlock = block.getParent();
  let code: string;

  if (!parentBlock) {
    code = `set_${variable_name}(${value}) {\n  ${variable_name} = ${value};\n}`;
  } else {
    code = `${variable_name} = ${value};\n`;
  }

  return code;
};

// ##
solidityGenerator.forBlock['variables_get_uint8_constants'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
): [string, number] {
  const variable_name: string = block.getFieldValue('VAR');
  const myVar = getSolidityUint8ConstantsVariable(variable_name);
  const parentBlock = block.getParent();
  let code: string;

  if (myVar) {
    if (parentBlock) {
      if (parentBlock.type === 'define_variable_with_assignment') {
        code = `${myVar.type} ${myVar.access} constant ${myVar.name}`;
        return [code, Order.FUNCTION_CALL];
      } else if (
        parentBlock.type === 'variables_set_uint8' ||
        parentBlock.type === 'require_condition'
      ) {
        return [myVar.name, Order.ATOMIC];
      }
    } else {
      code = `get_${myVar.name}() returns (${myVar.type}){\n  return ${myVar.name};\n}`;
      return [code, Order.ATOMIC];
    }
  }

  // Fallback per sicurezza: restituisce un valore di default se la variabile non esiste
  return ['/* undefined variable */', Order.ATOMIC];
};

// ## variables_get_uint8_immutables
solidityGenerator.forBlock['variables_get_uint8_immutables'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
): [string, number] {
  const variable_name = block.getFieldValue('VAR');
  const myVar = getSolidityUint8ImmutablesVariable(variable_name);
  const parentBlock = block.getParent();

  if (myVar) {
    if (parentBlock) {
      if (
        parentBlock.type === 'define_variable' ||
        parentBlock.type === 'define_variable_with_assignment'
      ) {
        const code = `${myVar.type} ${myVar.access} immutable ${myVar.name}`;
        return [code, Order.FUNCTION_CALL];
      } else if (
        parentBlock.type === 'variables_set_uint8' ||
        parentBlock.type === 'require_condition'
      ) {
        return [myVar.name, Order.ATOMIC];
      }
    } else {
      const code = `get_${myVar.name}() returns (${myVar.type}){\n  return ${myVar.name};\n}`;
      return [code, Order.ATOMIC];
    }
  }

  // Fallback se la variabile non è definita
  return ['/* undefined variable */', Order.ATOMIC];
};

// ## variables_get_u8
solidityGenerator.forBlock['variables_get_u8'] = function(block) {
  const variable_name = block.getFieldValue('VAR');
  const myVar = getSolidityUint8Variable(variable_name);
  const parentBlock = block.getParent();

  if (!myVar) {
    console.warn(`Variabile uint8 '${variable_name}' non trovata.`);
    return ''; // oppure `return ['', Order.ATOMIC];` se il contesto richiede un'espressione
  }

  const code = `function get_${myVar.name}() public view returns (${myVar.type}) {\n  return ${myVar.name};\n}`;
  return code;
};

// ## INT VARIABLES
// ## variables_get_int
solidityGenerator.forBlock['variables_get_int'] = function (block) {
  const variable_name = block.getFieldValue('VAR');
  const myVar = getSolidityIntVariable(variable_name);
  const parentBlock = block.getParent();

  if (!myVar) {
    console.warn(`Variabile int '${variable_name}' non trovata.`);
    return ['', Order.ATOMIC];
  }

  let code: string;

  if (parentBlock) {
    if (parentBlock.type === 'define_variable' || parentBlock.type === 'define_variable_with_assignment') {
      code = `${myVar.type} ${myVar.access} ${myVar.name}`;
      return [code, Order.FUNCTION_CALL];
    } else if (parentBlock.type === 'variables_set_int' || parentBlock.type === 'require_condition') {
      code = myVar.name;
      return [code, Order.ATOMIC];
    }
  }

  code = `get_${myVar.name}() returns (${myVar.type}) {\n  return ${myVar.name};\n}`;
  return [code, Order.ATOMIC];
};

// ## variables_set_int
solidityGenerator.forBlock['variables_set_int'] = function (block, generator) {
  const variable_name = block.getFieldValue('VAR');
  const value = generator.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || '""';

  const parentBlock = block.getParent();
  let code: string;

  if (!parentBlock) {
    code = `set_${variable_name}(${value}) {\n  ${variable_name} = ${value};\n}`;
  } else {
    code = `${variable_name} = ${value};\n`;
  }

  return code;
};

// ## variables_get_int_constants

solidityGenerator.forBlock['variables_get_int_constants'] = function (block, generator) {
  const variable_name = block.getFieldValue('VAR');
  const myVar = getSolidityIntConstantsVariable(variable_name);
  const parentBlock = block.getParent();
  let code: string;

  if (!myVar) {
    code = variable_name; // fallback di sicurezza
    return [code, Order.ATOMIC];
  }

  if (parentBlock) {
    if (parentBlock.type === 'define_variable_with_assignment') {
      code = `${myVar.type} ${myVar.access} constant ${myVar.name}`;
      return [code, Order.FUNCTION_CALL];
    } else if (
      parentBlock.type === 'variables_set_int' ||
      parentBlock.type === 'require_condition'
    ) {
      code = myVar.name;
      return [code, Order.ATOMIC];
    }
  }

  code = `get_${myVar.name}() returns (${myVar.type}){\n  return ${myVar.name};\n}`;
  return [code, Order.ATOMIC];
};

solidityGenerator.forBlock['variables_get_int_immutables'] = function (block, generator) {
  const variable_name = block.getFieldValue('VAR');
  const myVar = getSolidityIntImmutablesVariable(variable_name);
  const parentBlock = block.getParent();
  let code: string;

  if (!myVar) {
    console.warn(`Variable '${variable_name}' not found in solidityIntImmutablesVariables.`);
    return ["undefined", Order.ATOMIC];
  }

  if (parentBlock) {
    if (
      parentBlock.type === 'define_variable' ||
      parentBlock.type === 'define_variable_with_assignment'
    ) {
      code = `${myVar.type} ${myVar.access} immutable ${myVar.name}`;
      return [code, Order.FUNCTION_CALL];
    } else if (
      parentBlock.type === 'variables_set_int' ||
      parentBlock.type === 'require_condition'
    ) {
      code = myVar.name;
      return [code, Order.ATOMIC];
    }
  } else {
    code = `get_${myVar.name}() returns (${myVar.type}) {\n  return ${myVar.name};\n}`;
    return [code, Order.ATOMIC];
  }

  // Fallback per evitare errori TypeScript: anche se tutti i casi sono coperti, serve un return.
  return ["", Order.ATOMIC];
};

// ## variables_get_i
solidityGenerator.forBlock['variables_get_i'] = function (block, generator) {
  const variable_name = block.getFieldValue('VAR');
  const myVar = getSolidityIntVariable(variable_name);

  if (!myVar) {
    throw new Error(`Variable '${variable_name}' not found in solidityIntVariables.`);
  }

  const code = `function get_${myVar.name}() public view returns (${myVar.type}) {\n  return ${myVar.name};\n}`;

  return code;
};

// ADDRESS VARIABLES
// ## variables_get_address
solidityGenerator.forBlock['variables_get_address'] = function (block, generator) {
  const variable_name = block.getFieldValue('VAR');
  const myVar = getSolidityAddressVariable(variable_name);

  if (!myVar) {
    throw new Error(`Address variable '${variable_name}' not found.`);
  }

  const parentBlock = block.getParent();
  let code;

  if (parentBlock) {
    if (parentBlock.type === 'define_variable' || parentBlock.type === 'define_variable_with_assignment1') {
      code = myVar.payable === 'yes'
        ? `${myVar.type} payable ${myVar.access} ${myVar.name}`
        : `${myVar.type} ${myVar.access} ${myVar.name}`;
      return [code, Order.FUNCTION_CALL];
    } else if (parentBlock.type === 'variables_set_address' || parentBlock.type === 'require_condition') {
      return [myVar.name, Order.ATOMIC];
    }
  }

  // Se non ha parent, genera getter
  code = `get_${myVar.name}() returns (${myVar.type}) {\n  return ${myVar.name};\n}`;
  return [code, Order.ATOMIC];
};

// ## variables_set_address
solidityGenerator.forBlock['variables_set_address'] = function (block, generator) {
  const variable_name = block.getFieldValue('VAR');
  const value = generator.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || '""';
  const myVar = getSolidityAddressVariable(variable_name);
  const parentBlock = block.getParent();

  let code;

  if (!myVar) {
    console.warn(`Variable '${variable_name}' not found in registry.`);
    code = `/* undefined address variable: ${variable_name} */\n`;
    return code;
  }

  if (!parentBlock) {
    const payablePrefix = myVar.payable === 'yes' ? 'payable ' : '';
    code =
      `function set_${variable_name}(${payablePrefix}${myVar.type} _value) public {\n` +
      `  ${variable_name} = _value;\n` +
      `}`;
  } else {
    code = `${variable_name} = ${value};\n`;
  }

  return code;
};

// ## variables_get_address_constants
solidityGenerator.forBlock['variables_get_address_constants'] = function(block) {
  const variable_name = block.getFieldValue('VAR');
  const myVar = getSolidityAddressConstantsVariable(variable_name);
  const parentBlock = block.getParent();
  let code;

  if (!myVar) {
    console.warn(`Variabile costante address '${variable_name}' non trovata.`);
    return [`/* undefined address constant: ${variable_name} */`, Order.ATOMIC];
  }

  if (parentBlock) {
    if (parentBlock.type === 'define_variable_with_assignment1') {
      code = `${myVar.type} ${myVar.access} constant ${myVar.name}`;
      return [code, Order.FUNCTION_CALL];
    } else if (parentBlock.type === 'variables_set_address' || parentBlock.type === 'require_condition') {
      code = myVar.name;
      return [code, Order.ATOMIC];
    }
  } else {
    code = `get_${myVar.name}() returns (${myVar.type}){\n  return ${myVar.name};\n}`;
    return [code, Order.ATOMIC];
  }

  // Fallback: per evitare errori se nessuna condizione è soddisfatta
  return [`/* incomplete logic for: ${variable_name} */`, Order.ATOMIC];
};

// ## variables_get_address_immutables
solidityGenerator.forBlock['variables_get_address_immutables'] = function(block) {
  const variable_name = block.getFieldValue('VAR');
  const myVar = getSolidityAddressImmutablesVariable(variable_name);

  if (!myVar) {
    console.warn(`Variable ${variable_name} not found in address immutables.`);
    return ['undefined', Order.ATOMIC];
  }

  const parentBlock = block.getParent();
  let code;

  if (parentBlock) {
    if (parentBlock.type === 'define_variable' || parentBlock.type === 'define_variable_with_assignment1') {
      code = `${myVar.type} ${myVar.access} immutable ${myVar.name}`;
      return [code, Order.FUNCTION_CALL];
    } else if (parentBlock.type === 'variables_set_address' || parentBlock.type === 'require_condition') {
      code = myVar.name;
      return [code, Order.ATOMIC];
    }
  } else {
    code = `get_${myVar.name}() returns (${myVar.type}){\n  return ${myVar.name};\n}`;
    return [code, Order.ATOMIC];
  }

  // Fallback nel caso in cui nessuna condizione venga soddisfatta (evita TS error: missing return)
  return ['undefined', Order.ATOMIC];
};

// ## variables_get_a
solidityGenerator.forBlock['variables_get_a'] = function(block) {
  const variable_name = block.getFieldValue('VAR');
  const myVar = getSolidityAddressVariable(variable_name);

  if (!myVar) {
    console.warn(`Variabile address "${variable_name}" non trovata.`);
    return ''; // oppure return '// Errore: variabile non trovata\n';
  }

  const payablePrefix = myVar.payable === 'yes' ? 'payable ' : '';
  const code = `function get_${myVar.name}() public view returns (${payablePrefix}address) {\n  return ${myVar.name};\n}`;

  return code;
};











export default solidityGenerator;

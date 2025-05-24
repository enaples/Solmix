import * as Blockly from "blockly";

export const solidityGenerator = new Blockly.Generator("Solidity");

// Define order constants for proper precedence
const Order = {
  ATOMIC: 0,
  ASSIGNMENT: 1,
};

// Type mappings for reusability
const SOLIDITY_TYPES = {
  'TYPE_BOOL': 'bool',
  'TYPE_INT': 'int',
  'TYPE_UINT': 'uint',
  'TYPE_UINT256': 'uint256',
  'TYPE_UINT8': 'uint8',
  'TYPE_STRING': 'string',
  'TYPE_ADDRESS': 'address',
  'TYPE_BYTES32': 'bytes32',
  'TYPE_BYTES': 'bytes',
} as const;

const ARRAY_TYPES = {
  'TYPE_BOOL': 'bool[]',
  'TYPE_INT': 'int[]',
  'TYPE_UINT': 'uint[]',
  'TYPE_UINT256': 'uint256[]',
  'TYPE_UINT8': 'uint8[]',
  'TYPE_STRING': 'string[]',
  'TYPE_ADDRESS': 'address[]',
  'TYPE_BYTES32': 'bytes32[]',
  'TYPE_BYTES': 'bytes[]',
} as const;

const ACCESS_MODIFIERS = {
  'TYPE_PUBLIC': 'public',
  'TYPE_PRIVATE': 'private',
  'TYPE_INTERNAL': 'internal',
  'TYPE_EXTERNALE': 'external',
} as const;

const RETURN_TYPES = {
  'TYPE_YES': 'returns',
  'TYPE_FALSE': '',
} as const;

const VIEW_TYPES = {
  'TYPE_YES': 'view',
  'TYPE_FALSE': '',
} as const;

const PURE_TYPES = {
  'TYPE_YES': 'pure',
  'TYPE_FALSE': '',
} as const;

const PAYABLE_TYPES = {
  'TYPE_YES': 'payable',
  'TYPE_FALSE': '',
} as const;

const REQUIRE_OPERATORS = {
  'NOT': '!',
  'NOT_EQUAL': '!=',
  'EQUAL': '==',
  'BIGGER OR EQUAL TO': '>=',
  'LOWER OR EQUAL TO': '<=',
  'BIGGER THAN': '>',
  'LOWER THAN': '<',
} as const;

// # import block code generator
solidityGenerator.forBlock["import"] = function (block, generator) {
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
    const variables = generator.statementToCode(block, "constIABLES") || "";
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
solidityGenerator.forBlock["array"] = function (block, generator) {
    const name = block.getFieldValue("NAME");
    //addArray(name);
    const type1 = block.getFieldValue("TYPE1");
    //addArray(name, type1);
    const type3 = block.getFieldValue("TYPE3") as
        | "TYPE_PUBLIC"
        | "TYPE_PRIVATE"
        | "TYPE_INTERNAL"
        | "TYPE_EXTERNALE";
    const types: { [key: string]: string } = {
        TYPE_BOOL: "bool[]",
        TYPE_INT: "int[]",
        TYPE_UINT: "uint[]",
        TYPE_UINT256: "uint256[]",
        TYPE_UINT8: "uint8[]",
        TYPE_STRING: "string[]",
        TYPE_ADDRESS: "address[]",
        TYPE_BYTES32: "bytes32[]",
        TYPE_BYTES: "bytes[]",
    };
    const types_1 = {
        TYPE_PUBLIC: "public",
        TYPE_PRIVATE: "private",
        TYPE_INTERNAL: "internal",
        TYPE_EXTERNALE: "external",
    };
    const code = types[type1] + " " + types_1[type3] + " " + name + ";\n";
    return code;
};

//  # Code generation for mapping
solidityGenerator.forBlock["mapping"] = function (block, generator) {
    const name = block.getFieldValue("NAME");
    const type1 = block.getFieldValue("TYPE1");
    const type2 = block.getFieldValue("TYPE2");
    const type3 = block.getFieldValue("TYPE3") as
        | "TYPE_PUBLIC"
        | "TYPE_PRIVATE"
        | "TYPE_INTERNAL"
        | "TYPE_EXTERNALE";
    const types: { [key: string]: string } = {
        TYPE_BOOL: "bool",
        TYPE_INT: "int",
        TYPE_UINT: "uint",
        TYPE_UINT256: "uint256",
        TYPE_UINT8: "uint8",
        TYPE_STRING: "string",
        TYPE_ADDRESS: "address",
        TYPE_BYTES32: "bytes32",
        TYPE_BYTES: "bytes",
    };
    const types_1 = {
        TYPE_PUBLIC: "public",
        TYPE_PRIVATE: "private",
        TYPE_INTERNAL: "internal",
        TYPE_EXTERNALE: "external",
    };
    const code =
        "mapping(" +
        types[type1] +
        "=>" +
        types[type2] +
        ") " +
        types_1[type3] +
        " " +
        name +
        ";\n";
    return code;
};

// # Code generator for event
solidityGenerator.forBlock["event"] = function (block, generator) {
    const params = generator.statementToCode(block, "PARAMS");
    const name = block.getFieldValue("NAME");
    const code = "event " + name + "(" + params + ");\n";
    return code;
};

// # Code generator for function input
solidityGenerator.forBlock["function_input"] = function (block, generator) {
    const name = block.getFieldValue("NAME");
    const type = block.getFieldValue("TYPE") as
        | "TYPE_BOOL"
        | "TYPE_INT"
        | "TYPE_UINT"
        | "TYPE_UINT256"
        | "TYPE_UINT8"
        | "TYPE_STRING"
        | "TYPE_ADDRESS"
        | "TYPE_BYTES32"
        | "TYPE_BYTES";
    const types = {
        TYPE_BOOL: "bool",
        TYPE_INT: "int",
        TYPE_UINT: "uint",
        TYPE_UINT256: "uint256",
        TYPE_UINT8: "uint8",
        TYPE_STRING: "string",
        TYPE_ADDRESS: "address",
        TYPE_BYTES32: "bytes32",
        TYPE_BYTES: "bytes",
    };

    const nextBlock = block.getNextBlock();
    var parentBlock = block.getParent();

    // Risaliamo nella catena finché troviamo il vero parent di tipo 'variables_get_modifieri'
    while (parentBlock) {
        if (parentBlock.type === "variables_get_modifiers") {
            break; // Se lo troviamo, usciamo dal ciclo
        }
        parentBlock = parentBlock.getParent();
    }

    var code;
    if (parentBlock && parentBlock.type === "variables_get_modifiers") {
        // Se esiste un blocco precedente di tipo func_inputs, significa che non è il primo
        const sep = nextBlock && nextBlock.type == block.type ? ", " : "";
        code = name + sep;
    } else {
        //const nextBlock = block.getNextBlock();
        const sep = nextBlock && nextBlock.type == block.type ? ", " : "";
        code = types[type] + " " + name + sep;
    }
    return code;
};

// # Code generator for function return type
solidityGenerator.forBlock["function_return"] = function (block, generator) {
    const type = block.getFieldValue("TYPE") as
        | "TYPE_BOOL"
        | "TYPE_INT"
        | "TYPE_UINT"
        | "TYPE_UINT256"
        | "TYPE_UINT8"
        | "TYPE_STRING"
        | "TYPE_ADDRESS"
        | "TYPE_BYTES32"
        | "TYPE_BYTES";
    const types = {
        TYPE_BOOL: "bool",
        TYPE_INT: "int",
        TYPE_UINT: "uint",
        TYPE_UINT256: "uint256",
        TYPE_UINT8: "uint8",
        TYPE_STRING: "string",
        TYPE_ADDRESS: "address",
        TYPE_BYTES32: "bytes32",
        TYPE_BYTES: "bytes",
    };

    var nextBlock = block.getNextBlock();

    const sep = nextBlock && nextBlock.type == block.type ? ", " : "";
    const code = types[type] + " " + name + sep;
    return code;
};

// # Code generator for constract state
solidityGenerator.forBlock["state"] = function (block, generator) {
    const name = block.getFieldValue("NAME");

    var value = block.getFieldValue("VALUE");
    var type = block.getFieldValue("TYPE") as
        | "TYPE_BOOL"
        | "TYPE_INT"
        | "TYPE_UINT";
    const types = {
        TYPE_BOOL: "bool",
        TYPE_INT: "int",
        TYPE_UINT: "uint",
    };
    var defaultValue = {
        TYPE_BOOL: "false",
        TYPE_INT: "0",
        TYPE_UINT: "0",
    };

    if (value === "") {
        value = defaultValue[type];
    }

    return types[type] + " " + name + " = " + value + ";\n";
};

// # Code generator for contract structures
solidityGenerator.forBlock["structure"] = function (block, generator) {
    const name = block.getFieldValue("NAME");
    // Estrai i blocchi figli dallo statement STATES
    const firstFieldBlock = block.getInputTargetBlock("STATES");
    var types = {
        TYPE_BOOL: "bool",
        TYPE_INT: "int",
        TYPE_UINT: "uint",
        TYPE_UINT256: "uint256",
        TYPE_UINT8: "uint8",
        TYPE_STRING: "string",
        TYPE_ADDRESS: "address",
        TYPE_BYTES32: "bytes32",
        TYPE_BYTES: "bytes",
    };

    const structAttributes = [];
    let code = "";

    let current = firstFieldBlock;
    while (current) {
        const type = current.getFieldValue("TYPE") as keyof typeof types;
        const varName = current.getFieldValue("NAME");

        // Salviamo l'attributo per il registry
        structAttributes.push({
            name: varName,
            type: types[type],
        });

        // Generiamo la riga Solidity
        code += `  ${types[type]} ${varName};\n`;

        // Passiamo al prossimo blocco collegato
        current = current.getNextBlock();
    }

    // Salviamo nel registry
    //saveStruct(name, structAttributes);
    //addStruct(name); // se ti serve per un altro scopo
    return `struct ${name} {\n${code}}\n`;
};

// # Code generator for struct variables
solidityGenerator.forBlock["struct_variables"] = function (block, generator) {
    var name = block.getFieldValue("NAME");
    var type = block.getFieldValue("TYPE") as
        | "TYPE_BOOL"
        | "TYPE_INT"
        | "TYPE_UINT"
        | "TYPE_UINT256"
        | "TYPE_UINT8"
        | "TYPE_STRING"
        | "TYPE_ADDRESS"
        | "TYPE_BYTES32"
        | "TYPE_BYTES";
    var types = {
        TYPE_BOOL: "bool",
        TYPE_INT: "int",
        TYPE_UINT: "uint",
        TYPE_UINT256: "uint256",
        TYPE_UINT8: "uint8",
        TYPE_STRING: "string",
        TYPE_ADDRESS: "address",
        TYPE_BYTES32: "bytes32",
        TYPE_BYTES: "bytes",
    };
    return types[type] + " " + name + ";\n";
};

// # Code generator for contract variables
solidityGenerator.forBlock["variables"] = function (block, generator) {
    var name = block.getFieldValue("NAME");
    var type = block.getFieldValue("TYPE") as
        | "TYPE_BOOL"
        | "TYPE_INT"
        | "TYPE_UINT"
        | "TYPE_UINT256"
        | "TYPE_UINT8"
        | "TYPE_STRING"
        | "TYPE_ADDRESS"
        | "TYPE_BYTES32"
        | "TYPE_BYTES";
    var type3 = block.getFieldValue("TYPE3") as
        | "TYPE_PUBLIC"
        | "TYPE_PRIVATE"
        | "TYPE_INTERNAL"
        | "TYPE_EXTERNALE";
    var types = {
        TYPE_BOOL: "bool",
        TYPE_INT: "int",
        TYPE_UINT: "uint",
        TYPE_UINT256: "uint256",
        TYPE_UINT8: "uint8",
        TYPE_STRING: "string",
        TYPE_ADDRESS: "address",
        TYPE_BYTES32: "bytes32",
        TYPE_BYTES: "bytes",
    };
    var types_1 = {
        TYPE_PUBLIC: "public",
        TYPE_PRIVATE: "private",
        TYPE_INTERNAL: "internal",
        TYPE_EXTERNALE: "external",
    };
    return types[type] + " " + types_1[type3] + " " + name + ";\n";
};

// # Code generator for unknown code
solidityGenerator.forBlock["unknown_code"] = function (block, generator) {
    const code = block.getFieldValue("CODE");
    return code + "\n";
};

// # Code generator for internal function
solidityGenerator.forBlock["internal_function"] = function (block, generator) {
    const text = block.getFieldValue("CODE");
    return "" + text + "\n";
};

// # Code generator for internal assignment
solidityGenerator.forBlock["internalAss"] = function (block, generator) {
    const text = block.getFieldValue("CODE");
    return "" + text + "\n";
};

// # Code generator for local variables
solidityGenerator.forBlock["localVariable"] = function (block, generator) {
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
solidityGenerator.forBlock["require"] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const operator = block.getFieldValue("OPERATOR");
  const leftOperand = generator.valueToCode(block, "LEFT", Order.ATOMIC) || "false";
  const rightOperand = generator.valueToCode(block, "RIGHT", Order.ATOMIC) || "false";
  
  let code = "";
  
  if (operator === "NOT") {
    code = "! " + leftOperand;
  } else if (operator in REQUIRE_OPERATORS && operator !== "NOT") {
    const operatorSymbol = REQUIRE_OPERATORS[operator as keyof typeof REQUIRE_OPERATORS];
    code = leftOperand + " " + operatorSymbol + " " + rightOperand;
  }
  
  return [code, Order.ATOMIC];
};

// Require statement generator
solidityGenerator.forBlock["require_statement"] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const condition = generator.valueToCode(block, "CONDITION", Order.ATOMIC) || "false";
  const message = block.getFieldValue("MESSAGE") || "Error";
  const code = 'require(' + condition + ', "' + message + '");\n';
  return code;
};

// # Solidity code generator for require consition method1
solidityGenerator.forBlock["require_condition_method1"] = function (
    block,
    generator
) {
    const message = block.getFieldValue("MESSAGE");
    const condition =
        generator.valueToCode(block, "CONDITION", Order.ATOMIC) ||
        "false";
    const code = "require(" + condition + ', "' + message + '");\n';
    return code;
};

// Import block generator (from your example)
solidityGenerator.forBlock["import"] = function (block: Blockly.Block, generator: Blockly.Generator) {
  const imp1 = block.getFieldValue("Imp1");
  const imp2 = block.getFieldValue("Imp2");
  return "import {" + imp1 + '} from "' + imp2 + '";\n';
};

// Modifier block generator
solidityGenerator.forBlock['modifier1'] = function(block: Blockly.Block, generator: Blockly.Generator) {
  const name = block.getFieldValue("NAME");
  const message = block.getFieldValue("MESSAGE");
  const params = generator.statementToCode(block, 'PARAMS').trim();
  const condition = generator.valueToCode(block, "CONDITION", Order.ATOMIC) || "false";

  const code = 'modifier ' + name + '( ' + params + ') {\n' + 
               'require(' + condition + ', "' + message + '");\n' + 
               '_;\n' + 
               '}\n';

  return code;
};

// If statement generator
solidityGenerator.forBlock['if'] = function(block: Blockly.Block, generator: Blockly.Generator) {
  const condition = generator.valueToCode(block, "IF", Order.ATOMIC) || "false";
  const branch = generator.statementToCode(block, 'DO');
  const code = 'if ' + condition + ' {\n' + branch + '}';
  return code;
};

// Else if statement generator
solidityGenerator.forBlock['else_if'] = function(block: Blockly.Block, generator: Blockly.Generator) {
  const condition = generator.valueToCode(block, "ELSE_IF", Order.ATOMIC) || "false";
  const branch = generator.statementToCode(block, 'DO');
  const code = 'else if ' + condition + ' {\n' + branch + '}';
  return code;
};

// Else statement generator
solidityGenerator.forBlock['else'] = function(block: Blockly.Block, generator: Blockly.Generator) {
  const branch = generator.statementToCode(block, 'DO');
  const code = 'else {\n' + branch + '}';
  return code;
};

// If container generator
solidityGenerator.forBlock['if_container'] = function(block: Blockly.Block, generator: Blockly.Generator) {
  const ifCondition = generator.statementToCode(block, 'IF');
  const elseIfCondition = generator.statementToCode(block, 'ELSE_IF');
  const elseStatement = generator.statementToCode(block, 'ELSE');
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
solidityGenerator.forBlock['if_else_container'] = function(block: Blockly.Block, generator: Blockly.Generator) {
  const ifCondition = generator.statementToCode(block, 'IF');
  const elseStatement = generator.statementToCode(block, 'ELSE');
  let code = ifCondition;

  if (elseStatement) {
    code += elseStatement;
  }

  return code;
};

// If-elseif-else container generator
solidityGenerator.forBlock['if_elseif_else_container'] = function(block: Blockly.Block, generator: Blockly.Generator) {
  const ifCondition = generator.statementToCode(block, 'IF');
  const elseIfCondition = generator.statementToCode(block, 'ELSE_IF');
  const elseStatement = generator.statementToCode(block, 'ELSE');
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
solidityGenerator.forBlock['method'] = function(block: Blockly.Block, generator: Blockly.Generator) {
  const name = block.getFieldValue("NAME");
  const access = block.getFieldValue("ACCESS");
  const type = block.getFieldValue("TYPE");
  const view = block.getFieldValue("VIEW");
  const pure = block.getFieldValue("PURE");
  const payable = block.getFieldValue("PAYABLE");
  const return_ = block.getFieldValue("RETURN");
  const override = block.getFieldValue("OVERRIDE");

  const params = generator.statementToCode(block, 'PARAMS').trim();
  const values = generator.statementToCode(block, 'RETURN_VALUES').trim();
  const modifiers = generator.valueToCode(block, 'MODIFIERS', Order.ASSIGNMENT) || '';
  const branch = generator.statementToCode(block, 'STACK');
  const require = generator.statementToCode(block, 'REQUIRE').trim() || "";

  const accessValue = ACCESS_MODIFIERS[access as keyof typeof ACCESS_MODIFIERS];
  const returnValue = RETURN_TYPES[return_ as keyof typeof RETURN_TYPES];
  const viewValue = VIEW_TYPES[view as keyof typeof VIEW_TYPES];
  const pureValue = PURE_TYPES[pure as keyof typeof PURE_TYPES];
  const payableValue = PAYABLE_TYPES[payable as keyof typeof PAYABLE_TYPES];

  let code = 'function ' + name + '( ' + params + ')' + ' ' + accessValue + ' ' + 
             payableValue + ' ' + viewValue + ' ' + pureValue + ' ' + modifiers + ' ' + returnValue;

  // Add the return type only if there is a return value
  if (returnValue === 'returns') {
    code += ' ( ' + values + ' )';
  }

  // Handle override
  if (override) {
    code = 'function ' + name + '( ' + params + ')' + ' ' + accessValue + ' ' + 
           payableValue + ' ' + viewValue + ' ' + pureValue + ' override(' + override + ')' + 
           ' ' + modifiers + ' ' + returnValue;
    if (returnValue === 'returns') {
      code += ' ( ' + values + ' )';
    }
  }

  // Add function body
  if (require) {
    code += ' {\n' + require + '\n' + branch + '\n' + '}\n';
  } else {
    code += ' {\n' + branch + '\n' + '}\n';
  }

  return code;
};

// Variable definition generator
solidityGenerator.forBlock['define_variable'] = function(block: Blockly.Block, generator: Blockly.Generator) {
  const value = generator.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || 'null';
  return value + ";\n";
};

// Variable definition with assignment generator
solidityGenerator.forBlock['define_variable_with_assignment'] = function(block: Blockly.Block, generator: Blockly.Generator) {
  const value = generator.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || 'null';
  const assigned_value = block.getFieldValue('ASSIGNED_VALUE') || "";
  
  console.log("VALUE:", value, "ASSIGNED_VALUE:", assigned_value);
  
  if (assigned_value.trim() !== "") {
    return value + " = " + assigned_value + ";\n";
  } else {
    return "";
  }
};

// Struct variable definition with assignment generator
solidityGenerator.forBlock['define_struct_variable_with_assignment'] = function(block: Blockly.Block, generator: Blockly.Generator) {
  const assigned_struct = generator.valueToCode(block, 'ASSIGNED_STRUCT', Order.ASSIGNMENT) || 'null';
  const structName = block.getFieldValue('NAME') || "";
  const type_struct = block.getFieldValue('TYPE') || "";
  
  console.log("NAME:", structName, "ASSIGNED_STRUCT:", assigned_struct);
  
  if (assigned_struct.trim() !== "") {
    return type_struct + ' ' + structName + " = " + assigned_struct + ";\n";
  } else {
    return "";
  }
};

// Array variable definition generator
solidityGenerator.forBlock['define_arrayVariable'] = function(block: Blockly.Block) {
  const arrayName = block.getFieldValue('NAME') || "";
  const type_array = block.getFieldValue('TYPE') || "";
  const type_array1 = block.getFieldValue('TYPE1') || "";
  const values = block.getFieldValue('VALUES') || "";
  
  console.log("ARRAY VARIABLE: ", arrayName, type_array, type_array1, values);
  return type_array + '[] ' + arrayName + ' = new ' + type_array1 + '[]( ' + values + ' );\n';
};

// Assign values to variable array generator
solidityGenerator.forBlock['assign_values_to_variable_array'] = function(block: Blockly.Block) {
  const arrayName = block.getFieldValue('NAME');
  const type_array = block.getFieldValue('TYPE1');
  const type_access = block.getFieldValue('TYPE3');
  const values = block.getFieldValue('VALUES') || "";

  const typeValue = ARRAY_TYPES[type_array as keyof typeof ARRAY_TYPES];
  const accessValue = ACCESS_MODIFIERS[type_access as keyof typeof ACCESS_MODIFIERS];

  return typeValue + ' ' + accessValue + ' ' + arrayName + ' = ' + '[ ' + values + ' ];\n';
};

// String variable definition with assignment generator  
solidityGenerator.forBlock['define_variable_with_assignment1'] = function(block: Blockly.Block, generator: Blockly.Generator) {
  const value = generator.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || 'null';
  const assigned_value = block.getFieldValue('ASSIGNED_VALUE') || "";
  
  console.log("VALUE:", value, "ASSIGNED_VALUE:", assigned_value);

  if (assigned_value.trim() !== "") {
    return value + " = " + " '" + assigned_value + "';\n";
  } else {
    return "";
  }
};

// Input generators
solidityGenerator.forBlock['input'] = function(block: Blockly.Block) {
  const textValue = block.getFieldValue("input_name");
  return [textValue, 0];
};

solidityGenerator.forBlock['input_right'] = function(block: Blockly.Block) {
  const textValue = block.getFieldValue("input_name");
  return [textValue, 0];
};

// Return block generator
solidityGenerator.forBlock['return_block'] = function(block: Blockly.Block) {
  const textValue = block.getFieldValue("input_name");
  return "return " + textValue + ";\n";
};

// Mathematical operation generators
solidityGenerator.forBlock['input_somma'] = function(block: Blockly.Block) {
  const textValue = block.getFieldValue("input_name");
  const value = block.getFieldValue("input_increment");
  const code = textValue + "+ " + value;
  return [code, 0];
};

solidityGenerator.forBlock['input_diff'] = function(block: Blockly.Block) {
  const textValue = block.getFieldValue("input_name");
  const value = block.getFieldValue("input_decrement");
  const code = textValue + "- " + value;
  return [code, 0];
};

// Address-related generators
solidityGenerator.forBlock['address_zero'] = function(block: Blockly.Block) {
  const code = "address(0)";
  return [code, Order.ATOMIC];
};

solidityGenerator.forBlock['address_this'] = function(block: Blockly.Block) {
  const code = "address(this)";
  return [code, Order.ATOMIC];
};

solidityGenerator.forBlock['address_this_balance'] = function(block: Blockly.Block) {
  const code = "address(this).balance";
  return [code, Order.ATOMIC];
};

export default solidityGenerator;
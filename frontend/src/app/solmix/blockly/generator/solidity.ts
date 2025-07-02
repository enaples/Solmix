import * as Blockly from "blockly";
import { variableTypes } from "../blocks/variable_types";
import {getSolidityEvent} from "../blocks/dynamicEventBloks";
//import {addEvent} from "../blocks/dynamicEventBloks";

export const solidityGenerator = new Blockly.Generator("Solidity");

// Define order constants for proper precedence
const Order = {
    ATOMIC: 0,
    ASSIGNMENT: 1,
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

// # Solidity code generator for require consition method1
solidityGenerator.forBlock["require_condition_method1"] = function (
    block,
    generator
) {
    const message = block.getFieldValue("MESSAGE");
    const condition =
        generator.valueToCode(block, "CONDITION", Order.ATOMIC) || "false";
    const code = "require(" + condition + ', "' + message + '");\n';
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

export default solidityGenerator;

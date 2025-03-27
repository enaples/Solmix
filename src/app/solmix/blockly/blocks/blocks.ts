import * as Blockly from "blockly";
import { variableTypes } from "./variable_types";
import '../validators/validators';

// # Variables
Blockly.defineBlocksWithJsonArray([
    // // ## Type fixed byte
    // {
    //     type: "solidity_type_bytes_fixed",
    //     message0: "Fixed Bytes %1 %2",
    //     args0: [
    //         {
    //             type: "field_dropdown",
    //             name: "BYTES_TYPE",
    //             options: [
    //                 ["bytes1", "bytes1"],
    //                 ["bytes2", "bytes2"],
    //                 ["bytes3", "bytes3"],
    //                 ["bytes4", "bytes4"],
    //                 ["bytes5", "bytes5"],
    //                 ["bytes6", "bytes6"],
    //                 ["bytes7", "bytes7"],
    //                 ["bytes8", "bytes8"],
    //                 ["bytes9", "bytes9"],
    //                 ["bytes10", "bytes10"],
    //                 ["bytes11", "bytes11"],
    //                 ["bytes12", "bytes12"],
    //                 ["bytes13", "bytes13"],
    //                 ["bytes14", "bytes14"],
    //                 ["bytes15", "bytes15"],
    //                 ["bytes16", "bytes16"],
    //                 ["bytes17", "bytes17"],
    //                 ["bytes18", "bytes18"],
    //                 ["bytes19", "bytes19"],
    //                 ["bytes20", "bytes20"],
    //                 ["bytes21", "bytes21"],
    //                 ["bytes22", "bytes22"],
    //                 ["bytes23", "bytes23"],
    //                 ["bytes24", "bytes24"],
    //                 ["bytes25", "bytes25"],
    //                 ["bytes26", "bytes26"],
    //                 ["bytes27", "bytes27"],
    //                 ["bytes28", "bytes28"],
    //                 ["bytes29", "bytes29"],
    //                 ["bytes30", "bytes30"],
    //                 ["bytes31", "bytes31"],
    //                 ["bytes32", "bytes32"],
    //             ],
    //         },
    //         {
    //             type: "input_value",
    //             name: "BYTES_VALUE",
    //             check: "String",
    //         },
    //     ],
    //     output: "Bytes",
    //     colour: 20,
    //     tooltip: "Fixed-size byte array",
    //     helpUrl: "",
    // },

    // ## Type `enum`
    {
        type: "solidity_type_enum",
        message0: "Enum %1 %2",
        args0: [
            {
                type: "field_input",
                name: "ENUM_NAME",
                text: "EnumName",
            },
            {
                type: "input_statement",
                name: "ENUM_VALUES",
                check: "EnumValue",
            },
        ],
        colour: 330,
        tooltip: "User-defined enumeration type",
        helpUrl: "",
    },

    // ## Type enum value
    {
        type: "solidity_type_enum_value",
        message0: "value %1",
        args0: [
            {
                type: "field_input",
                name: "VALUE_NAME",
                text: "EnumValue",
            },
        ],
        previousStatement: "EnumValue",
        nextStatement: "EnumValue",
        colour: 330,
        tooltip: "Value within an enumeration",
        helpUrl: "",
    },
]);

// # Basic Types Value
Blockly.defineBlocksWithJsonArray(
    Object.keys(variableTypes).map((type: string) => ({
        type: `solidity_${type}`,
        message0: `${type} %1`,
        args0: [
            {
                type: "field_input",
                name: `${type.toUpperCase()}_VAL`,
            },
        ],
        output: type,
        colour: variableTypes[type].colour,
        tooltip: variableTypes[type].colour,
        helpUrl: "",
        extensions: [`${type}_validator`]
    }))
);

// # Operators
Blockly.defineBlocksWithJsonArray([
    // ## Bool operator
    {
        type: "solidity_operator_bool",
        message0: "%1 %2 %3",
        args0: [
            {
                type: "input_value",
                name: "LEFT",
                check: "Boolean",
            },
            {
                type: "field_dropdown",
                name: "OPERATOR",
                options: [
                    ["&&", "&&"],
                    ["||", "||"],
                    ["==", "=="],
                    ["!=", "!="],
                ],
            },
            {
                type: "input_value",
                name: "RIGHT",
                check: "Boolean",
            },
        ],
        output: "Boolean",
        colour: 160,
        tooltip: "Boolean operation",
        helpUrl: "",
    },

    // ## Not operator
    {
        type: "solidity_operator_not",
        message0: "! %1",
        args0: [
            {
                type: "input_value",
                name: "BOOL",
                check: "Boolean",
            },
        ],
        output: "Boolean",
        colour: 160,
        tooltip: "Logical NOT operation",
        helpUrl: "",
    },

    // int operator
    {
        type: "solidity_operator_int",
        message0: "%1 %2 %3",
        args0: [
            {
                type: "input_value",
                name: "LEFT",
                check: "Integer",
            },
            {
                type: "field_dropdown",
                name: "OPERATOR",
                options: [
                    ["+", "+"],
                    ["-", "-"],
                    ["*", "*"],
                    ["/", "/"],
                    ["%", "%"],
                    ["**", "**"],
                    ["&", "&"],
                    ["|", "|"],
                    ["^", "^"],
                    ["<<", "<<"],
                    [">>", ">>"],
                ],
            },
            {
                type: "input_value",
                name: "RIGHT",
                check: "Integer",
            },
        ],
        output: "Integer",
        colour: 230,
        tooltip: "Integer operation",
        helpUrl: "",
    },

    // ## Comparison
    {
        type: "solidity_operator_comparison",
        message0: "%1 %2 %3",
        args0: [
            {
                type: "input_value",
                name: "LEFT",
                check: ["Integer", "Address", "Bytes"],
            },
            {
                type: "field_dropdown",
                name: "OPERATOR",
                options: [
                    ["==", "=="],
                    ["!=", "!="],
                    ["<", "<"],
                    ["<=", "<="],
                    [">", ">"],
                    [">=", ">="],
                ],
            },
            {
                type: "input_value",
                name: "RIGHT",
                check: ["Integer", "Address", "Bytes"],
            },
        ],
        output: "Boolean",
        colour: 230,
        tooltip: "Comparison operation",
        helpUrl: "",
    },
]);

// # Modifier
Blockly.defineBlocksWithJsonArray([
    {
        type: "solidity_type_modifier",
        message0: "Modifier %1 %2",
        args0: [
            {
                type: "field_dropdown",
                name: "MODIFIER",
                options: [
                    ["memory", "memory"],
                    ["storage", "storage"],
                    ["calldata", "calldata"],
                ],
            },
            {
                type: "input_value",
                name: "TYPE",
                check: [
                    "Boolean",
                    "Integer",
                    "FixedPoint",
                    "Address",
                    "Bytes",
                    "String",
                    "Contract",
                    "UserType",
                ],
            },
        ],
        output: null,
        colour: 50,
        tooltip: "Type data location modifier",
        helpUrl: "",
    },
]);

// # Address methods
Blockly.defineBlocksWithJsonArray([
    {
        type: "solidity_address_member",
        message0: "%1 . %2",
        args0: [
            {
                type: "input_value",
                name: "ADDRESS",
                check: "Address",
            },
            {
                type: "field_dropdown",
                name: "MEMBER",
                options: [
                    ["balance", "balance"],
                    ["code", "code"],
                    ["codehash", "codehash"],
                ],
            },
        ],
        output: null,
        colour: 60,
        tooltip: "Access address member properties",
        helpUrl: "",
    },
    {
        type: "solidity_address_method",
        message0: "%1 . %2 %3",
        args0: [
            {
                type: "input_value",
                name: "ADDRESS",
                check: "Address",
            },
            {
                type: "field_dropdown",
                name: "METHOD",
                options: [
                    ["transfer", "transfer"],
                    ["send", "send"],
                    ["call", "call"],
                    ["delegatecall", "delegatecall"],
                    ["staticcall", "staticcall"],
                ],
            },
            {
                type: "input_value",
                name: "VALUE",
                check: ["Integer", "String"],
            },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 60,
        tooltip: "Call address methods",
        helpUrl: "",
    },
    {
        type: "solidity_address_call_options",
        message0: "%1 . %2 { %3 : %4 , %5 : %6 } ( %7 )",
        args0: [
            {
                type: "input_value",
                name: "ADDRESS",
                check: "Address",
            },
            {
                type: "field_dropdown",
                name: "METHOD",
                options: [
                    ["call", "call"],
                    ["delegatecall", "delegatecall"],
                    ["staticcall", "staticcall"],
                ],
            },
            {
                type: "field_dropdown",
                name: "OPTION1",
                options: [
                    ["gas", "gas"],
                    ["value", "value"],
                ],
            },
            {
                type: "input_value",
                name: "OPTION1_VALUE",
                check: "Integer",
            },
            {
                type: "field_dropdown",
                name: "OPTION2",
                options: [
                    ["gas", "gas"],
                    ["value", "value"],
                ],
            },
            {
                type: "input_value",
                name: "OPTION2_VALUE",
                check: "Integer",
            },
            {
                type: "input_value",
                name: "PAYLOAD",
                check: "Bytes",
            },
        ],
        output: ["Boolean", "Bytes"],
        colour: 60,
        tooltip: "Call address methods with options",
        helpUrl: "",
    },

    // ## Conversion
    {
        type: "solidity_type_conversion",
        message0: "%1 ( %2 )",
        args0: [
            {
                type: "field_dropdown",
                name: "TARGET_TYPE",
                options: [
                    ["uint", "uint"],
                    ["uint8", "uint8"],
                    ["uint256", "uint256"],
                    ["int", "int"],
                    ["int8", "int8"],
                    ["int256", "int256"],
                    ["address", "address"],
                    ["address payable", "address payable"],
                    ["bytes", "bytes"],
                    ["bytes32", "bytes32"],
                    ["string", "string"],
                    ["bool", "bool"],
                ],
            },
            {
                type: "input_value",
                name: "VALUE",
                check: ["Integer", "Address", "Bytes", "String", "Boolean"],
            },
        ],
        output: null,
        colour: 180,
        tooltip: "Convert between different types",
        helpUrl: "",
    },

    // ## Payable conversion
    {
        type: "solidity_payable_conversion",
        message0: "payable ( %1 )",
        args0: [
            {
                type: "input_value",
                name: "ADDRESS",
                check: "Address",
            },
        ],
        output: "Address",
        colour: 60,
        tooltip: "Convert to payable address",
        helpUrl: "",
    },

    // # Type MIN & MAX
    {
        type: "solidity_type_min_max",
        message0: "type ( %1 ) . %2",
        args0: [
            {
                type: "field_dropdown",
                name: "TYPE",
                options: [
                    ["uint", "uint"],
                    ["uint8", "uint8"],
                    ["uint256", "uint256"],
                    ["int", "int"],
                    ["int8", "int8"],
                    ["int256", "int256"],
                    ["EnumName", "EnumName"],
                ],
            },
            {
                type: "field_dropdown",
                name: "PROPERTY",
                options: [
                    ["min", "min"],
                    ["max", "max"],
                ],
            },
        ],
        output: "Integer",
        colour: 180,
        tooltip: "Get minimum or maximum value of a type",
        helpUrl: "",
    },
    {
        type: "solidity_user_type_wrap",
        message0: "%1 . wrap ( %2 )",
        args0: [
            {
                type: "field_input",
                name: "TYPE_NAME",
                text: "CustomType",
            },
            {
                type: "input_value",
                name: "VALUE",
                check: ["Integer", "Boolean", "Bytes", "Address"],
            },
        ],
        output: "UserType",
        colour: 200,
        tooltip: "Wrap a value in a user-defined type",
        helpUrl: "",
    },
    {
        type: "solidity_user_type_unwrap",
        message0: "%1 . unwrap ( %2 )",
        args0: [
            {
                type: "field_input",
                name: "TYPE_NAME",
                text: "CustomType",
            },
            {
                type: "input_value",
                name: "VALUE",
                check: "UserType",
            },
        ],
        output: ["Integer", "Boolean", "Bytes", "Address"],
        colour: 200,
        tooltip: "Unwrap a value from a user-defined type",
        helpUrl: "",
    },
    {
        type: "solidity_unchecked_block",
        message0: "unchecked { %1 }",
        args0: [
            {
                type: "input_statement",
                name: "STATEMENTS",
            },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 230,
        tooltip:
            "Perform arithmetic operations without overflow/underflow checking",
        helpUrl: "",
    },

    // ## Encoding funcions
    {
        type: "solidity_encoding_functions",
        message0: "abi . %1 ( %2 )",
        args0: [
            {
                type: "field_dropdown",
                name: "FUNCTION",
                options: [
                    ["encode", "encode"],
                    ["encodePacked", "encodePacked"],
                    ["encodeWithSelector", "encodeWithSelector"],
                    ["encodeWithSignature", "encodeWithSignature"],
                ],
            },
            {
                type: "input_value",
                name: "PARAMS",
                check: ["String", "Integer", "Boolean", "Address", "Bytes"],
            },
        ],
        output: "Bytes",
        colour: 80,
        tooltip: "ABI encoding functions",
        helpUrl: "",
    },
]);

// # Functions
Blockly.defineBlocksWithJsonArray([
    {
        type: "solidity_function_definition",
        message0: "function %1 %2 %3 %4 %5 %6 %7 %8",
        args0: [
            {
                type: "field_input",
                name: "NAME",
                text: "functionName",
            },
            {
                type: "input_dummy",
            },
            {
                type: "input_statement",
                name: "PARAMS",
                check: "Parameter",
            },
            {
                type: "field_dropdown",
                name: "VISIBILITY",
                options: [
                    ["public", "public"],
                    ["private", "private"],
                    ["internal", "internal"],
                    ["external", "external"],
                ],
            },
            {
                type: "field_dropdown",
                name: "MUTABILITY",
                options: [
                    ["", ""],
                    ["pure", "pure"],
                    ["view", "view"],
                    ["payable", "payable"],
                ],
            },
            {
                type: "input_dummy",
            },
            {
                type: "input_statement",
                name: "RETURNS",
                check: "ReturnParameter",
            },
            {
                type: "input_statement",
                name: "BODY",
            },
        ],
        colour: 290,
        tooltip: "Define a function in a contract",
        helpUrl: "",
    },
    {
        type: "solidity_function_parameter",
        message0: "parameter %1 %2",
        args0: [
            {
                type: "input_value",
                name: "TYPE",
                check: [
                    "Boolean",
                    "Integer",
                    "FixedPoint",
                    "Address",
                    "Bytes",
                    "String",
                    "Contract",
                    "UserType",
                ],
            },
            {
                type: "field_input",
                name: "NAME",
                text: "paramName",
            },
        ],
        previousStatement: "Parameter",
        nextStatement: "Parameter",
        colour: 290,
        tooltip: "Function parameter definition",
        helpUrl: "",
    },
    {
        type: "solidity_function_return",
        message0: "return %1",
        args0: [
            {
                type: "input_value",
                name: "TYPE",
                check: [
                    "Boolean",
                    "Integer",
                    "FixedPoint",
                    "Address",
                    "Bytes",
                    "String",
                    "Contract",
                    "UserType",
                ],
            },
        ],
        previousStatement: "ReturnParameter",
        nextStatement: "ReturnParameter",
        colour: 290,
        tooltip: "Function return parameter definition",
        helpUrl: "",
    },
    {
        type: "solidity_function_call",
        message0: "call %1 . %2 %3",
        args0: [
            {
                type: "input_value",
                name: "CONTRACT",
                check: ["Address", "Contract"],
            },
            {
                type: "field_input",
                name: "FUNCTION",
                text: "functionName",
            },
            {
                type: "input_statement",
                name: "ARGS",
                check: "Argument",
            },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 290,
        tooltip: "Call a function on another contract",
        helpUrl: "",
    },
    {
        type: "solidity_function_call_with_options",
        message0: "call %1 . %2 { %3 : %4 } %5",
        args0: [
            {
                type: "input_value",
                name: "CONTRACT",
                check: ["Address", "Contract"],
            },
            {
                type: "field_input",
                name: "FUNCTION",
                text: "functionName",
            },
            {
                type: "field_dropdown",
                name: "OPTION",
                options: [
                    ["value", "value"],
                    ["gas", "gas"],
                ],
            },
            {
                type: "input_value",
                name: "OPTION_VALUE",
                check: "Integer",
            },
            {
                type: "input_statement",
                name: "ARGS",
                check: "Argument",
            },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 290,
        tooltip:
            "Call a function with options like value (in wei) or gas limit",
        helpUrl: "",
    },
    {
        type: "solidity_function_argument",
        message0: "argument %1",
        args0: [
            {
                type: "input_value",
                name: "VALUE",
                check: [
                    "Boolean",
                    "Integer",
                    "FixedPoint",
                    "Address",
                    "Bytes",
                    "String",
                    "Contract",
                    "UserType",
                ],
            },
        ],
        previousStatement: "Argument",
        nextStatement: "Argument",
        colour: 290,
        tooltip: "Function call argument",
        helpUrl: "",
    },
    {
        type: "solidity_return_statement",
        message0: "return %1",
        args0: [
            {
                type: "input_value",
                name: "VALUE",
                check: [
                    "Boolean",
                    "Integer",
                    "FixedPoint",
                    "Address",
                    "Bytes",
                    "String",
                    "Contract",
                    "UserType",
                ],
            },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 290,
        tooltip: "Return a value from a function",
        helpUrl: "",
    },
    {
        type: "solidity_function_type",
        message0: "function type %1 %2 %3 %4",
        args0: [
            {
                type: "input_statement",
                name: "PARAMS",
                check: "Parameter",
            },
            {
                type: "field_dropdown",
                name: "LOCATION",
                options: [
                    ["internal", "internal"],
                    ["external", "external"],
                ],
            },
            {
                type: "field_dropdown",
                name: "MUTABILITY",
                options: [
                    ["", ""],
                    ["pure", "pure"],
                    ["view", "view"],
                    ["payable", "payable"],
                ],
            },
            {
                type: "input_statement",
                name: "RETURNS",
                check: "ReturnParameter",
            },
        ],
        output: "FunctionType",
        colour: 290,
        tooltip: "Function type definition",
        helpUrl: "",
    },
    {
        type: "solidity_function_variable",
        message0: "function variable %1 %2 = %3",
        args0: [
            {
                type: "input_value",
                name: "TYPE",
                check: "FunctionType",
            },
            {
                type: "field_input",
                name: "NAME",
                text: "func",
            },
            {
                type: "input_value",
                name: "VALUE",
                check: ["FunctionType"],
            },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 290,
        tooltip: "Define a function variable to store function references",
        helpUrl: "",
    },
    {
        type: "solidity_function_member",
        message0: "%1 . %2",
        args0: [
            {
                type: "input_value",
                name: "FUNCTION",
                check: "FunctionType",
            },
            {
                type: "field_dropdown",
                name: "MEMBER",
                options: [
                    ["address", "address"],
                    ["selector", "selector"],
                ],
            },
        ],
        output: ["Address", "Bytes4"],
        colour: 290,
        tooltip: "Access function members (address or selector)",
        helpUrl: "",
    },
    {
        type: "solidity_anonymous_function",
        message0: "function %1 %2 %3 %4",
        args0: [
            {
                type: "input_statement",
                name: "PARAMS",
                check: "Parameter",
            },
            {
                type: "field_dropdown",
                name: "MUTABILITY",
                options: [
                    ["", ""],
                    ["pure", "pure"],
                    ["view", "view"],
                ],
            },
            {
                type: "input_statement",
                name: "RETURNS",
                check: "ReturnParameter",
            },
            {
                type: "input_statement",
                name: "BODY",
            },
        ],
        output: "FunctionType",
        colour: 290,
        tooltip: "Anonymous function reference",
        helpUrl: "",
    },
    {
        type: "solidity_function_selector",
        message0: "function selector %1",
        args0: [
            {
                type: "field_input",
                name: "SIGNATURE",
                text: "functionName(uint256,address)",
            },
        ],
        output: "Bytes4",
        colour: 290,
        tooltip: "Get function selector from signature",
        helpUrl: "",
    },
    {
        type: "solidity_this_function",
        message0: "this . %1",
        args0: [
            {
                type: "field_input",
                name: "FUNCTION",
                text: "functionName",
            },
        ],
        output: "FunctionType",
        colour: 290,
        tooltip: "Get external reference to a function of this contract",
        helpUrl: "",
    },
    {
        type: "solidity_function_modifier",
        message0: "modifier %1 %2 %3",
        args0: [
            {
                type: "field_input",
                name: "NAME",
                text: "modifierName",
            },
            {
                type: "input_statement",
                name: "PARAMS",
                check: "Parameter",
            },
            {
                type: "input_statement",
                name: "BODY",
            },
        ],
        colour: 260,
        tooltip: "Define a function modifier",
        helpUrl: "",
        previousStatement: null,
        nextStatement: null,
    },
    {
        type: "solidity_underscore",
        message0: "_",
        previousStatement: null,
        nextStatement: null,
        colour: 260,
        tooltip: "Original function execution point in a modifier",
        helpUrl: "",
    },
    {
        type: "solidity_require",
        message0: "require %1 %2",
        args0: [
            {
                type: "input_value",
                name: "CONDITION",
                check: "Boolean",
            },
            {
                type: "input_value",
                name: "MESSAGE",
                check: "String",
            },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 160,
        tooltip: "Require that a condition is true or revert",
        helpUrl: "",
    },
    {
        type: "solidity_revert",
        message0: "revert %1",
        args0: [
            {
                type: "input_value",
                name: "MESSAGE",
                check: "String",
            },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 160,
        tooltip: "Revert state changes with a message",
        helpUrl: "",
    },
    {
        type: "solidity_assert",
        message0: "assert %1",
        args0: [
            {
                type: "input_value",
                name: "CONDITION",
                check: "Boolean",
            },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 160,
        tooltip: "Assert that a condition is true (for internal errors)",
        helpUrl: "",
    },
]);

// # Events
Blockly.defineBlocksWithJsonArray([
    // ## Event definition
    {
        type: "solidity_event_definition",
        message0: "event %1 %2 %3",
        args0: [
            {
                type: "field_input",
                name: "NAME",
                text: "EventName",
            },
            {
                type: "input_statement",
                name: "PARAMS",
                check: "EventParameter",
            },
            {
                type: "field_checkbox",
                name: "ANONYMOUS",
                checked: false,
            },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 330,
        tooltip: "Define an event",
        helpUrl: "",
    },

    // ## Event parameter
    {
        type: "solidity_event_parameter",
        message0: "parameter %1 %2 %3",
        args0: [
            {
                type: "input_value",
                name: "TYPE",
                check: [
                    "Boolean",
                    "Integer",
                    "FixedPoint",
                    "Address",
                    "Bytes",
                    "String",
                ],
            },
            {
                type: "field_checkbox",
                name: "INDEXED",
                checked: false,
            },
            {
                type: "field_input",
                name: "NAME",
                text: "paramName",
            },
        ],
        previousStatement: "EventParameter",
        nextStatement: "EventParameter",
        colour: 330,
        tooltip: "Event parameter definition",
        helpUrl: "",
    },

    // ## Emit event
    {
        type: "solidity_emit_event",
        message0: "emit %1 %2",
        args0: [
            {
                type: "field_input",
                name: "NAME",
                text: "EventName",
            },
            {
                type: "input_statement",
                name: "ARGS",
                check: "Argument",
            },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 330,
        tooltip: "Emit an event",
        helpUrl: "",
    },
]);

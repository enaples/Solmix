import * as Blockly from "blockly";
import { variableTypes } from "./variable_types";
import "../validators/validators";

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
        extensions: [`${type}_validator`],
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

// # Governor block contract
Blockly.defineBlocksWithJsonArray([
    {
        type: "Governor",
        message0: "SmartContract %1",
        args0: [
            {
                type: "field_input",
                name: "NAME",
                check: "String",
                text: "MyGovernor",
            },
        ],
        message1: "Voting Delay %1",
        args1: [
            {
                type: "field_input",
                name: "voting_delay",
                check: "String",
                text: "1 day",
            },
        ],
        message2: "Voting Period %1",
        args2: [
            {
                type: "field_input",
                name: "voting_period",
                check: "String",
                text: "1 week",
            },
        ],
        message3: "Proposal Threshold %1",
        args3: [
            {
                type: "field_input",
                name: "proposal_threshold",
                text: "0",
            },
        ],
        message4: "Quorum %1",
        args4: [
            {
                type: "field_input",
                name: "quorum",
                text: "4",
            },
        ],
        message5: "Body %1",
        args5: [
            {
                type: "input_statement",
                name: "METHODS",
                check: ["governor_method"], // methods del contratto
            },
        ],
        colour: 160,
        tooltip:
            "Governor smart contract:\n Voting Delay: delay since proposal is created until voting starts.\n Voting period: length of period during which people can cast their vote.\n Proposal threshold: minimum number of votes an account must have to create a proposal.\n Quorum: quorum required for a proposal to pass. ",
    },
    {
        type: "state",
        message0: "State Function",
        previousStatement: [true, "governor_method"],
        nextStatement: [true, "governor_method"],
        colour: 230,
        tooltip: "State Function.", //descrizione funzione
    },
    {
        type: "proposalNeedsQueuing",
        message0: "ProposalNeedsQueuing Function",
        previousStatement: [true, "governor_method"],
        nextStatement: [true, "governor_method"],
        colour: 230,
        tooltip: "ProposalNeedsQueuing Function.", //descrizione funzione
    },
    {
        type: "proposalThreshold",
        message0: "ProposalThreshold Function",
        previousStatement: [true, "governor_method"],
        nextStatement: [true, "governor_method"],
        colour: 230,
        tooltip: "ProposalThreshold Function.", //descrizione funzione
    },
]);

// # ERC20 block contract
Blockly.defineBlocksWithJsonArray([
    {
        type: "erc20",
        message0: "SmartContract %1",
        args0: [
            {
                type: "field_input",
                name: "NAME",
                check: "String",
                text: "MyERC20",
            },
        ],
        message1: "Mintable %1",
        args1: [
            {
                type: "field_dropdown",
                name: "Mintable",
                options: [
                    ["not", "TYPE_NOT"],
                    ["yes", "TYPE_YES"],
                ],
            },
        ],
        message2: "Burnable %1",
        args2: [
            {
                type: "field_dropdown",
                name: "Burnable",
                options: [
                    ["not", "TYPE_NOT"],
                    ["yes", "TYPE_YES"],
                ],
            },
        ],
        message3: "Pausable %1",
        args3: [
            {
                type: "field_dropdown",
                name: "Pausable",
                options: [
                    ["not", "TYPE_NOT"],
                    ["yes", "TYPE_YES"],
                ],
            },
        ],
        message4: "Callback %1",
        args4: [
            {
                type: "field_dropdown",
                name: "Callback",
                options: [
                    ["not", "TYPE_NOT"],
                    ["yes", "TYPE_YES"],
                ],
            },
        ],
        message5: "Permit %1",
        args5: [
            {
                type: "field_dropdown",
                name: "Permit",
                options: [
                    ["yes", "TYPE_YES"],
                    ["not", "TYPE_NOT"],
                ],
            },
        ],
        message6: "Flash Minting %1",
        args6: [
            {
                type: "field_dropdown",
                name: "Flash_Minting",
                options: [
                    ["not", "TYPE_NOT"],
                    ["yes", "TYPE_YES"],
                ],
            },
        ],
        /*"message7" : "Body %1",
  args7: [
    {
      type: "input_statement",
      name: "METHODS",
      check: ["erc20_method"],  // mint, pause, unpause; _update si aggiunge con il pausable.
    }
  ],*/
        colour: 160,
        tooltip:
            "Governor smart contract:\n Voting Delay: delay since proposal is created until voting starts.\n Voting period: length of period during which people can cast their vote.\n Proposal threshold: minimum number of votes an account must have to create a proposal.\n Quorum: quorum required for a proposal to pass. ",
    },
]);

// # Solidity blocks
Blockly.defineBlocksWithJsonArray([
    // ## import block
    {
        type: "import",
        message0: 'import { %1 } from  " %2 "',
        args0: [
            {
                type: "field_input",
                name: "Imp1",
                text: "",
            },
            {
                type: "field_input",
                name: "Imp2",
                text: "",
            },
        ],
        previousStatement: [true, "import"],
        nextStatement: [true, "import"],
        colour: 230,
        tooltip: "Use this block to import a file or a library.",
    },

    // ## contract structure block
    {
        type: "structure",
        message0: "Pragma %1",
        args0: [
            {
                type: "field_input",
                name: "PRAGMA",
            },
        ],
        message1: "Import %1",
        args1: [
            {
                type: "input_statement",
                name: "IMPORT",
                check: "import", // ["define_variable", "define_variables_with_assignment", "define_variable_with_assignment1"]
            },
        ],
        message2: "Contract Block %1",
        args2: [
            {
                type: "input_statement",
                name: "CONTRACT",
                check: "contract", // ["define_variable", "define_variables_with_assignment", "define_variable_with_assignment1"]
            },
        ],
        colour: 350,
        tooltip:
            "This block defines the whole Smart Contract structure (pragma, imports, contract).",
    },

    // ## contract block
    {
        type: "contract",
        message0: "Smart Contract %1 is %2",
        args0: [
            {
                type: "field_input",
                name: "NAME",
                check: "String",
                text: "MyContract",
            },
            {
                type: "field_input",
                name: "IS",
                text: "",
            },
        ],

        // Dummy input per distanziare INIT dal titolo
        message1: "%1",
        args1: [
            {
                type: "input_dummy",
            },
        ],

        // INIT Section con sotto-sezioni ordinate
        message2: "INIT",
        message3: "Variables %1",
        args3: [
            {
                type: "input_statement",
                name: "VARIABLES",
                check: "variableDeclaration_group", // ["define_variable", "define_variables_with_assignment", "define_variable_with_assignment1"]
            },
        ],
        message4: "Structs %1",
        args4: [
            {
                type: "input_statement",
                name: "STRUCTS",
                check: ["contract_structures"],
            },
        ],
        message5: "Mappings %1",
        args5: [
            {
                type: "input_statement",
                name: "MAPPINGS",
                check: ["mapping"],
            },
        ],
        message6: "Events %1",
        args6: [
            {
                type: "input_statement",
                name: "EVENTS",
                check: ["event"],
            },
        ],
        message7: "Arrays %1",
        args7: [
            {
                type: "input_statement",
                name: "ARRAYS",
                check: ["array_group"], //["array", "structs_array"],
            },
        ],
        message8: "Constructor %1",
        args8: [
            {
                type: "input_statement",
                name: "CONSTRUCTOR",
                check: ["contract_constructor"],
            },
        ],
        message9: "Modifiers %1",
        args9: [
            {
                type: "input_statement",
                name: "MODIFIERS",
                check: ["modifier1"],
            },
        ],

        // Dummy input per distanziare il body
        message10: "%1",
        args10: [
            {
                type: "input_dummy",
            },
        ],

        // BODY Section
        message11: "BODY",
        message12: "Methods %1",
        args12: [
            {
                type: "input_statement",
                name: "METHODS",
                check: ["method"],
            },
        ],
        previousStatement: [true, "contract"],
        nextStatement: [true, "contract"],
        colour: 160,
        tooltip: "Declares a new smart contract.",
    },

    // ## struct block
    {
        type: "define_struct_variable_with_assignment",
        message0: "Let struct variable: %1 %2 equal to %3",
        args0: [
            {
                type: "field_input",
                name: "TYPE",
            },
            {
                type: "field_input",
                name: "NAME",
            },
            {
                type: "input_value",
                name: "ASSIGNED_STRUCT",
            },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: "#d9a528",
        tooltip: "Define a new struct and assign values to the attributes.",
        helpUrl: "",
    },

    // ## Array block
    {
        type: "define_arrayVariable",
        message0: "Local array variable: %1 [ ] %2  = new [ %3 ] (%4)",
        args0: [
            {
                type: "field_input",
                name: "TYPE",
                text: "uint",
            },
            {
                type: "field_input",
                name: "NAME",
                text: "arrayName",
            },
            {
                type: "field_input",
                name: "TYPE1",
                text: "uint",
            },
            {
                type: "field_input",
                name: "VALUES",
                text: "/* array_length */",
            },
        ],
        previousStatement: [true, "code"],
        nextStatement: [true, "code"],
        colour: "#237286",
        tooltip:
            "Define a new Array variable inside the function. \n You can also set the array length.",
        helpUrl: "",
    },

    // ## Assign value to array block
    {
        type: "assign_values_to_variable_array",
        message0: "%1[ ] %2 %3 = [%4]",
        args0: [
            {
                type: "field_dropdown",
                name: "TYPE1",
                options: [
                    ["bool", "TYPE_BOOL"],
                    ["int", "TYPE_INT"],
                    ["uint", "TYPE_UINT"],
                    ["uint256", "TYPE_UINT256"],
                    ["uint8", "TYPE_UINT8"],
                    ["string", "TYPE_STRING"],
                    ["address", "TYPE_ADDRESS"],
                    ["bytes32", "TYPE_BYTES32"],
                    ["bytes", "TYPE_BYTES"],
                ],
            },
            {
                type: "field_dropdown",
                name: "TYPE3",
                options: [
                    ["public", "TYPE_PUBLIC"],
                    ["private", "TYPE_PRIVATE"],
                    ["internal", "TYPE_INTERNAL"],
                    ["external", "TYPE_EXTERNAL"],
                ],
            },
            {
                type: "field_input",
                name: "NAME",
                text: "/* insert a name*/",
            },
            {
                type: "field_input",
                name: "VALUES",
                text: "true ",
            },
        ],
        previousStatement: [true, "array_group"],
        nextStatement: [true, "array_group"],
        colour: "#d9a528",
        tooltip: "Define a new Array and assign values.",
        helpUrl: "",
    },

    // ## Define variable
    {
        type: "define_variable",
        message0: "Declare a State variable: %1 ",
        args0: [
            {
                type: "input_value",
                name: "VALUE",
                check: [
                    "Value_Output",
                    "String_Output",
                    "String_Output_Imm",
                    "Value_Output_Imm",
                ],
            },
        ],
        previousStatement: [true, "variableDeclaration_group"],
        nextStatement: [true, "variableDeclaration_group"],
        colour: "#d9a528",
        tooltip: "Declare a State Variable inside this contract.",
        helpUrl: "",
    },

    // ## Define variable with assignment
    {
        type: "define_variable_with_assignment",
        message0: "Declare and Initialise a State variable: %1 equal to %2",
        args0: [
            {
                type: "input_value",
                name: "VALUE",
                check: [
                    "Value_Output",
                    "Value_Output_Imm",
                    "Value_Output_Const",
                ],
            },
            {
                type: "field_input",
                name: "ASSIGNED_VALUE",
            },
        ],
        previousStatement: [true, "variableDeclaration_group"],
        nextStatement: [true, "variableDeclaration_group"],
        colour: "#9ebf22", //#d9a528",
        tooltip:
            "Assign a value to a Int, Bool, Uint, Uint8 or Uint256 variable.",
        helpUrl: "",
    },

    // ## Define variable with assignment1
    {
        type: "define_variable_with_assignment1",
        message0: 'Declare and Initialise a State variable: %1 equal to "%2" ',
        args0: [
            {
                type: "input_value",
                name: "VALUE",
                check: [
                    "String_Output",
                    "String_Output_Imm",
                    "String_Output_Const",
                ],
            },
            {
                type: "field_input",
                name: "ASSIGNED_VALUE",
            },
        ],
        previousStatement: [true, "variableDeclaration_group"],
        nextStatement: [true, "variableDeclaration_group"],
        colour: "#9ebf22", //#d9a528",
        tooltip: "Assign a value to a String, Address or Bytes variable.",
        helpUrl: "",
    },

    // ## input variable
    {
        type: "input",
        message0: " %1 ",
        args0: [
            {
                type: "field_input",
                name: "input_name",
            },
        ],
        output: [true, "input"],
        colour: 160,
        tooltip: "Crea una input con il nome specificato nei parametri", // Tooltip per l'utente,
        helpUrl: "",
    },

    // ## Input right
    {
        type: "input_right",
        message0: " %1 ",
        args0: [
            {
                type: "field_input",
                name: "input_name",
            },
        ],
        output: [true, "input"],
        colour: 160,
        tooltip: "Crea una input con il nome specificato nei parametri", // Tooltip per l'utente,
        helpUrl: "",
    },

    // # return block
    {
        type: "return_block",
        message0: " return %1 ", //ho tolto le ""
        args0: [
            {
                type: "field_input",
                name: "input_name",
            },
        ],
        previousStatement: [true, "code"],
        nextStatement: [true, "code"],
        colour: 230,
        tooltip: "Use this block to return a specific value.", // Tooltip per l'utente,
        helpUrl: "",
    },

    // ## input somma
    {
        type: "input_somma",
        message0: ' " %1 + %2 "',
        args0: [
            {
                type: "field_input",
                name: "input_name",
            },
            {
                type: "field_input",
                name: "input_increment",
            },
        ],
        output: null,
        colour: 160,
        tooltip: "It performs the sum of two values.", // Tooltip per l'utente,
        helpUrl: "",
    },

    // # input diff
    {
        type: "input_diff",
        message0: ' " %1 - %2"',
        args0: [
            {
                type: "field_input",
                name: "input_name",
            },
            {
                type: "field_input",
                name: "input_decrement",
            },
        ],
        output: null,
        colour: 160,
        tooltip: "It performs the subtraction between two values.", // Tooltip per l'utente,
        helpUrl: "",
    },

    // # address zero
    {
        type: "address_zero",
        message0: "address(0)",
        output: "Address",
        colour: 170,
        tooltip: "This block represents the address zero.",
        helpUrl: "",
    },

    // # address.this
    {
        type: "address_this",
        message0: "address(this)",
        output: "Address",
        colour: 170,
        tooltip: "This block represents the address of the current contract.",
        helpUrl: "",
    },

    // # address msg.sender
    {
        type: "address_msg_sender",
        message0: "msg.sender",
        output: "Address",
        colour: 170,
        tooltip:
            "This block represents the address of the sender of the transaction.",
        helpUrl: "",
    },

    // # address msg.value
    {
        type: "address_msg_value",
        message0: "msg.value",
        output: "Address",
        colour: 170,
        tooltip: "This block represents the value of the transaction.",
        helpUrl: "",
    },

    // # address msg.data
    {
        type: "address_msg_data",
        message0: "msg.data",
        output: "Address",
        colour: 170,
        tooltip: "This block represents the data of the transaction.",
        helpUrl: "",
    },

    // # address msg.balance
    {
        type: "address_this_balance",
        message0: "address(this).balance",
        output: "Number",
        colour: 170,
        tooltip:
            "This block represents the amount of ETH (in wei) owned by the contract.",
        helpUrl: "",
    },
]);

// # Solidity data type blocks
Blockly.defineBlocksWithJsonArray([
    // ## Variables
    {
        type: "contract_variables",
        message0: "let %1 %2 %3",
        args0: [
            {
                type: "field_dropdown",
                name: "TYPE",
                options: [
                    ["bool", "TYPE_BOOL"],
                    ["int", "TYPE_INT"],
                    ["uint", "TYPE_UINT"],
                    ["uint256", "TYPE_UINT256"],
                    ["uint8", "TYPE_UINT8"],
                    ["string", "TYPE_STRING"],
                    ["address", "TYPE_ADDRESS"],
                    ["bytes32", "TYPE_BYTES32"],
                    ["bytes", "TYPE_BYTES"],
                ],
            },
            {
                type: "field_dropdown",
                name: "TYPE3",
                options: [
                    ["public", "TYPE_PUBLIC"],
                    ["private", "TYPE_PRIVATE"],
                    ["internal", "TYPE_INTERNAL"],
                    ["external", "TYPE_EXTERNAL"],
                ],
            },
            {
                type: "field_input",
                name: "NAME",
                text: "s",
            },
        ],
        previousStatement: false,
        nextStatement: false,
        colour: 195,
        tooltip: "",
        helpUrl: "",
    },

    // # Function input
    {
        type: "func_inputs",
        message0: "%1 %2",
        args0: [
            {
                type: "field_dropdown",
                name: "TYPE",
                options: [
                    ["bool", "TYPE_BOOL"],
                    ["int", "TYPE_INT"],
                    ["uint", "TYPE_UINT"],
                    ["uint256", "TYPE_UINT256"],
                    ["uint8", "TYPE_UINT8"],
                    ["string", "TYPE_STRING"],
                    ["address", "TYPE_ADDRESS"],
                    ["bytes32", "TYPE_BYTES32"],
                    ["bytes", "TYPE_BYTES"],
                ],
            },
            {
                type: "field_input",
                name: "NAME",
                text: "s",
            },
        ],
        previousStatement: [true, "input"],
        nextStatement: [true, "input"],
        colour: 330, //330,
        tooltip: "Define the input parameters of the function.",
        helpUrl: "",
    },

    // ## Function return values
    {
        type: "func_returnValues",
        message0: "%1 %2",
        args0: [
            {
                type: "field_dropdown",
                name: "TYPE",
                options: [
                    ["bool", "TYPE_BOOL"],
                    ["int", "TYPE_INT"],
                    ["uint", "TYPE_UINT"],
                    ["uint256", "TYPE_UINT256"],
                    ["uint8", "TYPE_UINT8"],
                    ["string", "TYPE_STRING"],
                    ["address", "TYPE_ADDRESS"],
                    ["bytes32", "TYPE_BYTES32"],
                    ["bytes", "TYPE_BYTES"],
                ],
            },
            {
                type: "field_input",
                name: "NAME",
                text: "r",
            },
        ],
        previousStatement: [true, "returnValue"],
        nextStatement: [true, "returnValue"],
        colour: "#E75480", //330, //330,
        tooltip: "Define the return values of the function.",
        helpUrl: "",
    },

    // ## Solidity array
    {
        type: "array",
        message0: "%1[ ] %2 %3",
        args0: [
            {
                type: "field_dropdown",
                name: "TYPE1",
                options: [
                    ["bool", "TYPE_BOOL"],
                    ["int", "TYPE_INT"],
                    ["uint", "TYPE_UINT"],
                    ["uint256", "TYPE_UINT256"],
                    ["uint8", "TYPE_UINT8"],
                    ["string", "TYPE_STRING"],
                    ["address", "TYPE_ADDRESS"],
                    ["bytes32", "TYPE_BYTES32"],
                    ["bytes", "TYPE_BYTES"],
                ],
            },
            {
                type: "field_dropdown",
                name: "TYPE3",
                options: [
                    ["public", "TYPE_PUBLIC"],
                    ["private", "TYPE_PRIVATE"],
                    ["internal", "TYPE_INTERNAL"],
                    ["external", "TYPE_EXTERNAL"],
                ],
            },
            {
                type: "field_input",
                name: "NAME",
                text: "/* insert a name*/",
            },
        ],
        previousStatement: [true, "array_group"],
        nextStatement: [true, "array_group"],
        colour: 450,
        tooltip: "Define a new array.",
        helpUrl: "",
    },

    // ## Mappings
    {
        type: "mapping",
        message0: "mapping (%1 => %2) %3 %4 ",
        args0: [
            {
                type: "field_dropdown",
                name: "TYPE1",
                options: [
                    ["bool", "TYPE_BOOL"],
                    ["int", "TYPE_INT"],
                    ["uint", "TYPE_UINT"],
                    ["uint256", "TYPE_UINT256"],
                    ["uint8", "TYPE_UINT8"],
                    ["string", "TYPE_STRING"],
                    ["address", "TYPE_ADDRESS"],
                    ["bytes32", "TYPE_BYTES32"],
                    ["bytes", "TYPE_BYTES"],
                ],
            },
            {
                type: "field_dropdown",
                name: "TYPE2",
                options: [
                    ["bool", "TYPE_BOOL"],
                    ["int", "TYPE_INT"],
                    ["uint", "TYPE_UINT"],
                    ["uint256", "TYPE_UINT256"],
                    ["uint8", "TYPE_UINT8"],
                    ["string", "TYPE_STRING"],
                    ["address", "TYPE_ADDRESS"],
                    ["bytes32", "TYPE_BYTES32"],
                    ["bytes", "TYPE_BYTES"],
                ],
            },
            {
                type: "field_dropdown",
                name: "TYPE3",
                options: [
                    ["public", "TYPE_PUBLIC"],
                    ["private", "TYPE_PRIVATE"],
                    ["internal", "TYPE_INTERNAL"],
                    ["external", "TYPE_EXTERNAL"],
                ],
            },
            {
                type: "field_input",
                name: "NAME",
                text: "/* insert a name*/",
            },
        ],
        previousStatement: "mapping",
        nextStatement: "mapping",
        colour: "FE0000",
        tooltip: "Define a Solidity Mapping",
        helpUrl: "",
    },
]);

// # Solidity Events

Blockly.defineBlocksWithJsonArray([
    // ## Event
    {
        type: "event",
        message0: "event %1 %2",
        args0: [
            {
                type: "field_input",
                name: "NAME",
                check: "String",
                text: "/* insert a name*/",
            },
            {
                type: "input_dummy",
            },
        ],
        message1: "Parameters %1",
        args1: [
            {
                type: "input_statement",
                name: "PARAMS",
                check: "input",
                align: "RIGHT",
            },
        ],
        previousStatement: "event",
        nextStatement: "event",
        colour: "#FFB280",
        tooltip: "Definition of a Solidity Event",
        helpUrl: "",
    },
]);

// # Solidity constructor
Blockly.defineBlocksWithJsonArray([
    {
        type: "contract_constructor",
        message0: "Constructor %1",
        args0: [
            {
                type: "input_statement",
                name: "PARAMS",
                align: "RIGHT",
                check: "input",
            },
        ],
        message1: "Modifiers %1",
        args1: [
            {
                type: "field_input",
                name: "MODIFIERS",
            },
        ],
        message2: "Code %1",
        args2: [
            {
                type: "input_statement",
                name: "STACK",
                align: "RIGHT",
                check: ["code", "if"],
            },
        ],
        colour: "77DD77", //290,
        previousStatement: [true, "contract_constructor"],
        nextStatement: [true, "contract_constructor"],
        tooltip: "Define a contract constructor",
        helpUrl: "",
    },
]);

// # Logic blocks
Blockly.defineBlocksWithJsonArray([
    // ## if block container
    {
        type: "if_container",
        message0: "if %1 %2",
        args0: [
            {
                type: "input_statement",
                name: "IF",
            },
            {
                type: "input_dummy",
            },
        ],
        mutator: "controls_if_mutator",
        style: "logic_blocks",
    },

    // ## if-else block container
    {
        type: "if_else_container",
        message0: "IF section %1",
        args0: [
            {
                type: "input_statement",
                name: "IF",
                check: "if",
            },
        ],
        message1: "ELSE section %1",
        args1: [
            {
                type: "input_statement",
                name: "ELSE",
                check: "else",
            },
        ],
        previousStatement: [true, "code"],
        nextStatement: [true, "code"],
        tooltip: "Use this block to contain if and else conditions.",
        helpUrl: "",
        style: "logic_blocks",
    },

    // ## if-else-if-else block container
    {
        type: "if_elseif_else_container",
        message0: "IF section %1",
        args0: [
            {
                type: "input_statement",
                name: "IF",
                check: "if",
            },
        ],
        message1: " ELSE IF section %1",
        args1: [
            {
                type: "input_statement",
                name: "ELSE_IF",
                check: "elseIf",
            },
        ],
        message2: "ELSE section %1",
        args2: [
            {
                type: "input_statement",
                name: "ELSE",
                check: "else",
            },
        ],
        previousStatement: [true, "code"],
        nextStatement: [true, "code"],
        tooltip: "Use this block to contain if, else if, and else conditions.",
        helpUrl: "",
        style: "logic_blocks",
    },

    // ## if block
    {
        type: "if",
        message0: "if %1",
        args0: [
            {
                type: "input_value",
                name: "IF",
            },
        ],
        message1: "do %1",
        args1: [
            {
                type: "input_statement",
                name: "DO",
                check: "code",
            },
        ],
        previousStatement: [true, ["if", "code"]],
        nextStatement: [true, ["if", "code"]],
        colour: 330,
        tooltip: "If block.",
        helpUrl: "",
    },

    // ## else if block
    {
        type: "else_if",
        message0: " else if %1",
        args0: [
            {
                type: "input_value",
                name: "ELSE_IF",
            },
        ],
        message1: "do %1",
        args1: [
            {
                type: "input_statement",
                name: "DO",
                check: "code",
            },
        ],
        previousStatement: [true, "elseIf"],
        nextStatement: [true, "elseIf"],
        colour: 330,
        tooltip: "Else if block.",
        helpUrl: "",
    },

    // ## else block
    {
        type: "else",
        message0: "else %1",
        args0: [
            {
                type: "input_statement",
                name: "DO",
                check: "code",
            },
        ],
        previousStatement: [true, "else"],
        nextStatement: [true, "else"],
        colour: 330,
        tooltip: "Else block.",
        helpUrl: "",
    },
]);

// # Black block
Blockly.defineBlocksWithJsonArray([
    // ## unknown code to parse in blockly

    {
        type: "unknownCode",
        message0: "Black Block: %1",
        args0: [
            {
                type: "field_input",
                name: "CODE",
                text: "// unsupported node",
            },
        ],
        previousStatement: [true, "code"],
        nextStatement: [true, "code"],
        colour: 60, // nero/grigio
        tooltip: "Solidity Code not supported by a defined block.",
        helpUrl: "",
    },
]);

// # Solidity function blocks
Blockly.defineBlocksWithJsonArray([
    // ## Internal function
    {
        type: "internalFunc",
        message0: "Internal Function %1",
        args0: [
            {
                type: "field_input",
                name: "CODE",
            },
        ],
        previousStatement: [true, "code"], //null, //poi sarà quello dei blocchi da inserire in code del method
        nextStatement: [true, "code"], // [true, "else"],
        colour: 300,
        tooltip: "Internal Function block.",
        helpUrl: "",
    },

    // ## Value assignment code block
    {
        type: "internalAss",
        message0: "Assigning Values: %1",
        args0: [
            {
                type: "field_input",
                name: "CODE",
            },
        ],
        previousStatement: [true, "code"], //null, //poi sarà quello dei blocchi da inserire in code del method
        nextStatement: [true, "code"], // [true, "else"],
        colour: 300,
        tooltip: "Value Assigment code block.",
        helpUrl: "",
    },

    // ## local variables
    {
        type: "localVariable",
        message0: "Local Variable: %1",
        args0: [
            {
                type: "field_input",
                name: "CODE",
            },
        ],
        previousStatement: [true, "code"], //null, //poi sarà quello dei blocchi da inserire in code del method
        nextStatement: [true, "code"], // [true, "else"],
        colour: 300,
        tooltip:
            "Use this block to define a local Variable.\n You can also assign a value to the Variable.",
        helpUrl: "",
    },

    // ## Method block
    {
        type: "method",
        message0:
            "Function %1 Access %2 Override(%3) Payable? %4 View? %5 Pure? %6 Modifiers %7 Return? %8", //Type ( %8 , %9 )",
        args0: [
            {
                type: "field_input",
                name: "NAME",
                check: "String",
                text: "MyFunction",
            },
            {
                type: "field_dropdown",
                name: "ACCESS",
                options: [
                    ["public", "TYPE_PUBLIC"],
                    ["private", "TYPE_PRIVATE"],
                    ["internal", "TYPE_INTERNAL"],
                    ["external", "TYPE_EXTERNAL"],
                ],
            },
            {
                type: "field_input",
                name: "OVERRIDE",
                text: "",
            },
            {
                type: "field_dropdown",
                name: "PAYABLE",
                options: [
                    ["no", "TYPE_FALSE"],
                    ["yes", "TYPE_YES"],
                ],
            },
            {
                type: "field_dropdown",
                name: "VIEW",
                options: [
                    ["no", "TYPE_FALSE"],
                    ["yes", "TYPE_YES"],
                ],
            },
            {
                type: "field_dropdown",
                name: "PURE",
                options: [
                    ["no", "TYPE_FALSE"],
                    ["yes", "TYPE_YES"],
                ],
            },
            {
                type: "input_value",
                name: "MODIFIERS",
                check: "variables_get_modifiers",
            },
            {
                type: "field_dropdown",
                name: "RETURN",
                options: [
                    ["no", "TYPE_FALSE"],
                    ["yes", "TYPE_YES"],
                ],
            },
        ],
        message1: "Parameters %1",
        args1: [
            {
                type: "input_statement",
                name: "PARAMS",
                align: "RIGHT",
                check: "input",
            },
        ],
        message2: "Return Values %1",
        args2: [
            {
                type: "input_statement",
                name: "RETURN_VALUES",
                align: "RIGHT",
                check: "returnValue",
            },
        ],
        message3: "CODE %1 Require %2 Code %3",
        args3: [
            {
                type: "input_dummy",
            },
            {
                type: "input_statement",
                name: "REQUIRE",
                align: "RIGHT",
                check: "requireCondition",
            },
            {
                type: "input_statement",
                name: "STACK",
                align: "RIGHT",
                check: ["code", "if"],
            },
        ],
        previousStatement: false,
        nextStatement: false,
        colour: "#003399",
        tooltip: "Defines a function.",
        helpUrl: "",
    },

    // ## Modifier
    {
        type: "modifier",
        message0: "Modifier %1",
        args0: [
            {
                type: "field_input",
                name: "NAME",
                check: "String",
                text: "MyModifier",
            },
        ],
        message1: "Parameters %1",
        args1: [
            {
                type: "input_statement",
                name: "PARAMS",
                align: "RIGHT",
                check: "input",
            },
        ],
        message2: "Require condition %1",
        args2: [
            {
                type: "input_statement",
                name: "STACK",
                align: "RIGHT",
            },
        ],
        previousStatement: false,
        nextStatement: false,
        colour: 330,
        tooltip: "",
        helpUrl: "",
    },

    // ## Modifier1
    {
        type: "modifier1",
        message0: "Modifier %1",
        args0: [
            {
                type: "field_input",
                name: "NAME",
                check: "String",
                text: "/* insert a name*/",
            },
        ],
        message1: "Parameters %1",
        args1: [
            {
                type: "input_statement",
                name: "PARAMS",
                align: "RIGHT",
                check: "input",
            },
        ],
        message2: "Require condition %1",
        args2: [
            {
                type: "input_value",
                name: "CONDITION",
                //check: "Boolean",
                align: "RIGHT",
            },
        ],
        message3: "Message %1",
        args3: [
            {
                type: "field_input",
                name: "MESSAGE",
                check: "String",
                text: "MyMessage",
            },
        ],
        previousStatement: "modifier1",
        nextStatement: "modifier1",
        colour: 230,
        tooltip: "",
        helpUrl: "",
    },

    // ## require condition method1
    {
        type: "require_condition_method1",
        message0: "Require condition %1",
        args0: [
            {
                type: "input_value",
                name: "CONDITION",
                align: "RIGHT",
            },
        ],
        message1: "Message %1",
        args1: [
            {
                type: "field_input",
                name: "MESSAGE",
                check: "String",
                text: "MyMessage",
            },
        ],
        previousStatement: [true, "requireCondition"],
        nextStatement: [true, "requireCondition"],
        colour: 330,
        tooltip:
            "Define a condition to be satisfied in order to execute the following code.",
        helpUrl: "",
    },

    // ## binary operator
    {
        type: "binary_operation",
        message0: "%1 %2 %3",
        args0: [
            {
                type: "input_value",
                name: "LEFT_OPERAND",
            },
            {
                type: "field_dropdown",
                name: "OPERATOR",
                options: [
                    ["==", "EQ"],
                    ["!=", "NEQ"],
                    ["<", "LT"],
                    ["<=", "LTE"],
                    [">", "GT"],
                    [">=", "GTE"],
                ],
            },
            {
                type: "input_value",
                name: "RIGHT_OPERAND",
            },
        ],
        inputsInline: true,
        output: "Boolean",
        colour: 210,
        tooltip: "Binary operation",
        helpUrl: "",
    },

    // ## require condition
    {
        type: "require_condition",
        message0: "Condition %1",
        args0: [
            {
                type: "field_dropdown",
                name: "OPERATOR",
                options: [
                    ["! %1", "NOT"],
                    ["%1 !== %2", "NOT_EQUAL"],
                    ["%1 == %2", "EQUAL"],
                    ["%1 >= %2", "BIGGER OR EQUAL TO"],
                    ["%1 <= %2", "LOWER OR EQUAL TO"],
                    ["%1 > %2", "BIGGER THAN"],
                    ["%1 < %2", "LOWER THAN"],
                ],
            },
        ],
        message1: "Left operand %1",
        args1: [
            {
                type: "input_value",
                name: "LEFT",
                check: [
                    "String_Output",
                    "Value_Output",
                    "String_Output_Imm",
                    "String_Output_Const",
                    "Value_Output_Imm",
                    "Value_Output_Const",
                    "input",
                ],
            },
        ],
        message2: "Right operand (if needed) %1",
        args2: [
            {
                type: "input_value",
                name: "RIGHT",
                check: [
                    "String_Output",
                    "Value_Output",
                    "String_Output_Imm",
                    "String_Output_Const",
                    "Value_Output_Imm",
                    "Value_Output_Const",
                    "input",
                ],
            },
        ],
        output: "Boolean",
        colour: 330, //"#FFFF00",//230,
        tooltip: "Define a condition for require",
        helpUrl: "",
    },

    // ## require condition merhod
    {
        type: "require_condition_method",
        message0: "Condition %1",
        args0: [
            {
                type: "field_dropdown",
                name: "OPERATOR",
                options: [
                    ["! %1", "NOT"],
                    ["%1 !== %2", "NOT_EQUAL"],
                    ["%1 == %2", "EQUAL"],
                    ["%1 >= %2", "BIGGER OR EQUAL TO"],
                ],
            },
        ],
        message1: "Left operand %1",
        args1: [
            {
                type: "input_value",
                name: "LEFT",
                //check: "String"
            },
        ],
        message2: "Right operand (if needed) %1",
        args2: [
            {
                type: "input_value",
                name: "RIGHT",
                //check: "String"
            },
        ],
        //output: "Boolean",
        previousStatement: "require_condition_method", //false ,
        nextStatement: "require_condition_method", //false
        colour: 230,
        tooltip: "Define a condition for require",
        helpUrl: "",
    },
]);

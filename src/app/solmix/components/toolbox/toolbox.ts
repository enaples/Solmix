/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/*
This toolbox contains nearly every single built-in block that Blockly offers,
in addition to the custom block 'add_text' this sample app adds.
You probably don't need every single block, and should consider either rewriting
your toolbox from scratch, or carefully choosing whether you need each block
listed here.
*/
import { variableTypes } from "../blocks/variable_types";

export const blocklyToolbox = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "category",
            name: "Structures",
            colour: "#5C68A6",
            contents: [
                {
                    kind: "block",
                    type: "solidity_type_enum",
                },
                {
                    kind: "block",
                    type: "solidity_type_enum_value",
                },
            ],
        },
        {
            kind: "category",
            name: "Values",
            colour: "#5BA58C",
            contents: Object.keys(variableTypes).map((type: string) => ({
                kind: "block",
                type: `solidity_${type}`,
            })),
        },
        // {
        //     kind: "category",
        //     name: "Operators",
        //     colour: "#A55B5B",
        //     contents: [
        //         {
        //             kind: "block",
        //             type: "solidity_operator_bool",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_operator_not",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_operator_int",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_operator_comparison",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_unchecked_block",
        //         },
        //     ],
        // },
        // {
        //     kind: "category",
        //     name: "Functions",
        //     colour: "#995BA5",
        //     contents: [
        //         {
        //             kind: "block",
        //             type: "solidity_function_definition",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_function_parameter",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_function_return",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_return_statement",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_function_call",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_function_call_with_options",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_function_argument",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_function_type",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_function_variable",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_function_member",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_anonymous_function",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_function_selector",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_this_function",
        //         },
        //     ],
        // },
        // {
        //     kind: "category",
        //     name: "Modifiers & Control",
        //     colour: "#5B67A5",
        //     contents: [
        //         {
        //             kind: "block",
        //             type: "solidity_function_modifier",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_underscore",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_require",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_revert",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_assert",
        //         },
        //     ],
        // },
        // {
        //     kind: "category",
        //     name: "Events",
        //     colour: "#A5995B",
        //     contents: [
        //         {
        //             kind: "block",
        //             type: "solidity_event_definition",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_event_parameter",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_emit_event",
        //         },
        //     ],
        // },
        // {
        //     kind: "category",
        //     name: "Address Operations",
        //     colour: "#5BA55B",
        //     contents: [
        //         {
        //             kind: "block",
        //             type: "solidity_address_member",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_address_method",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_address_call_options",
        //         },
        //     ],
        // },
        // {
        //     kind: "category",
        //     name: "Encoding",
        //     colour: "#A5675B",
        //     contents: [
        //         {
        //             kind: "block",
        //             type: "solidity_encoding_functions",
        //         },
        //     ],
        // },
        // {
        //     kind: "category",
        //     name: "Logic",
        //     categorystyle: "logic_category",
        //     contents: [
        //         {
        //             kind: "block",
        //             type: "controls_if",
        //         },
        //         {
        //             kind: "block",
        //             type: "logic_compare",
        //         },
        //         {
        //             kind: "block",
        //             type: "logic_operation",
        //         },
        //         {
        //             kind: "block",
        //             type: "logic_negate",
        //         },
        //         {
        //             kind: "block",
        //             type: "logic_boolean",
        //         },
        //         {
        //             kind: "block",
        //             type: "logic_null",
        //         },
        //         {
        //             kind: "block",
        //             type: "logic_ternary",
        //         },
        //     ],
        // },
        // {
        //     kind: "category",
        //     name: "Loops",
        //     categorystyle: "loop_category",
        //     contents: [
        //         {
        //             kind: "block",
        //             type: "controls_repeat_ext",
        //             inputs: {
        //                 TIMES: {
        //                     shadow: {
        //                         type: "math_number",
        //                         fields: {
        //                             NUM: 10,
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "controls_whileUntil",
        //         },
        //         {
        //             kind: "block",
        //             type: "controls_for",
        //             inputs: {
        //                 FROM: {
        //                     shadow: {
        //                         type: "math_number",
        //                         fields: {
        //                             NUM: 1,
        //                         },
        //                     },
        //                 },
        //                 TO: {
        //                     shadow: {
        //                         type: "math_number",
        //                         fields: {
        //                             NUM: 10,
        //                         },
        //                     },
        //                 },
        //                 BY: {
        //                     shadow: {
        //                         type: "math_number",
        //                         fields: {
        //                             NUM: 1,
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "controls_forEach",
        //         },
        //         {
        //             kind: "block",
        //             type: "controls_flow_statements",
        //         },
        //     ],
        // },
        // {
        //     kind: "category",
        //     name: "Math",
        //     categorystyle: "math_category",
        //     contents: [
        //         {
        //             kind: "block",
        //             type: "math_number",
        //             fields: {
        //                 NUM: 123,
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "math_arithmetic",
        //             inputs: {
        //                 A: {
        //                     shadow: {
        //                         type: "math_number",
        //                         fields: {
        //                             NUM: 1,
        //                         },
        //                     },
        //                 },
        //                 B: {
        //                     shadow: {
        //                         type: "math_number",
        //                         fields: {
        //                             NUM: 1,
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "math_single",
        //             inputs: {
        //                 NUM: {
        //                     shadow: {
        //                         type: "math_number",
        //                         fields: {
        //                             NUM: 9,
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "math_trig",
        //             inputs: {
        //                 NUM: {
        //                     shadow: {
        //                         type: "math_number",
        //                         fields: {
        //                             NUM: 45,
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "math_constant",
        //         },
        //         {
        //             kind: "block",
        //             type: "math_number_property",
        //             inputs: {
        //                 NUMBER_TO_CHECK: {
        //                     shadow: {
        //                         type: "math_number",
        //                         fields: {
        //                             NUM: 0,
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "math_round",
        //             fields: {
        //                 OP: "ROUND",
        //             },
        //             inputs: {
        //                 NUM: {
        //                     shadow: {
        //                         type: "math_number",
        //                         fields: {
        //                             NUM: 3.1,
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "math_on_list",
        //             fields: {
        //                 OP: "SUM",
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "math_modulo",
        //             inputs: {
        //                 DIVIDEND: {
        //                     shadow: {
        //                         type: "math_number",
        //                         fields: {
        //                             NUM: 64,
        //                         },
        //                     },
        //                 },
        //                 DIVISOR: {
        //                     shadow: {
        //                         type: "math_number",
        //                         fields: {
        //                             NUM: 10,
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "math_constrain",
        //             inputs: {
        //                 VALUE: {
        //                     shadow: {
        //                         type: "math_number",
        //                         fields: {
        //                             NUM: 50,
        //                         },
        //                     },
        //                 },
        //                 LOW: {
        //                     shadow: {
        //                         type: "math_number",
        //                         fields: {
        //                             NUM: 1,
        //                         },
        //                     },
        //                 },
        //                 HIGH: {
        //                     shadow: {
        //                         type: "math_number",
        //                         fields: {
        //                             NUM: 100,
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "math_random_int",
        //             inputs: {
        //                 FROM: {
        //                     shadow: {
        //                         type: "math_number",
        //                         fields: {
        //                             NUM: 1,
        //                         },
        //                     },
        //                 },
        //                 TO: {
        //                     shadow: {
        //                         type: "math_number",
        //                         fields: {
        //                             NUM: 100,
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "math_random_float",
        //         },
        //         {
        //             kind: "block",
        //             type: "math_atan2",
        //             inputs: {
        //                 X: {
        //                     shadow: {
        //                         type: "math_number",
        //                         fields: {
        //                             NUM: 1,
        //                         },
        //                     },
        //                 },
        //                 Y: {
        //                     shadow: {
        //                         type: "math_number",
        //                         fields: {
        //                             NUM: 1,
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //     ],
        // },
        // {
        //     kind: "category",
        //     name: "Text",
        //     categorystyle: "text_category",
        //     contents: [
        //         {
        //             kind: "block",
        //             type: "text",
        //         },
        //         {
        //             kind: "block",
        //             type: "text_join",
        //         },
        //         {
        //             kind: "block",
        //             type: "text_append",
        //             inputs: {
        //                 TEXT: {
        //                     shadow: {
        //                         type: "text",
        //                         fields: {
        //                             TEXT: "",
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "text_length",
        //             inputs: {
        //                 VALUE: {
        //                     shadow: {
        //                         type: "text",
        //                         fields: {
        //                             TEXT: "abc",
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "text_isEmpty",
        //             inputs: {
        //                 VALUE: {
        //                     shadow: {
        //                         type: "text",
        //                         fields: {
        //                             TEXT: "",
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "text_indexOf",
        //             inputs: {
        //                 VALUE: {
        //                     block: {
        //                         type: "variables_get",
        //                     },
        //                 },
        //                 FIND: {
        //                     shadow: {
        //                         type: "text",
        //                         fields: {
        //                             TEXT: "abc",
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "text_charAt",
        //             inputs: {
        //                 VALUE: {
        //                     block: {
        //                         type: "variables_get",
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "text_getSubstring",
        //             inputs: {
        //                 STRING: {
        //                     block: {
        //                         type: "variables_get",
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "text_changeCase",
        //             inputs: {
        //                 TEXT: {
        //                     shadow: {
        //                         type: "text",
        //                         fields: {
        //                             TEXT: "abc",
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "text_trim",
        //             inputs: {
        //                 TEXT: {
        //                     shadow: {
        //                         type: "text",
        //                         fields: {
        //                             TEXT: "abc",
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "text_count",
        //             inputs: {
        //                 SUB: {
        //                     shadow: {
        //                         type: "text",
        //                     },
        //                 },
        //                 TEXT: {
        //                     shadow: {
        //                         type: "text",
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "text_replace",
        //             inputs: {
        //                 FROM: {
        //                     shadow: {
        //                         type: "text",
        //                     },
        //                 },
        //                 TO: {
        //                     shadow: {
        //                         type: "text",
        //                     },
        //                 },
        //                 TEXT: {
        //                     shadow: {
        //                         type: "text",
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "text_reverse",
        //             inputs: {
        //                 TEXT: {
        //                     shadow: {
        //                         type: "text",
        //                     },
        //                 },
        //             },
        //         },
        //     ],
        // },
        // {
        //     kind: "category",
        //     name: "Lists",
        //     categorystyle: "list_category",
        //     contents: [
        //         {
        //             kind: "block",
        //             type: "lists_create_with",
        //         },
        //         {
        //             kind: "block",
        //             type: "lists_create_with",
        //         },
        //         {
        //             kind: "block",
        //             type: "lists_repeat",
        //             inputs: {
        //                 NUM: {
        //                     shadow: {
        //                         type: "math_number",
        //                         fields: {
        //                             NUM: 5,
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "lists_length",
        //         },
        //         {
        //             kind: "block",
        //             type: "lists_isEmpty",
        //         },
        //         {
        //             kind: "block",
        //             type: "lists_indexOf",
        //             inputs: {
        //                 VALUE: {
        //                     block: {
        //                         type: "variables_get",
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "lists_getIndex",
        //             inputs: {
        //                 VALUE: {
        //                     block: {
        //                         type: "variables_get",
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "lists_setIndex",
        //             inputs: {
        //                 LIST: {
        //                     block: {
        //                         type: "variables_get",
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "lists_getSublist",
        //             inputs: {
        //                 LIST: {
        //                     block: {
        //                         type: "variables_get",
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "lists_split",
        //             inputs: {
        //                 DELIM: {
        //                     shadow: {
        //                         type: "text",
        //                         fields: {
        //                             TEXT: ",",
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             kind: "block",
        //             type: "lists_sort",
        //         },
        //         {
        //             kind: "block",
        //             type: "lists_reverse",
        //         },
        //     ],
        // },
        // {
        //     kind: "sep",
        // },
        // {
        //     kind: "category",
        //     name: "Variables",
        //     categorystyle: "variable_category",
        //     custom: "VARIABLE_DYNAMIC",
        // },
        {
            kind: "category",
            name: "Variables",
            categorystyle: "variable_category",
            custom: "SOLIDITY_TYPE",
        },
        // {
        //     kind: "category",
        //     name: "Functions",
        //     categorystyle: "procedure_category",
        //     custom: "PROCEDURE",
        // },
    ],
};

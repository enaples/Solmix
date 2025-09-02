// import { variableTypes } from "../blocks/variable_types";

export const blocklyToolbox = {
    kind: "categoryToolbox",
    categoryStyle: "logic_category",
    contents: [
        // {
        //     kind: "category",
        //     name: "Structures",
        //     colour: "#5C68A6",
        //     contents: [
        //         {
        //             kind: "block",
        //             type: "solidity_type_enum",
        //         },
        //         {
        //             kind: "block",
        //             type: "solidity_type_enum_value",
        //         },
        //     ],
        // },
        // {
        //     kind: "category",
        //     name: "Values",
        //     colour: "#5BA58C",
        //     contents: Object.keys(variableTypes).map((type: string) => ({
        //         kind: "block",
        //         type: `solidity_${type}`,
        //     })),
        // },

        // {
        //     kind: "category",
        //     name: "Variables",
        //     categorystyle: "variable_category",
        //     custom: "SOLIDITY_TYPE",
        // },

        // # Category "Smart Contract Blocks"
        {
            kind: "category",
            name: "Smart Contract Basic Blocks",
            //colour: "#6456BF",
            contents: [
                {
                     kind: "block",
                     type: "structure",
                },
                {
                     kind: "block",
                     type: "import",
                 },
                {
                     kind: "block",
                    type: "contract",
                     //custom: 'INITIALIZE_VARIABLES'
                },
                {
                    kind: "category",
                    name: "Init",
                    colour: "#D74C22",
                    contents: [
                        {
                            kind: "category",
                            name: "Variables",
                            colour: "#D74C22", //"#F89A33",
                            id: "variables",
                            //custom: "SOLIDITY_TYPE",
                            contents: [
                                {
                                kind: 'block',
                                type: 'define_variable',
                                //colour: "#FA7E00",
                                },
                                {
                                kind: 'block',
                                type: 'define_variable_with_assignment',
                                },
                                {
                                kind: 'block',
                                type: 'define_variable_with_assignment1',
                                },
                                {
                                kind: "category",
                                name: "String",
                                colour: "#FDC18D",
                                //colour: "#FE414C",
                                //colour: "230",
                                custom: "NEW_STRING_VARIABLE"
                                
                                },
                                {
                                kind: "category",
                                name: "Uint",
                                colour: "#FDC18D",
                                //colour: "330",
                                custom: "NEW_UINT_VARIABLE"
                                },
                                {
                                kind: "category",
                                name: "Int",
                                colour: "#FDC18D",
                                //colour: '%{BKY_VARIABLES_DYNAMIC_HUE}', 
                                custom: "NEW_INT_VARIABLE"
                                },
                                {
                                kind: "category",
                                name: "Address",
                                colour: "#FDC18D",
                                //colour: '%{BKY_LOGIC_HUE}',
                                custom: "NEW_ADDRESS_VARIABLE",
                                },
                                {
                                kind: "category",
                                name: "Boolean",
                                colour: "#FDC18D",
                                //colour: "175",
                                custom: "NEW_BOOL_VARIABLE"
                                },
                                {
                                kind: "category",
                                name: "Bytes",
                                colour: "#FDC18D",
                                //colour: "175",
                                custom: "NEW_BYTES_VARIABLE"
                                }
                            ]
                        },
                        {
                            kind: "category",
                            name: "Structures",
                            colour: "#D74C22", //"#F89A33",
                            custom: "NEW_STRUCT",
                        },
                        {
                            kind: "category",
                            name: "Mapping",
                            colour: "#D74C22", //"#F89A33",
                            custom: "NEW_MAPPING",
                        },
                        {
                            kind: "category",
                            name: "Events",
                            colour: "#D74C22", //"#F89A33",
                            custom: "NEW_EVENT",
                        },
                        {
                            kind: "category",
                            name: "Array",
                            colour: "#D74C22", //"#F89A33",
                            custom: "NEW_ARRAY",
                        },
                        {
                            kind: "category",
                            name: "Constructor",
                            colour: "#D74C22", //"#F89A33",
                            contents: [
                                {
                                    kind: "block",
                                    type: "contract_constructor",
                                },
                                {
                                    kind: "block",
                                    type: "input",
                                    //"colour": 290,
                                },
                                {
                                    kind: "block",
                                    type: "func_inputs",
                                    //colour: '290',
                                },
                            ],
                        },
                        {
                            kind: "category",
                            name: "Modifier",
                            colour: "#D74C22", //"#F89A33",
                            custom: "NEW_MODIFIER",
                        },
                    ],
                },
                {
                    kind: "category",
                    name: "Body",
                    colour: "896C94",
                    contents: [
                        {
                            kind: "category",
                            name: "Method",
                            colour: "896C94",
                            contents: [
                                {
                                    kind: "block",
                                    type: "method",
                                },
                                {
                                    kind: "block",
                                    type: "require_condition_method1",
                                },
                                {
                                    kind: "block",
                                    type: "func_inputs",
                                    //colour: '290',
                                },
                                {
                                    kind: "block",
                                    type: "func_returnValues",
                                },
                                {
                                    kind: "block",
                                    type: "return_block",
                                },
                                {
                                    kind: "block",
                                    type: "input_somma",
                                },
                                {
                                    kind: "block",
                                    type: "input_diff",
                                },
                                {
                                    kind: "block",
                                    type: "input",
                                },
                            ],
                        },
                        {
                            kind: "category",
                            name: "If Loops",
                            colour: "896C94",
                            contents: [
                                {
                                    kind: "block",
                                    type: "if",
                                },
                                {
                                    kind: "block",
                                    type: "else_if",
                                },
                                {
                                    kind: "block",
                                    type: "else",
                                },
                                {
                                    kind: "block",
                                    type: "if_else_container",
                                },
                                {
                                    kind: "block",
                                    type: "if_elseif_else_container",
                                },
                            ],
                        },
                    ],
                },
            ],
        },

        // # Category Template
        {
            kind: "category",
            name: "Smart Contract Template",
            id: "template",
            contents: [
                // # Category "Governor"
                {
                    kind: "category",
                    name: "Governor",
                    //colour: "#6456BF",
                    contents: [
                        {
                            kind: "block",
                            type: "Governor",
                            //custom: 'INITIALIZE_VARIABLES'
                        },
                        {
                            kind: "category",
                            name: "Methods",
                            colour: "896C94",
                            contents: [
                                {
                                    kind: "block",
                                    type: "state",
                                },
                                {
                                    kind: "block",
                                    type: "proposalNeedsQueuing",
                                },
                                {
                                    kind: "block",
                                    type: "proposalThreshold",
                                },
                            ],
                        },
                    ],
                },

                // # Category "ERC20 Smart contract"
                {
                    kind: "category",
                    name: "ERC20",
                    //colour: "#6456BF",
                    contents: [
                        {
                            kind: "block",
                            type: "erc20",
                        },
                    ],
                },

                // # Category "ERC721 Smart contract"
                {
                    kind: "category",
                    name: "ERC721",
                    //colour: "#6456BF",
                    contents: [],
                },

                // # Category "Stablecoin"
                {
                    kind: "category",
                    name: "Stablecoin",
                    //colour: "#6456BF",
                    contents: [],
                },

                // # Category "E-commerce"
                {
                    kind: "category",
                    name: "E-commerce",
                    //colour: "#6456BF",
                    contents: [],
                },
            ],
        },
    ],
};

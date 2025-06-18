// # Dynamic blocks for Structures

const dynamicStructBlocks = [

    // ## type: contract_structures
    {
        type: "contract_structures",
        message0: "Struct %1 %2 %3",
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
            {
                type: "input_statement",
                name: "STATES",
                check: "struct_variables",
            },
        ],
        previousStatement: [true, "contract_structures"],
        nextStatement: [true, "contract_structures"],
        colour: 150,
        tooltip: "Define a Solidity Struct type.",
        helpUrl: "",
    },

    // ## type: struct_variables
    {
        type: "struct_variables",
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
                text: "b",
            },
        ],
        previousStatement: [true, "struct_variables"],
        nextStatement: [true, "struct_variables"],
        colour: "#FF8000",
        tooltip: "Struct attribute.",
        helpUrl: "",
    },

]
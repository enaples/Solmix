import * as Blockly from "blockly";
import { variableTypes } from "./variable_types";

// # Getter dynamic blocks
const getters = Object.keys(variableTypes).map((type: string) => ({
    // ### type getter

    type: `solidity_get_${type}`,
    message0: "%1",
    args0: [
        {
            type: "field_variable",
            name: "VAR",
            variable: "%{BKY_VARIABLES_DEFAULT_NAME}%",
            variableType: [type],
            defaultType: type,
        },
    ],
    output: type,
    tooltip: variableTypes[type].tooltip,
    colour: variableTypes[type].colour,
}));

// # Setter dynamic blocks
const setters = Object.keys(variableTypes).map((type: string) =>
    // ### type setter
    ({
        type: `solidity_set_${type}`,
        message0: "%{BKY_VARIABLES_SET}",
        args0: [
            {
                type: "field_variable",
                name: `VAR`,
                variable: "%{BKY_VARIABLES_DEFAULT_NAME}",
                variableTypes: [type],
                defaultType: type,
            },
            {
                type: "field_input",
                name: `${type.toUpperCase()}_VAL`,
                text: ""
            },
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: variableTypes[type].tooltip,
        colour: variableTypes[type].colour,
        extension: [`${type}_validator`]
    })
);

Blockly.defineBlocksWithJsonArray([...getters, ...setters]);



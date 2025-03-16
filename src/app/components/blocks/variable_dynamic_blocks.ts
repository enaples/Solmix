import * as Blockly from "blockly";
import { variableTypes } from "./variable_types";

const setters = Object.keys(variableTypes).map((type: string) => ({
    // ### type getter

    type: `solidity_get_${type}`,
    message0: "%1",
    args0: [
        {
            type: "field_variable",
            name: "VAR",
            variable: "%{BKY_VARIABLES_DEFAULT_NAME}%",
            variableType: [`${type}`],
            defaultType: `${type}`,
        },
    ],
    output: `${type}`,
    tooltip: `${type} type getter`,
    colour: variableTypes[type],
}));

const getters = Object.keys(variableTypes).map((type: string) =>
    // ### type setter
    ({
        type: `solidity_set_${type}`,
        message0: "%{BKY_VARIABLES_SET}",
        args0: [
            {
                type: "field_variable",
                name: "VAR",
                variable: "%{BKY_VARIABLES_DEFAULT_NAME}",
                variableTypes: [`${type}`],
                defaultType: `${type}`,
            },
            {
                type: "input_value",
                name: "VALUE",
                check: `${type}`,
            },
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: `${type} type setter`,
        colour: variableTypes[type],
    })
);


Blockly.defineBlocksWithJsonArray([...getters, ...setters]);

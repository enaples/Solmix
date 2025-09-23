import * as Blockly from "blockly";
import {
    solidityIntVariables,
    solidityIntConstantsVariables,
    solidityIntImmutablesVariables,
} from "../dropdown/dropdown";

// ## variables_get_int
Blockly.Blocks["variables_get_int"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("int")
            .appendField(
                new Blockly.FieldDropdown((): [string, string][] => {
                    return solidityIntVariables.length
                        ? solidityIntVariables.map(
                              (v) => [v.name, v.name] as [string, string]
                          )
                        : [["", ""]];
                }),
                "VAR"
            );

        this.setOutput(true, "Value_Output");
        this.setColour("#A2231D");
        this.setTooltip("It returns the name of a variable you've defined.");
    },
};

// ## variables_set_int
Blockly.Blocks["variables_set_int"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Set variable int")
            .appendField(
                new Blockly.FieldDropdown((): [string, string][] => {
                    return solidityIntVariables.length
                        ? solidityIntVariables.map(
                              (v) => [v.name, v.name] as [string, string]
                          )
                        : [["", ""]];
                }),
                "VAR"
            );

        this.appendValueInput("VALUE")
            //.setCheck("Int")  // Puoi riattivare il check se hai definito il tipo Blockly
            .appendField("to");

        this.setPreviousStatement(true, "code");
        this.setNextStatement(true, "code");
        this.setColour("#A2231D");
        this.setTooltip("Assign a value to the int variable.");
        this.setHelpUrl("");
    },
};

// ## variables_get_int_constants
Blockly.Blocks["variables_get_int_constants"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("constant")
            .appendField(
                new Blockly.FieldDropdown((): [string, string][] => {
                    return solidityIntConstantsVariables.length
                        ? solidityIntConstantsVariables.map(
                              (v) => [v.name, v.name] as [string, string]
                          )
                        : [["", ""]];
                }),
                "VAR"
            );
        this.setOutput(true, "Value_Output_Const");
        this.setColour(330);
        this.setTooltip(
            "It returns the name of a constant int variable you've defined."
        );
    },
};

// ##variables_get_int_immutables
Blockly.Blocks["variables_get_int_immutables"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("immutable")
            .appendField(
                new Blockly.FieldDropdown((): [string, string][] => {
                    return solidityIntImmutablesVariables.length
                        ? solidityIntImmutablesVariables.map(
                              (v) => [v.name, v.name] as [string, string]
                          )
                        : [["", ""]];
                }),
                "VAR"
            );

        this.setOutput(true, "Value_Output_Imm");
        this.setColour(200);
        this.setTooltip(
            "It returns the name of an immutable int variable you've defined."
        );
    },
};

// ## variables_get_i
Blockly.Blocks["variables_get_i"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Get Method for Int")
            .appendField(
                new Blockly.FieldDropdown((): [string, string][] => {
                    return solidityIntVariables.length
                        ? solidityIntVariables.map(
                              (v) => [v.name, v.name] as [string, string]
                          )
                        : [["", ""]];
                }),
                "VAR"
            );

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#A2231D");
        this.setTooltip("It returns the value stored in a variable.");
    },
};

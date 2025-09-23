import * as Blockly from "blockly";
import {
    solidityStringVariables,
    solidityStringConstantsVariables,
    solidityStringImmutablesVariables,
} from "../dropdown/dropdown";

// ## variables_get_string

Blockly.Blocks["variables_get_string"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("string")
            .appendField(
                new Blockly.FieldDropdown((): [string, string][] => {
                    return solidityStringVariables.length
                        ? solidityStringVariables.map(
                              (v) => [v.name, v.name] as [string, string]
                          )
                        : [["", ""]];
                }),
                "VAR"
            );

        this.setOutput(true, "String_Output");
        this.setColour("#FF007F");
        this.setTooltip("It returns the name of a variable you've defined.");
    },
};

// ## variables_set_string
Blockly.Blocks["variables_set_string"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Set variable")
            .appendField(
                new Blockly.FieldDropdown(function () {
                    return solidityStringVariables.length
                        ? solidityStringVariables.map((v) => [v.name, v.name])
                        : [["", ""]];
                }),
                "VAR"
            );

        this.appendValueInput("VALUE")
            .setCheck("String_Output") // Assumi che i blocchi stringa abbiano questo tipo
            .appendField("to");

        this.setPreviousStatement(true, "code");
        this.setNextStatement(true, "code");
        this.setColour("#FF007F");
        this.setTooltip("Assign a value to the string variable.");
        this.setHelpUrl("");
    },
};

// ## variables_get_string_constants
Blockly.Blocks["variables_get_string_constants"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("constant")
            .appendField(
                new Blockly.FieldDropdown(() => {
                    return solidityStringConstantsVariables.length
                        ? solidityStringConstantsVariables.map((v) => [
                              v.name,
                              v.name,
                          ])
                        : [["", ""]];
                }),
                "VAR"
            );

        this.setOutput(true, "String_Output_Const");
        this.setColour(330);
        this.setTooltip(
            "Returns the value of a constant string variable you've defined."
        );
        this.setHelpUrl(""); // puoi specificare un link se desideri
    },
};

// ## variables_get_string_immutables
Blockly.Blocks["variables_get_string_immutables"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("immutable")
            .appendField(
                new Blockly.FieldDropdown(() => {
                    return solidityStringImmutablesVariables.length
                        ? solidityStringImmutablesVariables.map((v) => [
                              v.name,
                              v.name,
                          ])
                        : [["", ""]];
                }),
                "VAR"
            );

        this.setOutput(true, "String_Output_Imm");
        this.setColour(200);
        this.setTooltip(
            "It returns the name of an immutable string variable you've defined."
        );
        this.setHelpUrl("");
    },
};

// ## variables_get_s
Blockly.Blocks["variables_get_s"] = {
    init: function (this: Blockly.Block) {
        this.appendDummyInput()
            .appendField("Get Method for String")
            .appendField(
                new Blockly.FieldDropdown(() => {
                    return solidityStringVariables.length
                        ? solidityStringVariables.map((v: any) => [
                              v.name,
                              v.name,
                          ])
                        : [["", ""]];
                }),
                "VAR"
            );

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#FF007F");
        this.setTooltip("It returns the value stored in a variable.");
    },
};

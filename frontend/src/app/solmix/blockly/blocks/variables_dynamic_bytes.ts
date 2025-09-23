import * as Blockly from "blockly";
import {
    solidityBytesVariables,
    solidityBytesConstantsVariables,
    solidityBytesImmutablesVariables,
} from "../dropdown/dropdown";
import {
    solidityBytes32Variables,
    solidityBytes32ConstantsVariables,
    solidityBytes32ImmutablesVariables,
} from "../dropdown/dropdown";

// ## variables_get_bytes
Blockly.Blocks["variables_get_bytes"] = {
    init: function (this: Blockly.Block) {
        this.appendDummyInput()
            .appendField("bytes")
            .appendField(
                new Blockly.FieldDropdown(function () {
                    return solidityBytesVariables.length
                        ? solidityBytesVariables.map((v) => [v.name, v.name])
                        : [["", ""]];
                }),
                "VAR"
            );

        this.setOutput(true, "String_Output");
        this.setColour("#0B5369");
        this.setTooltip("It returns the name of a variable you've defined.");
    },
};

// ## variables_set_bytes
Blockly.Blocks["variables_set_bytes"] = {
    init: function (): void {
        this.appendDummyInput()
            .appendField("Set variable")
            .appendField(
                new Blockly.FieldDropdown(function (): [string, string][] {
                    return solidityBytesVariables.length
                        ? solidityBytesVariables.map((v: { name: string }) => [
                              v.name,
                              v.name,
                          ])
                        : [["", ""]];
                }),
                "VAR"
            );

        this.appendValueInput("VALUE")
            //.setCheck("Bytes") // opzionale
            .appendField("to");

        this.setPreviousStatement(true, "code");
        this.setNextStatement(true, "code");
        this.setColour("#0B5369");
        this.setTooltip("Assign a value to the bytes variable.");
        this.setHelpUrl("");
    },
};

// ## variables_get_bytes_constants
Blockly.Blocks["variables_get_bytes_constants"] = {
    init: function (this: Blockly.Block) {
        this.appendDummyInput()
            .appendField("constant")
            .appendField(
                new Blockly.FieldDropdown(function (): [string, string][] {
                    return solidityBytesConstantsVariables.length
                        ? solidityBytesConstantsVariables.map((v) => [
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
            "It returns the name of a constant bytes variable you've defined."
        );
    },
};

// ## variables_get_bytes_immutables
Blockly.Blocks["variables_get_bytes_immutables"] = {
    init: function (): void {
        this.appendDummyInput()
            .appendField("immutable")
            .appendField(
                new Blockly.FieldDropdown(function (): [string, string][] {
                    return solidityBytesImmutablesVariables.length
                        ? solidityBytesImmutablesVariables.map(
                              (v: { name: string }) => [v.name, v.name]
                          )
                        : [["", ""]];
                }),
                "VAR"
            );

        this.setOutput(true, "String_Output_Imm");
        this.setColour(200);
        this.setTooltip(
            "It returns the name of a immutable bytes variable you've defined."
        );
    },
};

// ## variables_get_by
Blockly.Blocks["variables_get_by"] = {
    init: function (this: Blockly.Block) {
        this.appendDummyInput()
            .appendField("Get Method for Bytes")
            .appendField(
                new Blockly.FieldDropdown(function () {
                    return solidityBytesVariables.length
                        ? solidityBytesVariables.map((v: { name: string }) => [
                              v.name,
                              v.name,
                          ])
                        : [["", ""]];
                }),
                "VAR"
            );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#0B5369");
        this.setTooltip("It returns the value stored in a variable.");
    },
};

// ## variables_get_bytes32
Blockly.Blocks["variables_get_bytes32"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("bytes32")
            .appendField(
                new Blockly.FieldDropdown(() => {
                    return solidityBytes32Variables.length
                        ? solidityBytes32Variables.map((v) => [v.name, v.name])
                        : [["", ""]];
                }),
                "VAR"
            );

        this.setOutput(true, "String_Output");
        this.setColour("#808080");
        this.setTooltip(
            "It returns the name of a bytes32 variable you've defined."
        );
    },
};

// ## variables_set_bytes32
Blockly.Blocks["variables_set_bytes32"] = {
    init: function (): void {
        this.appendDummyInput()
            .appendField("Set variable")
            .appendField(
                new Blockly.FieldDropdown(function (): [string, string][] {
                    return solidityBytes32Variables.length
                        ? solidityBytes32Variables.map((v) => [v.name, v.name])
                        : [["", ""]];
                }),
                "VAR"
            );

        this.appendValueInput("VALUE")
            // .setCheck("Bytes32") // eventualmente da definire
            .appendField("to");

        this.setPreviousStatement(true, "code");
        this.setNextStatement(true, "code");
        this.setColour("#808080");
        this.setTooltip("Assign a value to the bytes32 variable.");
        this.setHelpUrl("");
    },
};

// ## variables_get_bytes32_constants
Blockly.Blocks["variables_get_bytes32_constants"] = {
    init: function (this: Blockly.Block) {
        this.appendDummyInput()
            .appendField("constant")
            .appendField(
                new Blockly.FieldDropdown(function () {
                    return solidityBytes32ConstantsVariables.length
                        ? solidityBytes32ConstantsVariables.map(
                              (v: { name: string }) => [v.name, v.name]
                          )
                        : [["", ""]];
                }),
                "VAR"
            );
        this.setOutput(true, "String_Output_Const");
        this.setColour(330);
        this.setTooltip(
            "It returns the name of a constant bytes32 variable you've defined."
        );
    },
};

// ## variables_get_bytes32_immutables
Blockly.Blocks["variables_get_bytes32_immutables"] = {
    init: function (this: Blockly.Block) {
        this.appendDummyInput()
            .appendField("immutable")
            .appendField(
                new Blockly.FieldDropdown(() => {
                    return solidityBytes32ImmutablesVariables.length
                        ? solidityBytes32ImmutablesVariables.map((v) => [
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
            "It returns the name of a immutable bytes32 variable you've defined."
        );
    },
};

// ## variables_get_by32
Blockly.Blocks["variables_get_by32"] = {
    init: function (): void {
        this.appendDummyInput()
            .appendField("Get Method for Bytes32")
            .appendField(
                new Blockly.FieldDropdown(function (): [string, string][] {
                    return solidityBytes32Variables.length
                        ? solidityBytes32Variables.map(
                              (v: { name: string }) => [v.name, v.name]
                          )
                        : [["", ""]];
                }),
                "VAR"
            );

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#808080");
        this.setTooltip("It returns the value stored in a variable.");
    },
};

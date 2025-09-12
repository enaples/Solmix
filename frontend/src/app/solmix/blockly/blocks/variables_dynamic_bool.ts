import * as Blockly from "blockly";
//import { javascriptGenerator } from "blockly/javascript";
import {solidityBoolVariables, solidityBoolConstantsVariables, solidityBoolImmutablesVariables } from "../dropdown/dropdown";

// ## variables_get_bool

Blockly.Blocks['variables_get_bool'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("bool")
      .appendField(new Blockly.FieldDropdown(() => {
        return solidityBoolVariables.length
          ? solidityBoolVariables.map((v) => [v.name, v.name])
          : [["", ""]];
      }), "VAR");

    this.setOutput(true, "Value_Output");
    this.setColour("#EA899A");
    this.setTooltip("It returns the name of a variable you've defined.");
  }
};

// ## variables_set_bool
Blockly.Blocks['variables_set_bool'] = {
  init: function (): void {
    this.appendDummyInput()
      .appendField("Set variable")
      .appendField(new Blockly.FieldDropdown((): [string, string][] => {
        return solidityBoolVariables.length
          ? solidityBoolVariables.map((v: { name: string }) => [v.name, v.name])
          : [["", ""]];
      }), "VAR");

    this.appendValueInput("VALUE")
      // .setCheck("Boolean") // Puoi usare se definisci i tipi custom
      .appendField("to");

    this.setPreviousStatement(true, "code");
    this.setNextStatement(true, "code");
    this.setColour("#EA899A");
    this.setTooltip("Assign a value to the boolean variable.");
    this.setHelpUrl("");
  }
};

// ## variables_get_bool_constants

Blockly.Blocks['variables_get_bool_constants'] = {
  init: function (): void {
    this.appendDummyInput()
      .appendField("constant")
      .appendField(new Blockly.FieldDropdown((): [string, string][] => {
        return solidityBoolConstantsVariables.length
          ? solidityBoolConstantsVariables.map((v: { name: string }) => [v.name, v.name])
          : [["", ""]];
      }), "VAR");
    this.setOutput(true, "Value_Output_Const");
    this.setColour(330);
    this.setTooltip("It returns the name of a constant boolean variable you've defined.");
  }
};

// ## variables_get_bool_immutables
Blockly.Blocks['variables_get_bool_immutables'] = {
  init: function (): void {
    this.appendDummyInput()
      .appendField("immutable")
      .appendField(new Blockly.FieldDropdown(function (): [string, string][] {
        return solidityBoolImmutablesVariables.length
          ? solidityBoolImmutablesVariables.map((v: { name: string }) => [v.name, v.name])
          : [["", ""]];
      }), "VAR");

    this.setOutput(true, "Value_Output_Imm");
    this.setColour(200);
    this.setTooltip("It returns the name of an immutable boolean variable you've defined.");
  }
};

// ## variables_get_b
Blockly.Blocks['variables_get_b'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Get Method for Boolean")
      .appendField(new Blockly.FieldDropdown(function() {
        return solidityBoolVariables.length
          ? solidityBoolVariables.map((v: { name: string }) => [v.name, v.name])
          : [["", ""]];
      }), "VAR");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("EA899A");
    this.setTooltip("It returns the value stored in a variable.");
  }
};


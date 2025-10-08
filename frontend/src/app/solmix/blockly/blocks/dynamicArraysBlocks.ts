import * as Blockly from "blockly";
//import { javascriptGenerator } from "blockly/javascript";
import {solidityArrays } from "../dropdown/dropdown";

Blockly.Blocks["array_values"] = {
  init(this: Blockly.Block): void {
    const arrayDropdown = new Blockly.FieldDropdown((): [string, string][] => {
      return solidityArrays.length > 0
        ? solidityArrays.map((v) => [v.name, v.name] as [string, string])
        : [["", ""]];
    });

    this.appendDummyInput("DUMMY")
      .appendField(arrayDropdown, "VAR")
      .appendField("[")
      .appendField(new Blockly.FieldTextInput("index"), "PARAMS1")
      .appendField("] =")
      .appendField(new Blockly.FieldTextInput("value"), "PARAMS2");

    this.setPreviousStatement(true, "code");
    this.setNextStatement(true, "code");
    this.setOutput(false);
    this.setColour(450);
    this.setTooltip(
      "Assign a value to the element in the position indicated by the index you'll insert."
    );
  }
};

Blockly.Blocks["array_pop"] = {
  init(this: Blockly.Block): void {
    const arrayDropdown = new Blockly.FieldDropdown((): [string, string][] => {
      return solidityArrays.length > 0
        ? solidityArrays.map((v) => [v.name, v.name] as [string, string])
        : [["", ""]];
    });

    this.appendDummyInput("DUMMY")
      .appendField(arrayDropdown, "VAR")
      .appendField(".pop()");

    this.setPreviousStatement(true, "code");
    this.setNextStatement(true, "code");
    this.setOutput(false);
    this.setColour(450);
    this.setTooltip("Use this block to remove the last element of the array.");
  }
};

Blockly.Blocks["array_push"] = {
  init(this: Blockly.Block): void {
    const arrayDropdown = new Blockly.FieldDropdown((): [string, string][] => {
      return solidityArrays.length > 0
        ? solidityArrays.map((v) => [v.name, v.name] as [string, string])
        : [["", ""]];
    });

    this.appendDummyInput("DUMMY")
      .appendField(arrayDropdown, "VAR")
      .appendField(".push(")
      .appendField(new Blockly.FieldTextInput("newValue"), "PARAMS1")
      .appendField(")");

    this.setPreviousStatement(true, "code");
    this.setNextStatement(true, "code");
    this.setOutput(false);
    this.setColour(450);
    this.setTooltip("Use this block to push int, uint or bool values");
  }
};


Blockly.Blocks["array_push_S_A_B"] = {
  init(this: Blockly.Block): void {
    const arrayDropdown = new Blockly.FieldDropdown((): [string, string][] => {
      return solidityArrays.length > 0
        ? solidityArrays.map((v) => [v.name, v.name] as [string, string])
        : [["", ""]];
    });

    this.appendDummyInput("DUMMY")
      .appendField(arrayDropdown, "VAR")
      .appendField('.push( "')
      .appendField(new Blockly.FieldTextInput("newValue"), "PARAMS1")
      .appendField('" )');

    this.setPreviousStatement(true, "code");
    this.setNextStatement(true, "code");
    this.setOutput(false);
    this.setColour(450);
    this.setTooltip("Use this block to push string, bytes or address values");
  }
};

Blockly.Blocks["array_delete"] = {
  init(this: Blockly.Block): void {
    const arrayDropdown = new Blockly.FieldDropdown((): [string, string][] => {
      return solidityArrays.length > 0
        ? solidityArrays.map((v) => [v.name, v.name] as [string, string])
        : [["", ""]];
    });

    this.appendDummyInput("DUMMY")
      .appendField(arrayDropdown, "VAR")
      .appendField(".delete[")
      .appendField(new Blockly.FieldTextInput("index"), "PARAMS1")
      .appendField("]");

    this.setPreviousStatement(true, "code");
    this.setNextStatement(true, "code");
    this.setOutput(false);
    this.setColour(450);
    this.setTooltip(
      "Use this block to remove the array element in the position indicated by the index you'll insert."
    );
  }
};


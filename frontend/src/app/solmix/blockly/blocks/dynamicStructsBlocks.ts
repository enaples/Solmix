import * as Blockly from "blockly";
import {solidityStructs, solidityStructArrays, structRegistry} from "../dropdown/dropdown"; //getSolidityStruct, 


/**
 * Blocchi new_struct_value
 */
Blockly.Blocks["new_struct_value"] = {
  init(this: Blockly.Block): void {
    //const block = this;

    // Dropdown dinamico per gli struct
    const structDropdown = new Blockly.FieldDropdown(() => {
      return solidityStructs.length > 0
        ? solidityStructs.map((v) => [v.name, v.name])
        : [["", ""]];
    });

    // Dropdown dinamico per gli attributi
    const attributeDropdown = new Blockly.FieldDropdown(() : [string, string][] => {
      const selectedStruct = this.getFieldValue("VAR");
      const attributes = structRegistry[selectedStruct] || [];
      const options = attributes.map((attr) => [attr.name, attr.name] as [string, string]);
      return options.length > 0 ? options : [["", ""]];
    });

    this.appendDummyInput("DUMMY")
      .appendField(structDropdown, "VAR")
      .appendField(attributeDropdown, "ATTRIBUTE")
      .appendField("=")
      .appendField(new Blockly.FieldTextInput("value"), "VALUE");

    this.setOutput(false);
    this.setPreviousStatement(true, "code");
    this.setNextStatement(true, "code");
    this.setColour(150);
    this.setTooltip(
      "Assign values to the attributes of the Struct variable.\nChoose a Struct type among the ones you've defined."
    );
  }
};


Blockly.Blocks["structs_array"] = {
  init(this: Blockly.Block): void {
    //const block = this;

    const structDropdown = new Blockly.FieldDropdown((): [string, string][] => {
      return solidityStructs.length > 0
        ? solidityStructs.map((v) => [v.name, v.name] as [string, string])
        : [["", ""]];
    });

    this.appendDummyInput("DUMMY")
      .appendField(structDropdown, "VAR")
      .appendField("[ ]")
      .appendField(
        new Blockly.FieldDropdown([
          ["public", "TYPE_PUBLIC"],
          ["private", "TYPE_PRIVATE"],
          ["internal", "TYPE_INTERNAL"],
          ["external", "TYPE_EXTERNAL"]
        ]),
        "TYPE3"
      )
      .appendField(new Blockly.FieldTextInput("/* insert a name */"), "NAME");

    this.setPreviousStatement(true, "array_group");
    this.setNextStatement(true, "array_group");
    this.setOutput(false);
    this.setTooltip(
      "Define an Array variable of type Struct.\nChoose a Struct type among the ones you've defined."
    );
    this.setColour(150);
  }
};

Blockly.Blocks["struct_push"] = {
  init(this: Blockly.Block): void {
    //const block = this;

    const arrayDropdown = new Blockly.FieldDropdown((): [string, string][] => {
      return solidityStructArrays.length > 0
        ? solidityStructArrays.map((v) => [v.name, v.name] as [string, string])
        : [["", ""]];
    });

    this.appendValueInput("PARAMS1")
      .appendField(arrayDropdown, "VAR")
      .setCheck("newstruct")
      .appendField(".push()");

    this.setPreviousStatement(true, "code");
    this.setNextStatement(true, "code");
    this.setOutput(false);
    this.setColour(150);
    this.setTooltip(
      "Use this block to insert a new Struct element inside the array of Structs."
    );
  }
};

Blockly.Blocks["new_struct"] = {
  init(this: Blockly.Block): void {
    const structDropdown = new Blockly.FieldDropdown((): [string, string][] => {
      return solidityStructs.length > 0
        ? solidityStructs.map((v) => [v.name, v.name] as [string, string])
        : [["", ""]];
    });

    this.appendDummyInput()
      .appendField("Initialise a new struct of type: ")
      .appendField(structDropdown, "VAR");

    this.setOutput(true, "newstruct");
    this.setColour(150);
    this.setTooltip(
      "It returns a Struct type you've defined, and its attributes.\nUse this block to initialise a new Struct variable.\nYou can also assign values to the variables's attributes."
    );
  }
};

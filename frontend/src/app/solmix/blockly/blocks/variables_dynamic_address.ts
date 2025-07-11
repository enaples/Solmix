import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import {solidityAddressVariables, solidityAddressConstantsVariables, solidityAddressImmutablesVariables } from "../dropdown/dropdown";

// ## variables_get_address
Blockly.Blocks['variables_get_address'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("address")
      .appendField(new Blockly.FieldDropdown(() => {
        return solidityAddressVariables.length
          ? solidityAddressVariables.map(v => [v.name, v.name])
          : [["", ""]];
      }), "VAR");

    this.setOutput(true, "String_Output");
    this.setColour(230);
    this.setTooltip("It returns the name of a variable you've defined.");
  }
};

// ## variables_set_address
Blockly.Blocks['variables_set_address'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Set variable")
      .appendField(new Blockly.FieldDropdown(function () {
        return solidityAddressVariables.length
          ? solidityAddressVariables.map(v => [v.name, v.name])
          : [["", ""]];
      }), "VAR");
    
    this.appendValueInput("VALUE")
      //.setCheck("Address") // opzionale
      .appendField("to");
    
    this.setPreviousStatement(true, "code");
    this.setNextStatement(true, "code");
    this.setColour(230);
    this.setTooltip("Assign a value to the address variable.");
    this.setHelpUrl("");
  }
};

// ## variables_get_address_constants
Blockly.Blocks['variables_get_address_constants'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("constant")
      .appendField(new Blockly.FieldDropdown(function () {
        return solidityAddressConstantsVariables.length
          ? solidityAddressConstantsVariables.map(v => [v.name, v.name])
          : [["", ""]];
      }), "VAR");

    this.setOutput(true, "String_Output_Const");
    this.setColour(330);
    this.setTooltip("It returns the name of a constant address variable you've defined.");
    this.setHelpUrl("");
  }
};

// ## variables_get_address_immutables
Blockly.Blocks['variables_get_address_immutables'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("immutable")
      .appendField(new Blockly.FieldDropdown(function() {
        return solidityAddressImmutablesVariables.length
          ? solidityAddressImmutablesVariables.map(v => [v.name, v.name])
          : [["", ""]];
      }), "VAR");
    this.setOutput(true, "String_Output_Imm"); // Puoi personalizzare l'output type se hai un tipo Blockly più specifico
    this.setColour(200); // Colore coerente per gli "immutable"
    this.setTooltip("It returns the name of an immutable address variable you've defined.");
  }
};

// ## variables_get_a
Blockly.Blocks['variables_get_a'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Get Method for Address")
      .appendField(new Blockly.FieldDropdown(function() {
        return solidityAddressVariables.length 
          ? solidityAddressVariables.map(v => [v.name, v.name]) 
          : [["", ""]];
      }), "VAR");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("It returns the value stored in a variable.");
  }
};

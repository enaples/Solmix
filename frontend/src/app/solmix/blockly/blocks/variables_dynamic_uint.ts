import * as Blockly from "blockly";
//import { javascriptGenerator } from "blockly/javascript";
import {solidityUintVariables, solidityUintConstantsVariables, solidityUintImmutablesVariables, solidityUint256Variables, solidityUint256ConstantsVariables, solidityUint256ImmutablesVariables, solidityUint8Variables, solidityUint8ConstantsVariables, solidityUint8ImmutablesVariables } from "../dropdown/dropdown";


// ## variables_get_uint

Blockly.Blocks['variables_get_uint'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("uint")
      .appendField(new Blockly.FieldDropdown((): [string, string][] => {
        return solidityUintVariables.length
          ? solidityUintVariables.map(v => [v.name, v.name] as [string, string])
          : [["", ""]];
      }), "VAR");
      
    this.setOutput(true, "Value_Output");
    this.setColour("#003399");
    this.setTooltip("It returns the name of a variable you've defined.");
  }
};


// ## variables_set_uint
Blockly.Blocks['variables_set_uint'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Set variable uint")
      .appendField(new Blockly.FieldDropdown((): [string, string][] => {
        return solidityUintVariables.length
          ? solidityUintVariables.map(v => [v.name, v.name] as [string, string])
          : [["", ""]];
      }), "VAR");

    this.appendValueInput("VALUE")
      //.setCheck("Uint") // puoi usare un tipo custom o lasciarlo libero
      .appendField("to");

    this.setPreviousStatement(true, "code");
    this.setNextStatement(true, "code");
    this.setColour("#003399");
    this.setTooltip("Assign a value to the uint variable.");
    this.setHelpUrl("");
  }
};


// ## variables_get_uint_constants
Blockly.Blocks['variables_get_uint_constants'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("constant")
      .appendField(new Blockly.FieldDropdown((): [string, string][] => {
        return solidityUintConstantsVariables.length
          ? solidityUintConstantsVariables.map(v => [v.name, v.name] as [string, string])
          : [["", ""]];
      }), "VAR");

    this.setOutput(true, "Value_Output_Const");
    this.setColour(330);
    this.setTooltip("It returns the name of a constant uint variable you've defined.");
  }
};


// ## variables_get_uint_immutables
Blockly.Blocks['variables_get_uint_immutables'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("immutable")
      .appendField(new Blockly.FieldDropdown((): [string, string][] => {
        return solidityUintImmutablesVariables.length
          ? solidityUintImmutablesVariables.map(v => [v.name, v.name] as [string, string])
          : [["", ""]];
      }), "VAR");

    this.setOutput(true, "Value_Output_Imm");
    this.setColour(200);
    this.setTooltip("It returns the name of an immutable uint variable you've defined.");
  }
};


// ## variables_get_u
Blockly.Blocks['variables_get_u'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Get method (uint)")
      .appendField(new Blockly.FieldDropdown((): [string, string][] => {
        return solidityUintVariables.length
          ? solidityUintVariables.map(v => [v.name, v.name] as [string, string])
          : [["", ""]];
      }), "VAR");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#003399");
    this.setTooltip("It returns the value stored in a variable.");
  }
};


// UINT 256
// ## variables_get_uint256
Blockly.Blocks['variables_get_uint256'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("uint256")
      .appendField(new Blockly.FieldDropdown((): [string, string][] => {
        return solidityUint256Variables.length
          ? solidityUint256Variables.map(v => [v.name, v.name] as [string, string])
          : [["", ""]];
      }), "VAR");

    this.setOutput(true, "Value_Output");
    this.setColour("#d9a528");
    this.setTooltip("It returns the name of a variable you've defined.");
  }
};

// ## variables_set_uint256
Blockly.Blocks['variables_set_uint256'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Set variable uint256")
      .appendField(new Blockly.FieldDropdown((): [string, string][] => {
        return solidityUint256Variables.length
          ? solidityUint256Variables.map(v => [v.name, v.name] as [string, string])
          : [["", ""]];
      }), "VAR");

    this.appendValueInput("VALUE")
      .appendField("to");

    this.setPreviousStatement(true, "code");
    this.setNextStatement(true, "code");
    this.setColour("#d9a528");
    this.setTooltip("Assign a value to the uint256 variable.");
    this.setHelpUrl("");
  }
};

// ## variables_get_uint256_constants
Blockly.Blocks['variables_get_uint256_constants'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("constant")
      .appendField(new Blockly.FieldDropdown((): [string, string][] => {
        return solidityUint256ConstantsVariables.length
          ? solidityUint256ConstantsVariables.map(v => [v.name, v.name] as [string, string])
          : [["", ""]];
      }), "VAR");
    this.setOutput(true, "Value_Output_Const");
    this.setColour(330);
    this.setTooltip("It returns the name of a constant uint256 variable you've defined.");
  }
};

// ## variables_get_uint256_immutables
Blockly.Blocks['variables_get_uint256_immutables'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("immutable")
      .appendField(new Blockly.FieldDropdown((): [string, string][] => {
        return solidityUint256ImmutablesVariables.length
          ? solidityUint256ImmutablesVariables.map(v => [v.name, v.name] as [string, string])
          : [["", ""]];
      }), "VAR");
    this.setOutput(true, "Value_Output_Imm");
    this.setColour(200);
    this.setTooltip("It returns the name of a immutable uint256 variable you've defined.");
  }
};

// ## variables_get_u256
Blockly.Blocks['variables_get_u256'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Get method (uint256)")
      .appendField(new Blockly.FieldDropdown((): [string, string][] => {
        return solidityUint256Variables.length
          ? solidityUint256Variables.map(v => [v.name, v.name] as [string, string])
          : [["", ""]];
      }), "VAR");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#d9a528");
    this.setTooltip("It returns the value stored in a variable.");
  }
};

// ## variables_get_uint8
Blockly.Blocks['variables_get_uint8'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("uint8")
      .appendField(new Blockly.FieldDropdown((): [string, string][] => {
        return solidityUint8Variables.length
          ? solidityUint8Variables.map(v => [v.name, v.name] as [string, string])
          : [["", ""]];
      }), "VAR");

    this.setOutput(true, "Value_Output");
    this.setColour(230);
    this.setTooltip("It returns the name of a variable you've defined.");
  }
};

// ## 
Blockly.Blocks['variables_set_uint8'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Set variable uint8")
      .appendField(new Blockly.FieldDropdown((): [string, string][] => {
        return solidityUint8Variables.length
          ? solidityUint8Variables.map(v => [v.name, v.name] as [string, string])
          : [["", ""]];
      }), "VAR");

    this.appendValueInput("VALUE")
      // .setCheck("Uint8") // Abilitabile se definisci il tipo nel sistema Blockly
      .appendField("to");

    this.setPreviousStatement(true, "code");
    this.setNextStatement(true, "code");
    this.setColour(230);
    this.setTooltip("Assign a value to the uint8 variable.");
    this.setHelpUrl("");
  }
};

// ## variables_get_uint8_constants
Blockly.Blocks['variables_get_uint8_constants'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("constant")
      .appendField(new Blockly.FieldDropdown((): [string, string][] => {
        return solidityUint8ConstantsVariables.length
          ? solidityUint8ConstantsVariables.map(v => [v.name, v.name] as [string, string])
          : [["", ""]];
      }), "VAR");
    
    this.setOutput(true, "Value_Output_Const");
    this.setColour(330);
    this.setTooltip("It returns the name of a constant uint8 variable you've defined.");
  }
};

// ## variables_get_uint8_immutables
Blockly.Blocks['variables_get_uint8_immutables'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("immutable")
      .appendField(new Blockly.FieldDropdown((): [string, string][] => {
        return solidityUint8ImmutablesVariables.length
          ? solidityUint8ImmutablesVariables.map(v => [v.name, v.name] as [string, string])
          : [["", ""]];
      }), "VAR");
    this.setOutput(true, "Value_Output_Imm");
    this.setColour(200);
    this.setTooltip("It returns the name of an immutable uint8 variable you've defined.");
    this.setHelpUrl("");
  }
};


// ## variables_get_u8
Blockly.Blocks['variables_get_u8'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Get method (uint8)")
      .appendField(new Blockly.FieldDropdown((): [string, string][] => {
        return solidityUint8Variables.length
          ? solidityUint8Variables.map(v => [v.name, v.name] as [string, string])
          : [["", ""]];
      }), "VAR");
      
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("It returns the value stored in a variable.");
    this.setHelpUrl("");
  }
};









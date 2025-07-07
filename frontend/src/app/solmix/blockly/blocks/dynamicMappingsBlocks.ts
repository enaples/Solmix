import * as Blockly from "blockly";
import {updateMappingsDropdown, solidityMappings} from "../dropdown/dropdown";


Blockly.Blocks['getter_mappings'] = {
  init(this: Blockly.Block): void {
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown((): [string, string][] => {
        return solidityMappings.length ? solidityMappings.map(v => [v.name, v.name]) : [["", ""]];
      }), "VAR")
      .appendField("[")
      .appendField(new Blockly.FieldTextInput("value"), "PARAMS1") // Campo di input per i parametri dell'evento
      //.appendStatementInput("PARAMS")
      .appendField("] = ")
      .appendField(new Blockly.FieldTextInput("value"), "PARAMS2");
      //.appendField("");
      // Aggiungi i campi previousStatement e nextStatement
      this.setPreviousStatement(true,"code");
      this.setNextStatement(true, "code");
      this.setOutput(false);
      this.setColour("FE0000");
  }
};




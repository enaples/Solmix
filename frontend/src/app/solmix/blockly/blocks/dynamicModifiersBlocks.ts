import * as Blockly from "blockly";
import { solidityModifiers } from "../dropdown/dropdown";

Blockly.Blocks["variables_get_modifiers"] = {
    init(this: Blockly.Block): void {
        const modifiersDropdown = new Blockly.FieldDropdown(
            (): [string, string][] => {
                return solidityModifiers.length > 0
                    ? solidityModifiers.map(
                          (v) => [v.name, v.name] as [string, string]
                      )
                    : [["", ""]];
            }
        );

        this.appendDummyInput("DUMMY")
            .appendField("Modifiers")
            .appendField(modifiersDropdown, "VAR");

        this.appendStatementInput("PARAMS")
            .setCheck("input")
            .appendField("Parameters");

        this.setPreviousStatement(true, "variables_get_modifiers");
        this.setNextStatement(true, "variables_get_modifiers");
        this.setOutput(false);
        this.setColour(230);
    },
};

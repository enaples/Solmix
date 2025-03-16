import * as Blockly from "blockly";
import { variableTypes } from "../blocks/variable_types";

Object.keys(variableTypes).map((type: string) => (
    Blockly.Extensions.register(
        `${type}_validator`,
        function(){
            const value = this.getField(`${type.toUpperCase()}_VAL`);

            value?.setValidator(variableTypes[type].validator)
        }
    )
))
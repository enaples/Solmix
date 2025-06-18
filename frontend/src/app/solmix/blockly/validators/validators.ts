// Ref. https://github.com/google/blockly-samples/blob/master/codelabs/validation_and_warnings/validation_and_warnings.md

import * as Blockly from "blockly";
import { variableTypes } from "../blocks/variable_types";

Object.keys(variableTypes).map((type: string) => (
    Blockly.Extensions.register(
        `${type}_validator`,
        function(this: Blockly.Block){
            this.setOnChange( function(this: Blockly.Block) {
               
                    const field = this.getField(`${type.toUpperCase()}_VAL`);
                    console.log("field", field);
                    if (field) {
                        const value = field.getValue();
                        if (!variableTypes[type].validator(value)) {
                            this.setWarningText(variableTypes[type].errorMessage ?? null);
                        } else {
                            this.setWarningText(null);
                        }
        
                }
            })
        }
    )
))
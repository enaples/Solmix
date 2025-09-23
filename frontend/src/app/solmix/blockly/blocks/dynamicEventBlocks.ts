import * as Blockly from "blockly";
import { solidityEvents, updateEventsDropdown } from "../dropdown/dropdown";
// Questo array tiene traccia degli eventi Solidity
//const solidityEvents: { name: string }[] = [];
export const solidityGeneratorEvent = new Blockly.Generator("Solidity");

/**
 * Aggiunge un nuovo evento Solidity.
 */

export function addEvent(name: string): void {
    if (!solidityEvents.some((item) => item.name === name)) {
        solidityEvents.push({ name });
        updateEventsDropdown();
        console.log("✅ New Event added:", name);
    } else {
        console.log("⚠️ Event already exists:", name);
    }
}

/**
 * Rimuove un evento dal dropdown.
 */

export function removeEvent(name: string): void {
    const index = solidityEvents.findIndex((item) => item.name === name);
    if (index !== -1) {
        solidityEvents.splice(index, 1);
        updateEventsDropdown();
        console.log("🗑️ Event removed:", name);
    }
}

/**
 * Definizione del blocco emit_event.
 */
Blockly.Blocks["emit_event"] = {
    init(this: Blockly.Block): void {
        this.appendDummyInput() //SENZA "DUMMY" IL DROPDOWN NON SI AGGIORNA
            .appendField("emit")
            .appendField(
                new Blockly.FieldDropdown((): [string, string][] => {
                    return solidityEvents.length
                        ? solidityEvents.map((v) => [v.name, v.name])
                        : [["", ""]];
                }),
                "VAR"
            )
            .appendField("(")
            .appendField(new Blockly.FieldTextInput("input_names"), "PARAMS")
            .appendField(")");

        this.setPreviousStatement(true, "code");
        this.setNextStatement(true, "code");
        this.setOutput(false);
        this.setColour("#FFB280");
    },
};

/**
 * Generatore di codice per emit_event.
 */

/*
solidityGeneratorEvent.forBlock["emit_event"] = function (block){
  //block: Blockly.Block,
  //generator: Blockly.Generator
//): string {
  const variableName = block.getFieldValue("VAR");
  const event = getSolidityEvent(variableName);
  const params = block.getFieldValue("PARAMS");
  const code = event
    ? `emit ${event.name}(${params});\n`
    : "// emit event (undefined)\n";
  return code;
};*/

/*solidityGenerator.forBlock["import"] = function (block) {
    const imp1 = block.getFieldValue("Imp1");
    const imp2 = block.getFieldValue("Imp2");
    return "import {" + imp1 + '} from "' + imp2 + '";\n';
};*/

/*
// // # Dynamic blocks for Event 

// Se solidityEvents è globale:
let solidityEvents = [];
declare const solidityEvents: { name: string }[];

export function addEvent(name) {
  if (!solidityEvents.some(item => item.name === name)) {
    solidityEvents.push({ name });
    updateEventsDropdown();
    console.log("✅ New Event added:", name);
  } else {
    console.log("⚠️ Event already exists:", name);
  }
  //solidityEvents.push({name});
  //updateEventsDropdown();
}

function updateEventsDropdown() {
  const workspace = Blockly.getMainWorkspace();
  const EventsNames = solidityEvents.map(v => v.name);
  workspace.getAllBlocks().forEach(block => {
      if (block.type === 'variables_get_events') {
          const menu = solidityEvents.length ? solidityEvents.map(v => [v.name, v.name]) : [["", ""]];
          block.getField("VAR").menuGenerator_ = menu;
          block.getField("VAR").setValue(EventsNames.includes(block.getFieldValue("VAR")) ? block.getFieldValue("VAR") : "");
      }
  }); 
}

export function getSolidityEvent(name) {
  return solidityEvents.find(variable => variable.name === name);
}

function removeFromDropdown(name, type) {
  if (type === 'array' || type === 'assign_values_to_variable_array') {
    solidityArrays = solidityArrays.filter(item => item.name !== name);
    updateArraysDropdown();
    console.log("🗑️ Vecchio array rimosso:", name);
  } else if (type === 'contract_structures') {
    solidityStructs = solidityStructs.filter(item => item.name !== name);
    updateStructsDropdown();
    console.log("🗑️ Vecchio struct rimosso:", name);
  } else if (type === 'structs_array') {
    solidityStructArrays = solidityStructArrays.filter(item => item.name !== name);
    updateStructArraysDropdown();
    console.log("🗑️ Vecchio structArray rimosso:", name);
  } else if (type === 'mapping') {
    solidityMappings = solidityMappings.filter(item => item.name !== name);
    updateMappingsDropdown();
    console.log("🗑️ Vecchio mapping rimosso:", name);
  } else if (type === 'event'){
    solidityEvents = solidityEvents.filter(item => item.name !== name);
    updateEventsDropdown();
    console.log("🗑️ Vecchio Event rimosso:", name);
  } else if (type === 'modifier1') {
    solidityModifiers = solidityModifiers.filter(item => item.name !== name);
    updateModifiersDropdown();
    console.log("🗑️ Vecchio Modifier rimosso:", name);
  }
}

function alreadyInDropdown(name) {
  return solidityArrays.some(item => item.name === name) ||
         solidityStructs.some(item => item.name === name) ||
         solidityStructArrays.some(item => item.name === name) ||
         solidityMappings.some(item => item.name === name) ||
         solidityEvents.some(item => item.name === name) ||
         solidityModifiers.some(item => item.name === name); //||
}

function addToDropdown(name, type) {
  if (type === 'array' || type === 'assign_values_to_variable_array'){ // || type === 'structs_array') {
    solidityArrays.push({ name });
    updateArraysDropdown();
    console.log("✅ Nuovo array aggiunto:", name);
  } else if (type === 'contract_structures') {
    solidityStructs.push({ name });
    updateStructsDropdown();
    console.log("✅ Nuovo Struct aggiunto:", name);
  } else if (type === 'structs_array') {
    solidityStructArrays.push({ name });
    updateStructArraysDropdown();
    console.log("✅ Nuovo StructArray aggiunto:", name);
  }else if (type === 'mapping') {
    solidityMappings.push({ name });
    updateMappingsDropdown();
    console.log("✅ Nuovo Mapping aggiunto:", name);
  } else if (type === 'event'){
    solidityEvents.push({name});
    updateEventsDropdown();
    console.log("✅ Nuovo Event aggiunto:", name);
  }else if (type === 'modifier1') {
    solidityModifiers.push({name});
    updateModifiersDropdown();
    console.log("✅ Nuovo Modifier aggiunto:", name);
  }
}

Blockly.Blocks["emit_event"] = {
  init(this: Blockly.Block): void {
    this.appendDummyInput()
      .appendField("emit")
      .appendField(
        new Blockly.FieldDropdown((): [string, string][] => {
          return solidityEvents.length
            ? solidityEvents.map((v) => [v.name, v.name])
            : [["", ""]];
        }),
        "VAR"
      )
      .appendField("(")
      .appendField(new Blockly.FieldTextInput("input_names"), "PARAMS")
      .appendField(")");

    this.setPreviousStatement(true, "code");
    this.setNextStatement(true, "code");
    this.setOutput(false);
    this.setColour("#FFB280");
  },
};

// Generazione del codice per il blocco custom_variable_get
  javascriptGenerator.forBlock['emit_event'] = function(block, generator) {
    
    var variable_name = block.getFieldValue('VAR');
    let myVar = getSolidityEvent(variable_name);
    //var params = generator.statementToCode(block, 'PARAMS');
    var params = block.getFieldValue('PARAMS');
    const parentBlock = block.getParent();
    var code = "emit " + myVar.name + '(' + params + ');\n';
    /*if (parentBlock && parentBlock.type === 'method') {
      code = myVar.name + '(' + params + ')';
    }*/
/*return code;
    //return [code, Order.ATOMIC];
  }*/

// const dynamicStructBlocks = [

//     // ## type: contract_structures
//     {
//         type: "contract_structures",
//         message0: "Struct %1 %2 %3",
//         args0: [
//             {
//                 type: "field_input",
//                 name: "NAME",
//                 check: "String",
//                 text: "/* insert a name*/",
//             },
//             {
//                 type: "input_dummy",
//             },
//             {
//                 type: "input_statement",
//                 name: "STATES",
//                 check: "struct_variables",
//             },
//         ],
//         previousStatement: [true, "contract_structures"],
//         nextStatement: [true, "contract_structures"],
//         colour: 150,
//         tooltip: "Define a Solidity Struct type.",
//         helpUrl: "",
//     },

//     // ## type: struct_variables
//     {
//         type: "struct_variables",
//         message0: "%1 %2",
//         args0: [
//             {
//                 type: "field_dropdown",
//                 name: "TYPE",
//                 options: [
//                     ["bool", "TYPE_BOOL"],
//                     ["int", "TYPE_INT"],
//                     ["uint", "TYPE_UINT"],
//                     ["uint256", "TYPE_UINT256"],
//                     ["uint8", "TYPE_UINT8"],
//                     ["string", "TYPE_STRING"],
//                     ["address", "TYPE_ADDRESS"],
//                     ["bytes32", "TYPE_BYTES32"],
//                     ["bytes", "TYPE_BYTES"],
//                 ],
//             },
//             {
//                 type: "field_input",
//                 name: "NAME",
//                 text: "b",
//             },
//         ],
//         previousStatement: [true, "struct_variables"],
//         nextStatement: [true, "struct_variables"],
//         colour: "#FF8000",
//         tooltip: "Struct attribute.",
//         helpUrl: "",
//     },

// ]

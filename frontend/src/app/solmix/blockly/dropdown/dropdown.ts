import * as Blockly from "blockly";

// ## Dichiarazione di tutti i tipi di arrays
// Array di oggetti con il campo name
//export let 
export let solidityModifiers: { name: string }[] = [];
export let solidityEvents: { name: string }[] = [];
export let solidityMappings: { name: string }[] = [];
export let solidityArrays: { name: string }[] = [];
export let solidityStructs: { name: string }[] = [];
export let solidityStructArrays: { name: string }[] = [];

// Registry dei struct
//export const structRegistry: Record<string, unknown> = {};
//export const structRegistry: Record<string, { name: string }[]> = {};
export const structRegistry: Record<string, { name: string; type: string }[]> = {};


type SolidityDropdownType =
  | "array"
  | "assign_values_to_variable_array"
  | "contract_structures"
  | "structs_array"
  | "mapping"
  | "event"
  | "modifier1";


// ## Functions: addToDropdown, RemoveFromDropdown, alreadyInDropdown
// RemoveFromDropsown

/*
export function removeFromDropdown(
  name: string,
  type: SolidityDropdownType
): void {
  if (type === "array" || type === "assign_values_to_variable_array") {
    solidityArrays = solidityArrays.filter((item) => item.name !== name);
    updateArraysDropdown();
    console.log("🗑️ Vecchio array rimosso:", name);
  } else if (type === "contract_structures") {
    solidityStructs = solidityStructs.filter((item) => item.name !== name);
    updateStructsDropdown();
    console.log("🗑️ Vecchio struct rimosso:", name);
  } else if (type === "structs_array") {
    solidityStructArrays = solidityStructArrays.filter(
      (item) => item.name !== name
    );
    updateStructArraysDropdown();
    console.log("🗑️ Vecchio structArray rimosso:", name);
  } else if (type === "mapping") {
    solidityMappings = solidityMappings.filter((item) => item.name !== name);
    updateMappingsDropdown();
    console.log("🗑️ Vecchio mapping rimosso:", name);
  } else if (type === "event") {
    solidityEvents = solidityEvents.filter((item) => item.name !== name);
    updateEventsDropdown();
    console.log("🗑️ Vecchio Event rimosso:", name);
  } else if (type === "modifier1") {
    solidityModifiers = solidityModifiers.filter((item) => item.name !== name);
    updateModifiersDropdown();
    console.log("🗑️ Vecchio Modifier rimosso:", name);
  }
}
  */

export function removeFromDropdown(
  name: string,
  type: SolidityDropdownType
): void {
  switch (type) {
    case "array":
    case "assign_values_to_variable_array":
      solidityArrays = solidityArrays.filter((item) => item.name !== name);
      updateArraysDropdown();
      console.log("🗑️ Vecchio array rimosso:", name);
      break;

    case "contract_structures":
      solidityStructs = solidityStructs.filter((item) => item.name !== name);
      updateStructsDropdown();
      console.log("🗑️ Vecchio struct rimosso:", name);
      break;

    case "structs_array":
      solidityStructArrays = solidityStructArrays.filter(
        (item) => item.name !== name
      );
      updateStructArraysDropdown();
      console.log("🗑️ Vecchio structArray rimosso:", name);
      break;

    case "mapping":
      solidityMappings = solidityMappings.filter((item) => item.name !== name);
      updateMappingsDropdown();
      console.log("🗑️ Vecchio mapping rimosso:", name);
      break;

    case "event":
      solidityEvents = solidityEvents.filter((item) => item.name !== name);
      updateEventsDropdown();
      console.log("🗑️ Vecchio Event rimosso:", name);
      break;

    case "modifier1":
      solidityModifiers = solidityModifiers.filter(
        (item) => item.name !== name
      );
      updateModifiersDropdown();
      console.log("🗑️ Vecchio Modifier rimosso:", name);
      break;
  }
}


// addToDropdown
export function addToDropdown(
  name: string,
  type: SolidityDropdownType
): void {
  switch (type) {
    case "array":
    case "assign_values_to_variable_array":
      solidityArrays.push({ name });
      updateArraysDropdown();
      console.log("✅ Nuovo array aggiunto:", name);
      break;
    case "contract_structures":
      solidityStructs.push({ name });
      updateStructsDropdown();
      console.log("✅ Nuovo Struct aggiunto:", name);
      break;
    case "structs_array":
      solidityStructArrays.push({ name });
      updateStructArraysDropdown();
      console.log("✅ Nuovo StructArray aggiunto:", name);
      break;
    case "mapping":
      solidityMappings.push({ name });
      updateMappingsDropdown();
      console.log("✅ Nuovo Mapping aggiunto:", name);
      break;
    case "event":
      solidityEvents.push({ name });
      updateEventsDropdown();
      console.log("✅ Nuovo Event aggiunto:", name);
      break;
    case "modifier1":
      solidityModifiers.push({ name });
      updateModifiersDropdown();
      console.log("✅ Nuovo Modifier aggiunto:", name);
      break;
  }
}

// alreadyInDropdown
export function alreadyInDropdown(name: string): boolean {
  return (
    solidityArrays.some((item) => item.name === name) ||
    solidityStructs.some((item) => item.name === name) ||
    solidityStructArrays.some((item) => item.name === name) ||
    solidityMappings.some((item) => item.name === name) ||
    solidityEvents.some((item) => item.name === name) ||
    solidityModifiers.some((item) => item.name === name)
  );
}


// ## UpdateDropdown
//Event 
export function updateEventsDropdown(): void {
  const workspace = Blockly.getMainWorkspace();
  const eventNames = solidityEvents.map((v) => v.name);

  workspace.getAllBlocks(false).forEach((block: Blockly.Block) => {
    if (block.type === "emit_event") { //variables_get_events
      const menu: [string, string][] =
        solidityEvents.length
          ? solidityEvents.map((v) => [v.name, v.name])
          : [["", ""]];
      
      const dropdown = block.getField("VAR");
      if (dropdown && "menuGenerator_" in dropdown) {
        (dropdown as any).menuGenerator_ = menu;
        //const current = dropdown.getValue() ?? "";
        
        dropdown.setValue(eventNames.includes(block.getFieldValue("VAR")) ? block.getFieldValue("VAR") : "");//(eventNames.includes(current) ? current : "");
        //dropdown.setValue(eventNames.includes(dropdown) ? dropdown : "");
      
      }
    }
  });
}

export function getSolidityEvent(
  name: string
): { name: string } | undefined {
  return solidityEvents.find((variable) => variable.name === name);
}


// Mapping
export function updateMappingsDropdown(): void {
  const workspace = Blockly.getMainWorkspace();
  const mappingNames = solidityMappings.map((v) => v.name);

  workspace.getAllBlocks(false).forEach((block) => {
    if (block.type === "getter_mappings") {
      const menu: [string, string][] =
        solidityMappings.length > 0
          ? solidityMappings.map((v) => [v.name, v.name])
          : [["", ""]];
      
      const dropdown = block.getField("VAR");
      if (dropdown && "menuGenerator_" in dropdown) {
        (dropdown as any).menuGenerator_ = menu;
        //const current = dropdown.getValue() ?? "";
        
        dropdown.setValue(mappingNames.includes(block.getFieldValue("VAR")) ? block.getFieldValue("VAR") : "");//(eventNames.includes(current) ? current : "");
        //dropdown.setValue(eventNames.includes(dropdown) ? dropdown : "");
      
      }

      /*
      const input = block.getInput("DUMMY");
      if (input) {
        // Rimuove il vecchio campo
        input.removeField("VAR");
        // Crea un nuovo dropdown aggiornato
        const newDropdown = new Blockly.FieldDropdown(menu);
        input.appendField(newDropdown, "VAR");

        // Imposta il valore selezionato se ancora valido
        const current = newDropdown.getValue() ?? "";
        newDropdown.setValue(mappingNames.includes(current) ? current : "");
      }
      */

    }
  });
}

export function getSolidityMapping(
  name: string
): { name: string } | undefined {
  return solidityMappings.find((variable) => variable.name === name);
}

// Arrays
export function updateArraysDropdown(): void {
  const workspace = Blockly.getMainWorkspace();
  const arrayNames = solidityArrays.map((v) => v.name);

  workspace.getAllBlocks(false).forEach((block) => {
    if (block.type === "array_values") {
      const menu: [string, string][] =
        solidityArrays.length > 0
          ? solidityArrays.map((v) => [v.name, v.name])
          : [["", ""]];

      
      const dropdown = block.getField("VAR");
      if (dropdown && "menuGenerator_" in dropdown) {
        (dropdown as any).menuGenerator_ = menu;
        //const current = dropdown.getValue() ?? "";
        
        dropdown.setValue(arrayNames.includes(block.getFieldValue("VAR")) ? block.getFieldValue("VAR") : "");//(eventNames.includes(current) ? current : "");
        //dropdown.setValue(eventNames.includes(dropdown) ? dropdown : "");
      
      }
    }
  });
}

export function getSolidityArray(
  name: string
): { name: string } | undefined {
  return solidityArrays.find((variable) => variable.name === name);
}

// Struct
export function updateStructsDropdown(): void {
  const workspace = Blockly.getMainWorkspace();
  const structNames = solidityStructs.map((v) => v.name);

  workspace.getAllBlocks(false).forEach((block) => {
    if (
      block.type === "structs_array" ||
      block.type === "new_struct" ||
      block.type === "new_struct_value"
    ) {
      const menu: [string, string][] =
        solidityStructs.length > 0
          ? solidityStructs.map((v) => [v.name, v.name])
          : [["", ""]];

      const dropdown = block.getField("VAR");
      if (dropdown && "menuGenerator_" in dropdown) {
        (dropdown as any).menuGenerator_ = menu;
        //const current = dropdown.getValue() ?? "";
        
        dropdown.setValue(structNames.includes(block.getFieldValue("VAR")) ? block.getFieldValue("VAR") : "");//(eventNames.includes(current) ? current : "");
        //dropdown.setValue(eventNames.includes(dropdown) ? dropdown : "");
      
      }
    }
  });
}

export function getSolidityStruct(
  name: string
): { name: string } | undefined {
  return solidityStructs.find((variable) => variable.name === name);
}

// Struct Array
export function updateStructArraysDropdown(): void {
  const workspace = Blockly.getMainWorkspace();
  const structArrayNames = solidityStructArrays.map((v) => v.name);

  workspace.getAllBlocks(false).forEach((block) => {
    if (block.type === "struct_push") {
      const menu: [string, string][] =
        solidityStructArrays.length > 0
          ? solidityStructArrays.map((v) => [v.name, v.name])
          : [["", ""]];

      const dropdown = block.getField("VAR");
      if (dropdown && "menuGenerator_" in dropdown) {
        (dropdown as any).menuGenerator_ = menu;
        //const current = dropdown.getValue() ?? "";
        
        dropdown.setValue(structArrayNames.includes(block.getFieldValue("VAR")) ? block.getFieldValue("VAR") : "");//(eventNames.includes(current) ? current : "");
        //dropdown.setValue(eventNames.includes(dropdown) ? dropdown : "");
      
      }
    }
  });
}

export function getSolidityStructArray(
  name: string
): { name: string } | undefined {
  return solidityStructArrays.find((variable) => variable.name === name);
}

// Modifier
export function updateModifiersDropdown(): void {
  const workspace = Blockly.getMainWorkspace();
  const modifierNames = solidityModifiers.map((v) => v.name);

  workspace.getAllBlocks(false).forEach((block) => {
    if (block.type === "variables_get_modifiers") {
      const menu: [string, string][] =
        solidityModifiers.length > 0
          ? solidityModifiers.map((v) => [v.name, v.name])
          : [["", ""]];

      const dropdown = block.getField("VAR");
      if (dropdown && "menuGenerator_" in dropdown) {
        (dropdown as any).menuGenerator_ = menu;
        //const current = dropdown.getValue() ?? "";
        
        dropdown.setValue(modifierNames.includes(block.getFieldValue("VAR")) ? block.getFieldValue("VAR") : "");//(eventNames.includes(current) ? current : "");
        //dropdown.setValue(eventNames.includes(dropdown) ? dropdown : "");
      
      }
    }
  });
}

export function getSolidityModifier(
  name: string
): { name: string } | undefined {
  return solidityModifiers.find((variable) => variable.name === name);
}

//Struct Attributes Dropdown
export function updateStructAttributeDropdowns(structName: string): void {
  const ws = Blockly.getMainWorkspace();
  const blocks = ws.getAllBlocks(false);
  const attributes: { name: string }[] = structRegistry[structName] || [];

  for (const block of blocks) {
    if (block.type === "new_struct_value") {
      const selectedStruct = block.getFieldValue("VAR");
      if (selectedStruct === structName) {
        const attrDropdown = block.getField("ATTRIBUTE") as Blockly.FieldDropdown;
        const options: [string, string][] =
          attributes.length > 0
            ? attributes.map((attr) => [attr.name, attr.name])
            : [["", ""]];
        (attrDropdown as any).menuGenerator_ = options;
        attrDropdown.setValue(options[0]?.[1] || "");
        console.log(
          `🔁 Dropdown ATTRIBUTI aggiornato per blocco '${block.id}' con struct '${structName}'`
        );
      }
    }

    if (block.type === "new_struct") {
      const selectedStruct = block.getFieldValue("VAR");
      if (selectedStruct === structName) {
        const oldData = block.data ? JSON.parse(block.data) : {};
        const newData = {
          ...oldData,
          values: oldData.values || {},
        };

        block.data = JSON.stringify(newData);
        console.log(
          `🔁 Blocchi new_struct aggiornati per struct '${structName}'`
        );
      }
    }
  }
}

export function getStructAttributesFromBlock(
  block: Blockly.Block
): { name: string; type: string }[] {
  const inputBlock = block.getInputTargetBlock("STATES");
  const attributes: { name: string; type: string }[] = [];

  const typeMap: Record<string, string> = {
    TYPE_BOOL: "bool",
    TYPE_INT: "int",
    TYPE_UINT: "uint",
    TYPE_UINT256: "uint256",
    TYPE_UINT8: "uint8",
    TYPE_STRING: "string",
    TYPE_ADDRESS: "address",
    TYPE_BYTES32: "bytes32",
    TYPE_BYTES: "bytes"
  };

  let current = inputBlock;
  while (current) {
    const typeKey = current.getFieldValue("TYPE");
    const name = current.getFieldValue("NAME");

    if (typeKey && name) {
      const mappedType = typeMap[typeKey];
      if (mappedType) {
        attributes.push({ name, type: mappedType });
      }
    }

    current = current.getNextBlock();
  }

  return attributes;
}







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

export type SolidityAccess = 'public' | 'private' | 'internal' | 'external';

export interface SolidityVariable {
  name: string;
  type: string; // E.g., 'string', 'uint', etc.
  access: SolidityAccess;
  constant?: boolean;
  immutable?: boolean;
  payable?: 'yes' | "doesn't matter"; //vedi se 'no' o 'doesn't matter'
}

export let solidityStringVariables: SolidityVariable[] = [];
export let solidityStringConstantsVariables: SolidityVariable[] = [];
export let solidityStringImmutablesVariables: SolidityVariable[] = [];

export let solidityUintVariables: SolidityVariable[] = [];
export let solidityUintConstantsVariables: SolidityVariable[] = [];
export let solidityUintImmutablesVariables: SolidityVariable[] = [];

export let solidityUint256Variables: SolidityVariable[] = [];
export let solidityUint256ConstantsVariables: SolidityVariable[] = [];
export let solidityUint256ImmutablesVariables: SolidityVariable[] = [];

export let solidityUint8Variables: SolidityVariable[] = [];
export let solidityUint8ConstantsVariables: SolidityVariable[] = [];
export let solidityUint8ImmutablesVariables: SolidityVariable[] = [];

export let solidityIntVariables: SolidityVariable[] = [];
export let solidityIntConstantsVariables: SolidityVariable[] = [];
export let solidityIntImmutablesVariables: SolidityVariable[] = [];

export let solidityAddressVariables: SolidityVariable[] = [];
export let solidityAddressConstantsVariables: SolidityVariable[] = [];
export let solidityAddressImmutablesVariables: SolidityVariable[] = [];

export let solidityBoolVariables: SolidityVariable[] = [];
export let solidityBoolConstantsVariables: SolidityVariable[] = [];
export let solidityBoolImmutablesVariables: SolidityVariable[] = [];

export let solidityBytesVariables: SolidityVariable[] = [];
export let solidityBytesConstantsVariables: SolidityVariable[] = [];
export let solidityBytesImmutablesVariables: SolidityVariable[] = [];

export let solidityBytes32Variables: SolidityVariable[] = [];
export let solidityBytes32ConstantsVariables: SolidityVariable[] = [];
export let solidityBytes32ImmutablesVariables: SolidityVariable[] = [];


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
      //updateStructAttributeDropdowns(name);
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
      //updateStructAttributeDropdowns(name);
      console.log("✅ Nuovo Struct aggiunto:", name);
      break;

    /*case "new_struct_value":
      solidityStructs.push({ name });
      updateStructsDropdown();
      updateStructAttributeDropdowns(name);
      console.log("✅ Nuovo Struct aggiunto:", name);
      break;*/
    
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
// String
export function getSolidityStringVariable(name: string): SolidityVariable | undefined {
  return solidityStringVariables.find(variable => variable.name === name);
}

export function getSolidityStringConstantsVariable(name: string): SolidityVariable | undefined {
  return solidityStringConstantsVariables.find(variable => variable.name === name);
}

export function getSolidityStringImmutablesVariable(name: string): SolidityVariable | undefined {
  return solidityStringImmutablesVariables.find(variable => variable.name === name);
}

// Uint
export function getSolidityUintVariable(name: string): SolidityVariable | undefined {
  return solidityUintVariables.find(variable => variable.name === name);
}

export function getSolidityUintConstantsVariable(name: string): SolidityVariable | undefined {
  return solidityUintConstantsVariables.find(variable => variable.name === name);
}

export function getSolidityUintImmutablesVariable(name: string): SolidityVariable | undefined {
  return solidityUintImmutablesVariables.find(variable => variable.name === name);
}

export function getSolidityUint256Variable(name: string): SolidityVariable | undefined {
  return solidityUint256Variables.find(variable => variable.name === name);
}

export function getSolidityUint256ConstantsVariable(name: string): SolidityVariable | undefined {
  return solidityUint256ConstantsVariables.find(variable => variable.name === name);
}

export function getSolidityUint256ImmutablesVariable(name: string): SolidityVariable | undefined {
  return solidityUint256ImmutablesVariables.find(variable => variable.name === name);
}

export function getSolidityUint8Variable(name: string): SolidityVariable | undefined {
  return solidityUint8Variables.find(variable => variable.name === name);
}

export function getSolidityUint8ConstantsVariable(name: string): SolidityVariable | undefined {
  return solidityUint8ConstantsVariables.find(variable => variable.name === name);
}

export function getSolidityUint8ImmutablesVariable(name: string): SolidityVariable | undefined {
  return solidityUint8ImmutablesVariables.find(variable => variable.name === name);
}

// Int
export function getSolidityIntVariable(name: string): SolidityVariable | undefined {
  return solidityIntVariables.find(variable => variable.name === name);
}

export function getSolidityIntConstantsVariable(name: string): SolidityVariable | undefined {
  return solidityIntConstantsVariables.find(variable => variable.name === name);
}

export function getSolidityIntImmutablesVariable(name: string): SolidityVariable | undefined {
  return solidityIntImmutablesVariables.find(variable => variable.name === name);
}

// Address
export function getSolidityAddressVariable(name: string): SolidityVariable | undefined {
  return solidityAddressVariables.find((variable) => variable.name === name);
}

export function getSolidityAddressConstantsVariable(name: string): SolidityVariable | undefined {
  return solidityAddressConstantsVariables.find(variable => variable.name === name);
}

export function getSolidityAddressImmutablesVariable(name: string): SolidityVariable | undefined{
  return solidityAddressImmutablesVariables.find(variable => variable.name === name);
}

// Boolean
export function getSolidityBoolVariable(name: string): SolidityVariable | undefined {
  return solidityBoolVariables.find((variable) => variable.name === name);
}

export function getSolidityBoolConstantsVariable(name: string): SolidityVariable | undefined {
  return solidityBoolConstantsVariables.find(variable => variable.name === name);
}

export function getSolidityBoolImmutablesVariable(name: string): SolidityVariable | undefined {
  return solidityBoolImmutablesVariables.find(
    (variable: SolidityVariable) => variable.name === name
  );
}

// Bytes - Bytes32
export function getSolidityBytesVariable(name: string): SolidityVariable | undefined {
  return solidityBytesVariables.find((variable: SolidityVariable) => variable.name === name);
}

export function getSolidityBytesConstantsVariable(name: string): SolidityVariable | undefined {
  return solidityBytesConstantsVariables.find((variable: SolidityVariable) => variable.name === name);
}

export function getSolidityBytesImmutablesVariable(name: string): SolidityVariable | undefined {
  return solidityBytesImmutablesVariables.find(
    (variable: SolidityVariable) => variable.name === name
  );
}

export function getSolidityBytes32Variable(name: string): SolidityVariable | undefined {
  return solidityBytes32Variables.find(variable => variable.name === name);
}

export function getSolidityBytes32ConstantsVariable(name: string): SolidityVariable | undefined {
  return solidityBytes32ConstantsVariables.find(variable => variable.name === name);
}

export function getSolidityBytes32ImmutablesVariable(name: string): SolidityVariable | undefined {
  return solidityBytes32ImmutablesVariables.find(variable => variable.name === name);
}

export function findVariable(ast: any, variableName: string): boolean {
  for (const node of ast.nodes) {
    if (node.type === "ContractDefinition") {
      for (const subNode of node.nodes) {
        if (subNode.type === "VariableDeclaration" && subNode.name?.name === variableName) {
          return true;
        }
      }
    }
  }
  return false; // Non trovato
}

export function findVariableType(ast: any, variableName: string): string | null {
  for (const node of ast.nodes) {
    if (node.type === "ContractDefinition") {
      for (const subNode of node.nodes) {
        if (subNode.type === "VariableDeclaration" && subNode.name?.name === variableName) {
          return subNode.typeName?.name || null;
        }
      }
    }
  }
  return null; // Variabile non trovata
}






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

export function addEvent(name: string): void {
  if (!solidityEvents.some((item) => item.name === name)) {
    solidityEvents.push({ name });
    updateEventsDropdown();
    console.log("✅ New Event added:", name);
  } else {
    console.log("⚠️ Event already exists:", name);
  }
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

export function addMapping(name: string): void {
  if (!solidityMappings.some(item => item.name === name)) {
    solidityMappings.push({ name });
    updateMappingsDropdown(); // Aggiorna il dropdown
    console.log("✅ New Mapping added:", name);
  } else {
    console.log("⚠️ Mapping already exists:", name);
  }
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

export function addArray(name: string): void {
  if (!solidityArrays.some(item => item.name === name)) {
    solidityArrays.push({ name });
    updateArraysDropdown(); // Aggiorna il dropdown
    console.log("✅ New Array added:", name);
  } else {
    console.log("⚠️ Array already exists:", name);
  }
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

export function addStruct(name: string): void {
  if (!solidityStructs.some(item => item.name === name)) {
    solidityStructs.push({ name });
    updateStructsDropdown();
    console.log("✅ New Struct added:", name);
  } else {
    console.log("⚠️ Struct already exists:", name);
  }
}

export function saveStruct(name: string, attributes: any[]): void {
  structRegistry[name] = attributes;
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

export function addStructArray(name: string): void {
  if (!solidityStructArrays.some(item => item.name === name)) {
    solidityStructArrays.push({ name });
    updateStructArraysDropdown(); // Aggiorna il dropdown
    console.log("✅ New StructArray added:", name);
  } else {
    console.log("⚠️ StructArray already exists:", name);
  }
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

export function addModifier(name: string): void {
  if (!solidityModifiers.some(item => item.name === name)) {
    solidityModifiers.push({ name });
    updateModifiersDropdown();
    console.log("✅ New Modifier added:", name);
  } else {
    console.log("⚠️ Modifier already exists:", name);
  }
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
          `🔁 Dropdown ATTRIBUTES updates for block '${block.id}' with struct '${structName}'`
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
          `🔁 Blocks new_struct updates for struct '${structName}'`
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







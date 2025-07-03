import * as Blockly from "blockly";
import type { WorkspaceSvg } from "blockly";
import { addToDropdown, removeFromDropdown, alreadyInDropdown } from "../dropdown/dropdown";
//import { getStructAttributesFromBlock, updateStructAttributeDropdowns } from "../dropdown/dropdown";
import { structRegistry, updateStructAttributeDropdowns, getStructAttributesFromBlock } from "../dropdown/dropdown";
//import type { BlockChange } from "blockly/core/events";



/**
 * Listener che intercetta i cambi di nome nei blocchi e aggiorna i dropdown.
 */

/*
export function onBlockChange(event: Blockly.Events.Abstract): void {
  // Ignora eventi che non sono modifiche di campo
  if (
    event.type !== Blockly.Events.CHANGE ||
    (event as Blockly.Events.Change).element !== "field"
  )
    return;

  const ws = Blockly.getMainWorkspace();
  const block = ws.getBlockById(event.blockId || "");
  if (!block) return;

  const fieldName = (event as Blockly.Events.Change).name;
  const newValue = (event as Blockly.Events.Change).newValue;
  const oldValue = (event as Blockly.Events.Change).oldValue;

  const relevantTypes = [
    "array",
    "assign_values_to_variable_array",
    "contract_structures",
    "structs_array",
    "mapping",
    "modifier1",
    "event",
  ];

  if (relevantTypes.includes(block.type) && fieldName === "NAME") {
    const blocksOfSameType = ws.getAllBlocks(false).filter((b) => b.type === block.type);

    // Se c'è solo un blocco di questo tipo e il nome è cambiato
    if (blocksOfSameType.length === 1 && oldValue && oldValue !== newValue) {
      removeFromDropdown(oldValue, block.type);
    }

    if (!alreadyInDropdown(newValue)) {
      addToDropdown(newValue, block.type);
    } else {
      console.log(`⚠️ '${newValue}' già esistente nel dropdown (${block.type})`);
    }
  }

  // Aggiorna structRegistry se cambia uno struct
  if (block.type === "contract_structures") {
    const name = block.getFieldValue("NAME");
    const attributes = getStructAttributesFromBlock(block);
    structRegistry[name] = attributes;
    updateStructAttributeDropdowns(name);
    console.log(`🔄 Attributi dello struct '${name}' aggiornati nel registry.`);
  }
}
  */


type SolidityDropdownType =
  | "array"
  | "assign_values_to_variable_array"
  | "contract_structures"
  | "structs_array"
  | "mapping"
  | "event"
  | "modifier1";

/*
export function onBlockChange(event: Blockly.Events.Abstract): void {
  // Ignora eventi che non sono modifiche di campo
  if (
    event.type !== Blockly.Events.CHANGE ||
    (event as Blockly.Events.Change).element !== "field"
  ) {
    return;
  }

  const ws = Blockly.getMainWorkspace();
  const block = ws.getBlockById(event.blockId || "");
  if (!block) return;

  const changeEvent = event as Blockly.Events.Change;
  const fieldName = changeEvent.name;
  const newValue = changeEvent.newValue;
  const oldValue = changeEvent.oldValue;

  const relevantTypes = [
    "array",
    "assign_values_to_variable_array",
    "contract_structures",
    "structs_array",
    "mapping",
    "modifier1",
    "event"
  ];

  if (relevantTypes.includes(block.type) && fieldName === "NAME") {
    const blocksOfSameType = ws.getAllBlocks(false).filter(
      (b) => b.type === block.type
    );

    // Se c'è solo un blocco di questo tipo e il nome è cambiato
    if (blocksOfSameType.length === 1 && oldValue && oldValue !== newValue) {
      removeFromDropdown(oldValue, block.type as SolidityDropdownType);
    }

    if (!alreadyInDropdown(newValue)) {
      addToDropdown(newValue, block.type as SolidityDropdownType);
    } else {
      console.log(`⚠️ '${newValue}' già esistente nel dropdown (${block.type})`);
    }
  }

  // Aggiorna structRegistry se cambia uno struct
  if (block.type === "contract_structures") {
    const name = block.getFieldValue("NAME");
    const attributes = getStructAttributesFromBlock(block);
    structRegistry[name] = attributes;
    updateStructAttributeDropdowns(name);
    console.log(`🔄 Attributi dello struct '${name}' aggiornati nel registry.`);
  }
}
  */

//import * as Blockly from "blockly";
//import type { BlockChange } from "blockly/core/events/events_block_change";

interface BlockChangeEvent extends Blockly.Events.Abstract {
  element: string;
  name: string;
  oldValue: string;
  newValue: string;
  blockId: string;
}

export function onBlockChange(event: Blockly.Events.Abstract): void {
  if (event.type !== Blockly.Events.BLOCK_CHANGE) {
    return;
  }

  const changeEvent = event as BlockChangeEvent;

  if (changeEvent.element !== "field") {
    return;
  }

  const ws = Blockly.getMainWorkspace();
  const block = ws.getBlockById(changeEvent.blockId || "");
  if (!block) return;

  const fieldName = changeEvent.name;
  const newValue = changeEvent.newValue;
  const oldValue = changeEvent.oldValue;

  const relevantTypes = [
    "array",
    "assign_values_to_variable_array",
    "contract_structures",
    "structs_array",
    "mapping",
    "modifier1",
    "event"
  ];

  if (relevantTypes.includes(block.type) && fieldName === "NAME") {
    const blocksOfSameType = ws.getAllBlocks(false).filter(
      (b) => b.type === block.type
    );

    if (blocksOfSameType.length === 1 && oldValue && oldValue !== newValue) {
      removeFromDropdown(oldValue, block.type as SolidityDropdownType);
    }

    if (!alreadyInDropdown(newValue)) {
      addToDropdown(newValue, block.type as SolidityDropdownType);
    } else {
      console.log(`⚠️ '${newValue}' già esistente nel dropdown (${block.type})`);
    }
  }

  if (block.type === "contract_structures") {
    const name = block.getFieldValue("NAME");
    const attributes = getStructAttributesFromBlock(block);
    structRegistry[name] = attributes;
    updateStructAttributeDropdowns(name);
    console.log(`🔄 Attributi dello struct '${name}' aggiornati nel registry.`);
  }
}


/*
export function onBlockChange(event: Blockly.Events.Abstract): void {
  if (event.type !== Blockly.Events.CHANGE) {
    return;
  }

  const changeEvent = event as BlockChange;

  if (changeEvent.element !== "field") {
    return;
  }

  const ws = Blockly.getMainWorkspace();
  const block = ws.getBlockById(changeEvent.blockId || "");
  if (!block) return;

  const fieldName = changeEvent.name;
  const newValue = changeEvent.newValue;
  const oldValue = changeEvent.oldValue;

  const relevantTypes = [
    "array",
    "assign_values_to_variable_array",
    "contract_structures",
    "structs_array",
    "mapping",
    "modifier1",
    "event"
  ];

  if (relevantTypes.includes(block.type) && fieldName === "NAME") {
    const blocksOfSameType = ws.getAllBlocks(false).filter(
      (b) => b.type === block.type
    );

    if (blocksOfSameType.length === 1 && oldValue && oldValue !== newValue) {
      removeFromDropdown(oldValue, block.type as SolidityDropdownType);
    }

    if (!alreadyInDropdown(newValue)) {
      addToDropdown(newValue, block.type as SolidityDropdownType);
    } else {
      console.log(`⚠️ '${newValue}' già esistente nel dropdown (${block.type})`);
    }
  }

  if (block.type === "contract_structures") {
    const name = block.getFieldValue("NAME");
    const attributes = getStructAttributesFromBlock(block);
    structRegistry[name] = attributes;
    updateStructAttributeDropdowns(name);
    console.log(`🔄 Attributi dello struct '${name}' aggiornati nel registry.`);
  }
}
  */



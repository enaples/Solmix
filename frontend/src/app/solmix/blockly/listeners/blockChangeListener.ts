/*import * as Blockly from "blockly";
import type { WorkspaceSvg } from "blockly";
import { addToDropdown, removeFromDropdown, alreadyInDropdown } from "./dropdownUtils";
import { getStructAttributesFromBlock, updateStructAttributeDropdowns } from "./structUtils";
import { structRegistry } from "./structRegistry";
*/

/**
 * Listener che intercetta i cambi di nome nei blocchi e aggiorna i dropdown.
 */
/*export function onBlockChange(event: Blockly.Events.Abstract): void {
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
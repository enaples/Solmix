import * as Blockly from "blockly";
import {
    addToDropdown,
    removeFromDropdown,
    alreadyInDropdown,
} from "../dropdown/dropdown";
import {
    structRegistry,
    updateStructAttributeDropdowns,
} from "../dropdown/dropdown";

type SolidityDropdownType =
    | "array"
    | "assign_values_to_variable_array"
    | "contract_structures"
    | "structs_array"
    | "mapping"
    | "event"
    | "modifier1";

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
        "event",
        //"new_struct_value"
    ];

    if (relevantTypes.includes(block.type) && fieldName === "NAME") {
        const blocksOfSameType = ws
            .getAllBlocks(false)
            .filter((b) => b.type === block.type);

        if (
            blocksOfSameType.length === 1 &&
            oldValue &&
            oldValue !== newValue
        ) {
            removeFromDropdown(oldValue, block.type as SolidityDropdownType);
        }

        if (!alreadyInDropdown(newValue)) {
            addToDropdown(newValue, block.type as SolidityDropdownType);
        } else {
            console.log(
                `⚠️ '${newValue}' già esistente nel dropdown (${block.type})`
            );
        }
    }
}

// 🔁 Listener per aggiornamento structRegistry
export function onStructRegistryUpdate(event: Blockly.Events.Abstract): void {
    const ws = Blockly.getMainWorkspace();
    if (
        event.type === Blockly.Events.BLOCK_CHANGE ||
        event.type === Blockly.Events.BLOCK_CREATE ||
        event.type === Blockly.Events.BLOCK_DELETE
    ) {
        const allStructs = ws
            .getAllBlocks()
            .filter((b) => b.type === "contract_structures");

        const currentNames = allStructs
            .map((b) => b.getFieldValue("NAME"))
            .filter(Boolean);

        allStructs.forEach((block) => {
            const name = block.getFieldValue("NAME");
            const inputBlock = block.getInputTargetBlock("STATES");

            if (!name || !inputBlock) return;

            const attributes: { name: string; type: string }[] = [];
            //let current = inputBlock;
            let current: Blockly.Block | null = inputBlock;

            const types: Record<string, string> = {
                TYPE_BOOL: "bool",
                TYPE_INT: "int",
                TYPE_UINT: "uint",
                TYPE_UINT256: "uint256",
                TYPE_UINT8: "uint8",
                TYPE_STRING: "string",
                TYPE_ADDRESS: "address",
                TYPE_BYTES32: "bytes32",
                TYPE_BYTES: "bytes",
            };

            while (current) {
                const attrName = current.getFieldValue("NAME");
                const attrType = current.getFieldValue("TYPE");
                if (attrName && attrType && types[attrType]) {
                    attributes.push({ name: attrName, type: types[attrType] });
                }
                current = current.getNextBlock();
            }

            const existing = JSON.stringify(structRegistry[name]);
            const updated = JSON.stringify(attributes);
            if (existing !== updated) {
                structRegistry[name] = attributes;
                updateStructAttributeDropdowns(name);
                console.log(
                    `🔁 Struct "${name}" aggiornato in structRegistry`,
                    attributes
                );
            }
        });

        // 🗑️ Struct rimossi
        Object.keys(structRegistry).forEach((structName) => {
            if (!currentNames.includes(structName)) {
                delete structRegistry[structName];
                console.log(
                    `🗑️ Struct "${structName}" rimosso da structRegistry`
                );
            }
        });
    }
}

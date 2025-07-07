import type { FlyoutButton, Workspace } from "blockly";
import { WorkspaceSvg, Variables, VariableModel } from "blockly";
import { variableTypes } from "../blocks/variable_types";
import * as Blockly from "blockly";

export function mappingFlyoutCallback(
  workspace: WorkspaceSvg
): Blockly.utils.toolbox.ToolboxItemInfo[] {
    const xmlList: Blockly.utils.toolbox.ToolboxItemInfo[] = [];

    xmlList.push({ kind: "block", type: "mapping" });
    xmlList.push({ kind: "block", type: "getter_mappings" }); //## da aggiungere dopo che ho creato i blocchi dinamici getters e setters

     return xmlList;
}

/**
 * Helper to register the flyout callback on a workspace.
 */
export function registerMappingFlyout(workspace: WorkspaceSvg): void {
  workspace.registerToolboxCategoryCallback(
    "NEW_MAPPING",
    mappingFlyoutCallback
  );
}

export function createFlyoutModifier(
 workspace: WorkspaceSvg
): Blockly.utils.toolbox.ToolboxItemInfo[] {
    const xmlList: Blockly.utils.toolbox.ToolboxItemInfo[] = [];

  xmlList.push({ kind: 'block', type: "modifier1" });
  xmlList.push({ kind: 'block', type: "require_condition" });
  xmlList.push({ kind: 'block', type: "func_inputs" });
  xmlList.push({ kind: 'block', type: "variables_get_modifiers" });  // ## da aggiungere dopo che ho creato i blocchi dinamici getters e setters
  return xmlList;
}

export function registerModifierFlyout(workspace: WorkspaceSvg): void {
  workspace.registerToolboxCategoryCallback(
    "NEW_MODIFIER",
    createFlyoutModifier
  );
}

export function createFlyoutEvent(
    workspace: WorkspaceSvg
): Blockly.utils.toolbox.ToolboxItemInfo[] {
    const xmlList: Blockly.utils.toolbox.ToolboxItemInfo[] = [];
    xmlList.push({ kind: 'block', type: "event" });
    xmlList.push({ kind: 'block', type: "func_inputs" });

    // ## da aggiungere dopo che ho creato i blocchi dinamici getters e setters
    xmlList.push({ kind: 'block', type: "emit_event" });

    return xmlList; 
}

export function registerEventFlyout(workspace: WorkspaceSvg): void {
    workspace.registerToolboxCategoryCallback(
        'NEW_EVENT',
    createFlyoutEvent,
    );
}

export function createFlyoutStruct (
    workspace: WorkspaceSvg
): Blockly.utils.toolbox.ToolboxItemInfo[] {
    const xmlList: Blockly.utils.toolbox.ToolboxItemInfo[] = [];
  
    xmlList.push({ kind: 'block', type: "contract_structures" });
    xmlList.push({ kind: 'block', type: "struct_variables" });

    // ## da aggiungere dopo che ho creato i blocchi dinamici, getters e setters

    xmlList.push({ kind: 'block', type: "new_struct_value" });
    xmlList.push({ kind: 'block', type: "structs_array" });
    xmlList.push({ kind: 'block', type: "struct_push" });
    xmlList.push({ kind: 'block', type: "new_struct" });


    //questo blocco era già commentato nel js file
    //xmlList.push({ kind: 'block', type: "assign_values_to_struct" });
    
    return xmlList;
}

export function registerStructFlyout(workspace: WorkspaceSvg): void {
    workspace.registerToolboxCategoryCallback(
    'NEW_STRUCT',
    createFlyoutStruct,
    );
}

export function createFlyoutArray (
    workspace: WorkspaceSvg
): Blockly.utils.toolbox.ToolboxItemInfo[] {
    const xmlList: Blockly.utils.toolbox.ToolboxItemInfo[] = [];
    xmlList.push({ kind: 'block', type: "array" });
    xmlList.push({ kind: 'block', type: "define_arrayVariable" });

    // ## da aggiungere dopo che ho creato i blocchi dinamici, getters e setters
    xmlList.push({ kind: 'block', type: "assign_values_to_variable_array" });
    xmlList.push({ kind: 'block', type: "array_values" });
    xmlList.push({ kind: 'block', type: "array_pop" });
    xmlList.push({ kind: 'block', type: "array_push" });
    xmlList.push({ kind: 'block', type: "array_push_S_A_B" });
    xmlList.push({ kind: 'block', type: "array_delete" });
   
  return xmlList;
}

export function registerArrayFlyout(workspace: WorkspaceSvg): void {
    workspace.registerToolboxCategoryCallback(
    'NEW_ARRAY',
    createFlyoutArray,
    );
}


export default function solidityTypesFlyoutCallback(
    workspace: WorkspaceSvg
): Element[] {
    const varTypes: string[] = Object.keys(variableTypes);

    const xmlButtons = varTypes.map((type: string) => {
        const button = Blockly.utils.xml.createElement("button");
        button.setAttribute("text", `Create ${type}`);
        button.setAttribute(
            "callbackKey",
            `CREATE_VARIABLE_${type.toUpperCase()}`
        );
        return button;
    });

    varTypes.map((type: string) =>
        workspace.registerButtonCallback(
            `CREATE_VARIABLE_${type.toUpperCase()}`,
            (button: FlyoutButton) => {
                Variables.createVariableButtonHandler(
                    button.getTargetWorkspace(),
                    undefined,
                    `${type}`
                );
            }
        )
    );

    const blockList = solidityTypeFlyoutCategoryBlocks(workspace);

    return [...xmlButtons, ...blockList];
}

export function solidityTypeFlyoutCategoryBlocks(
    workspace: Workspace
): Element[] {
    const variableModelList = workspace.getAllVariables();
    const varTypes: string[] = Object.keys(variableTypes);
    const xmlList: Element[] = [];
    if (variableModelList.length > 0) {
        // Process each variable type and create appropriate blocks
        varTypes.forEach((type) => {
            // Filter variables of this specific type
            const typeVariables = variableModelList.filter(
                (variable) => variable.type === type
            );

            // Only proceed if there are variables of this type
            if (typeVariables.length > 0) {
                // Check if the solidity_set block exists for this type
                if (Blockly.Blocks[`solidity_set_${type}`]) {
                    const firstVariable = typeVariables[0];
                    const block = Blockly.utils.xml.createElement("block");
                    block.setAttribute("NAME", firstVariable.name);
                    block.setAttribute("type", `solidity_set_${type}`);
                    block.setAttribute("gap", "24");
                    block.appendChild(
                        Variables.generateVariableFieldDom(firstVariable)
                    );

                    // Add input field
                    const value = Blockly.utils.xml.createElement("field");
                    value.setAttribute("name", `${type.toUpperCase()}_VAL`);
                    value.setAttribute("text", "");
                    block.appendChild(value);
                    xmlList.push(block);
                }

                // Check if the solidity_get block exists for this type
                if (Blockly.Blocks[`solidity_get_${type}`]) {
                    // Sort variables by name
                    typeVariables.sort(VariableModel.compareByName);
                    for (let i = 0; i < typeVariables.length; i++) {
                        const variable = typeVariables[i];
                        const block = Blockly.utils.xml.createElement("block");
                        block.setAttribute("type", `solidity_get_${type}`);
                        block.setAttribute("message0", "%1");

                        const args0 = Blockly.utils.xml.createElement("args0");
                        const field =
                            Blockly.utils.xml.createElement("field_variable");
                        field.setAttribute("type", "field_variable");
                        field.setAttribute("name", "VAR");
                        field.setAttribute(
                            "variable",
                            "%{BKY_VARIABLES_DEFAULT_NAME}%"
                        );
                        field.setAttribute("variableType", type);
                        field.setAttribute("defaultType", type);
                        args0.appendChild(field);
                        block.appendChild(args0);

                        block.setAttribute("output", type);
                        block.setAttribute(
                            "tooltip",
                            variableTypes[type].tooltip
                        );
                        block.setAttribute(
                            "colour",
                            variableTypes[type].colour
                        );
                        block.setAttribute("gap", "8");
                        block.appendChild(
                            Variables.generateVariableFieldDom(variable)
                        );
                        xmlList.push(block);
                    }
                }
            }
        });
    }
    return xmlList;
}

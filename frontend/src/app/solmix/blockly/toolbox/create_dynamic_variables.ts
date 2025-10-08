import type { FlyoutButton, Workspace } from "blockly";
import { WorkspaceSvg, Variables, VariableModel } from "blockly";
import { variableTypes } from "../blocks/variable_types";
import * as Blockly from "blockly";
import { addSolidityVariable } from "../addSolidityType/addSolidityType";
import { SolidityAccess } from "../dropdown/dropdown";

export function mappingFlyoutCallback(
  //workspace: WorkspaceSvg
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
 //workspace: WorkspaceSvg
): Blockly.utils.toolbox.ToolboxItemInfo[] {
    const xmlList: Blockly.utils.toolbox.ToolboxItemInfo[] = [];

  xmlList.push({ kind: 'block', type: "modifier1" });
  xmlList.push({ kind: 'block', type: "require_condition" });
  xmlList.push({ kind: 'block', type: "func_inputs" });
  xmlList.push({ kind: 'block', type: "variables_get_modifiers" });
  xmlList.push({ kind: 'block', type: "input" })  // ## da aggiungere dopo che ho creato i blocchi dinamici getters e setters
  return xmlList;
}

export function registerModifierFlyout(workspace: WorkspaceSvg): void {
  workspace.registerToolboxCategoryCallback(
    "NEW_MODIFIER",
    createFlyoutModifier
  );
}

export function createFlyoutEvent(
    //workspace: WorkspaceSvg
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
    //workspace: WorkspaceSvg
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
    //workspace: WorkspaceSvg
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

// ## STRING VARIABLES

export function createFlyoutString(): Blockly.utils.toolbox.ToolboxItemInfo[] { //createFlyoutString(workspace: WorkspaceSvg)
  const xmlList: Blockly.utils.toolbox.ToolboxItemInfo[] = [];

  // Bottone per creare una nuova variabile
  xmlList.push({
    kind: 'button',
    text: 'Create Variable',
    callbackkey: 'createVariableCallback',
  } as Blockly.utils.toolbox.ButtonInfo);

  // Blocchi da inserire nella categoria
  const blockTypes = [
    "variables_get_string",
    "variables_set_string",
    "variables_get_string_constants",
    "variables_get_string_immutables",
    "variables_get_s"
  ];

  blockTypes.forEach(type => {
    xmlList.push({ kind: 'block', type });
  });

  return xmlList;
}

export function registerStringFlyout(workspace: WorkspaceSvg): void {
  workspace.registerToolboxCategoryCallback(
    'NEW_STRING_VARIABLE',
    createFlyoutString
  );
}

// ## UINT VARIABLES
export function createFlyoutUint(): Blockly.utils.toolbox.ToolboxItemInfo[] { //createFlyoutUint(workspace: Blockly.WorkspaceSvg)
  const xmlList: Blockly.utils.toolbox.ToolboxItemInfo[] = [];

  // Bottone per creare una nuova variabile
  xmlList.push({
    kind: 'button',
    text: 'Create Variable',
    callbackkey: 'createVariableCallback', // usa `callbackkey` minuscolo, non `callbackKey`
  });

  const blockTypes = [
    'address_this_balance',
    'variables_get_uint',
    'variables_set_uint',
    'variables_get_uint_constants',
    'variables_get_uint_immutables',
    'variables_get_u',
    'variables_get_uint256',
    'variables_set_uint256',
    'variables_get_uint256_constants',
    'variables_get_uint256_immutables',
    'variables_get_u256',
    'variables_get_uint8',
    'variables_set_uint8',
    'variables_get_uint8_constants',
    'variables_get_uint8_immutables',
    'variables_get_u8',
  ];

  blockTypes.forEach(type => {
    xmlList.push({ kind: 'block', type });
  });

  return xmlList;
}

export function registerUintFlyout(workspace: Blockly.WorkspaceSvg): void {
  workspace.registerToolboxCategoryCallback('NEW_UINT_VARIABLE', createFlyoutUint);
}

// ## INT VARIABLES
export function createFlyoutInt(): Blockly.utils.toolbox.ToolboxItemInfo[] { //createFlyoutInt(workspace: Blockly.WorkspaceSvg)
  const xmlList: Blockly.utils.toolbox.ToolboxItemInfo[] = [];

   // Bottone per creare una nuova variabile
  xmlList.push({
    kind: 'button',
    text: 'Create Variable',
    callbackkey: 'createVariableCallback', // usa `callbackkey` minuscolo, non `callbackKey`
  });

  const blockTypes = [
    'variables_get_int',
    'variables_set_int',
    'variables_get_int_constants',
    'variables_get_int_immutables',
    'variables_get_i',
  ];

  blockTypes.forEach(type => {
    xmlList.push({ kind: 'block', type });
  });

  return xmlList;
  }

  export function registerIntFlyout(workspace: Blockly.WorkspaceSvg): void {
    workspace.registerToolboxCategoryCallback(
      'NEW_INT_VARIABLE',
      createFlyoutInt,
    );
  }

  // ## ADDRESS VARIABLES
  export function createFlyoutAddress(): Blockly.utils.toolbox.ToolboxItemInfo[] { //createFlyoutAddress(workspace: Blockly.WorkspaceSvg)
  const xmlList: Blockly.utils.toolbox.ToolboxItemInfo[] = [];

  xmlList.push({
    kind: 'button',
    text: 'Create Variable',
    callbackkey: 'createVariableCallback', // usa `callbackkey` minuscolo, non `callbackKey`
  });

  const blockTypes = [
    'address_zero',
    'address_this',
    'variables_get_address',
    'variables_set_address',
    'variables_get_address_constants',
    'variables_get_address_immutables',
    'variables_get_a',
  ];

  blockTypes.forEach(type => {
    xmlList.push({ kind: 'block', type });
  });

  return xmlList;
  }

  export function registerAddressFlyout(workspace: Blockly.WorkspaceSvg): void {
  workspace.registerToolboxCategoryCallback(
    'NEW_ADDRESS_VARIABLE',
    createFlyoutAddress,
  );
}

// ## BOOL VARIABLES
export function createFlyoutBool(): Blockly.utils.toolbox.ToolboxItemInfo[] { //createFlyoutBool(workspace: Blockly.WorkspaceSvg)
  const xmlList: Blockly.utils.toolbox.ToolboxItemInfo[] = [];

    // Bottone per creare una nuova variabile
  xmlList.push({
    kind: 'button',
    text: 'Create Variable',
    callbackkey: 'createVariableCallback', // usa `callbackkey` minuscolo, non `callbackKey`
  });

  const blockTypes = [
    'variables_get_bool',
    'variables_set_bool',
    'variables_get_bool_constants',
    'variables_get_bool_immutables',
    'variables_get_b',
  ];

  blockTypes.forEach(type => {
    xmlList.push({ kind: 'block', type });
  });

  return xmlList;
}

export function registerBoolFlyout(workspace: Blockly.WorkspaceSvg): void {
  workspace.registerToolboxCategoryCallback(
    'NEW_BOOL_VARIABLE',
    createFlyoutBool,
  );
}

// ## BYTES VARIABLES
export function createFlyoutBytes(): Blockly.utils.toolbox.ToolboxItemInfo[] { //createFlyoutBytes(workspace: Blockly.WorkspaceSvg)
  const xmlList: Blockly.utils.toolbox.ToolboxItemInfo[] = [];

   // Bottone per creare una nuova variabile
  xmlList.push({
    kind: 'button',
    text: 'Create Variable',
    callbackkey: 'createVariableCallback', // usa `callbackkey` minuscolo, non `callbackKey`
  });

  const blockTypes = [
    'variables_get_bytes',
    'variables_set_bytes',
    'variables_get_bytes_constants',
    'variables_get_bytes_immutables',
    'variables_get_by',
    'variables_get_bytes32',
    'variables_set_bytes32',
    'variables_get_bytes32_constants',
    'variables_get_bytes32_immutables',
    'variables_get_by32',
  ];

  blockTypes.forEach(type => {
    xmlList.push({ kind: 'block', type });
  });

  return xmlList;
}
  export function registerByteslFlyout(workspace: Blockly.WorkspaceSvg): void {
  workspace.registerToolboxCategoryCallback(
    'NEW_BYTES_VARIABLE',
    createFlyoutBytes,
  );
}


export function createGetterSetterBlocks(
  variableName: string,
  variableType: string,
  variableAccess: SolidityAccess,
  payable_: 'yes' | "doesn't matter",
  //payable_: string,
  varConstant: string,
  varImmutable: string,
  workspace: Blockly.WorkspaceSvg
): void {
  const supportedTypes = [
    'string', 'uint', 'uint256', 'uint8', 'int',
    'bool', 'address', 'bytes', 'bytes32',
  ];

  if (!supportedTypes.includes(variableType)) {
    console.warn(`Type ${variableType} not supported.`);
    return;
  }

  // Aggiungi la variabile alle strutture interne e genera i blocchi
  addSolidityVariable(variableName, variableType, variableAccess, payable_, varConstant, varImmutable);

  // Aggiungi la variabile al workspace
  workspace.createVariable(variableName, variableType);
  console.log("workspace.createvariable executed");
}

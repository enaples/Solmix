import type { FlyoutButton, Workspace } from "blockly";
import { WorkspaceSvg, Variables, VariableModel } from "blockly";
import { variableTypes } from "../blocks/variable_types";
import * as Blockly from "blockly";

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
        console.log(Blockly.Blocks);

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
                    block.setAttribute("type", `solidity_set_${type}`);
                    block.setAttribute("gap", "24");
                    block.appendChild(
                        Variables.generateVariableFieldDom(firstVariable)
                    );
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

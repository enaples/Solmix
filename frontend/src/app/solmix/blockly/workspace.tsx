"use client";
import * as Blockly from "blockly";
import React, { useEffect, useRef, useState } from "react";
import { blocklyToolbox } from "./toolbox/toolbox";
import blocklyTheme from "./blocklyTheme";
import "./blocks/blocks";
import "./blocks/variable_dynamic_blocks";
import { solidityGenerator } from "./generator/solidity";
import { solidityGeneratorEvent } from "./blocks/dynamicEventBlocks";
import solidityTypesFlyoutCallback from "./toolbox/create_dynamic_variables";
import  './blocks/variable_dynamic_blocks';
import "./validators/validators";
// import { solidityTypeFlyoutCategoryBlocks } from "./toolbox/create_dynamic_variables";
import { registerMappingFlyout, registerModifierFlyout, registerEventFlyout, registerStructFlyout, registerArrayFlyout} from "./toolbox/create_dynamic_variables";
import { registerStringFlyout, registerUintFlyout, registerIntFlyout, registerAddressFlyout, registerBoolFlyout, registerByteslFlyout} from "./toolbox/create_dynamic_variables";
import "./blocks/dynamicEventBlocks";
import "./blocks/dynamicMappingsBlocks";
import "./blocks/dynamicModifiersBlocks";
import "./blocks/dynamicStructsBlocks";
import "./blocks/dynamicStructArraysBlocks";
import "./blocks/dynamicArraysBlocks";
import "./blocks/variables_dynamic_string";
import "./blocks/variables_dynamic_uint";
import "./blocks/variables_dynamic_int";
import "./blocks/variables_dynamic_address";
import "./blocks/variables_dynamic_bool";
import "./blocks/variables_dynamic_bytes";
import {onBlockChange, onStructRegistryUpdate} from "../blockly/listeners/blockChangeListener";
import { createGetterSetterBlocks } from '../blockly/toolbox/create_dynamic_variables';
import { SolidityAccess } from "../blockly/dropdown/dropdown";


interface BlocklyEditorProps {
    setCode: (code: string) => void;
}



export default function BlocklyEditor({ setCode }: BlocklyEditorProps) {
    const blocklyDivRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    //const [popupVisible, setPopupVisible] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    /*
    const [varName, setVarName] = useState("");
    const [varType, setVarType] = useState("uint");
    const [varAccess, setVarAccess] = useState("public");
    const [isConstant, setIsConstant] = useState("not");
    const [isImmutable, setIsImmutable] = useState("not");
    const [isPayable, setIsPayable] = useState("not");
    */
    
    const openPopup = () => {
        //setPopupVisible(true);
        if (popupRef.current) popupRef.current.style.visibility = "visible";
    };
    const closePopup = () => {
        //setPopupVisible(false);
        if (popupRef.current) popupRef.current.style.visibility = "hidden";
    };

    /*const handleSubmit = () => {
    console.log({
      name: varName,
      type: varType,
      access: varAccess,
      constant: isConstant === "yes",
      immutable: isImmutable === "yes",
      payable: isPayable === "yes",
    });
    closePopup();
  };*/
    
    const createVariableBlocks = () => {
        const variableName = (document.getElementById("varName") as HTMLInputElement)?.value;
        const variableType = (document.getElementById("varType") as HTMLSelectElement)?.value;
        const variableAccess = (document.getElementById("varAccess") as HTMLSelectElement)?.value as SolidityAccess;
        //const variableAccess = document.getElementById("varAccess").value as SolidityAccess;

        if (!["public", "private", "internal", "external"].includes(variableAccess)) {
        alert("Accesso non valido");
        return;
        }

        const payable = (document.getElementById("payable") as HTMLSelectElement)?.value as 'yes' | "doesn't matter";;
        const constant = (document.getElementById("constant") as HTMLSelectElement)?.value;
        const immutable = (document.getElementById("immutable") as HTMLSelectElement)?.value;

        if (!variableName) {
            alert("Il nome della variabile non può essere vuoto.");
            return;
        }

        console.log({ variableName, variableType, variableAccess, payable, constant, immutable });

        // Qui va la tua funzione personalizzata per generare blocchi
        //createGetterSetterBlocks(variableName, variableType, variableAccess, payable, constant, immutable);

        // Aggiorna la toolbox
        if (workspaceRef.current) {
            createGetterSetterBlocks(variableName, variableType, variableAccess, payable, constant, immutable, workspaceRef.current);
            workspaceRef.current.updateToolbox(blocklyToolbox);
        }

        closePopup();
    };


    useEffect(() => {
        if (!blocklyDivRef.current) return;

        const workspace = Blockly.inject(blocklyDivRef.current, {
            toolbox: blocklyToolbox,
            trashcan: true,
            media: "https://unpkg.com/blockly/media/",
            move: {
                scrollbars: false,
                drag: true,
                wheel: true,
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1,
                maxScale: 2,
                minScale: 0.5,
                scaleSpeed: 1.1,
            },
            theme: blocklyTheme,
        });

        workspace.registerToolboxCategoryCallback(
            "SOLIDITY_TYPE",
            solidityTypesFlyoutCallback
        );

        // Registra la callback per il pulsante "Create variable"
        workspace.registerButtonCallback('createVariableCallback', () => {
            console.log("CREA VARIABILE");
            openPopup();
        });

        registerMappingFlyout(workspace);
        registerModifierFlyout(workspace);
        registerEventFlyout(workspace);
        registerStructFlyout(workspace);
        registerArrayFlyout(workspace);
        registerStringFlyout(workspace);
        registerUintFlyout(workspace);
        registerIntFlyout(workspace);
        registerAddressFlyout(workspace);
        registerBoolFlyout(workspace);
        registerByteslFlyout(workspace);

        workspaceRef.current = workspace;

        const onWorkspaceChange = () => {
            if (workspaceRef.current) {
                const code = solidityGenerator.workspaceToCode(
                    workspaceRef.current
                );
                setCode(code);
            }
        };

        workspace.addChangeListener(onWorkspaceChange);
        workspace.addChangeListener(onBlockChange);
         workspace.addChangeListener(onStructRegistryUpdate);
        

        return () => {
            if (workspaceRef.current) {
                workspaceRef.current.dispose();
            }
        };
    }, [setCode]);

    return (
        <div className="w-full h-full rounded-md">
            <div ref={blocklyDivRef} className="w-full h-full rounded-md" />
            {/* Popup definito qui in JSX */}
            <div ref={popupRef} id="popupOverlay" className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" style={{ visibility: "hidden" }}>
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-bold mb-4">Crea una Variabile</h3>

            { /* popupVisible && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                    <h3 className="text-xl font-semibold mb-4">Crea una Variabile</h3>*/ }

                    <label className="block mb-2">Nome:</label>
                    <input id="varName" type="text" className="w-full border p-1 mb-2" />

                    <label className="block mb-2">Tipo di dato:</label>
                    <select id="varType" className="w-full border p-1 mb-2">
                        <option value="uint">uint</option>
                        <option value="uint256">uint256</option>
                        <option value="uint8">uint8</option>
                        <option value="int">int</option>
                        <option value="bool">bool</option>
                        <option value="address">address</option>
                        <option value="string">string</option>
                        <option value="bytes">bytes</option>
                        <option value="bytes32">bytes32</option>
                    </select>

                    <label className="block mb-2">Tipo di Accesso:</label>
                    <select id="varAccess" className="w-full border p-1 mb-2">
                        <option value="public">public</option>
                        <option value="private">private</option>
                        <option value="internal">internal</option>
                        <option value="external">external</option>
                    </select>

                     <label>Constant:</label>
                    <select id="constant" className="w-full border p-1 mb-2">
                        <option value="doesn't matter">not</option>
                        <option value="yes">yes</option>
                    </select>

                    <label>Immutable:</label>
                    <select id="immutable" className="w-full border p-1 mb-4">
                        <option value="doesn't matter">not</option>
                        <option value="yes">yes</option>
                    </select>

                    <label>Payable (Only for address variables):</label>
                    <select id="payable" className="w-full border p-1 mb-4">
                        <option value="doesn't matter">not</option>
                        <option value="yes">yes</option>
                    </select>

                    <div className="flex justify-end gap-4">
                    <button onClick={createVariableBlocks} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        OK
                    </button>
                    <button onClick={closePopup} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                        Annulla
                    </button>
                    </div>
                </div>
                </div>
                </div>
    );
            {/*)}*/}
        {/*</div>*/}
    {/* ); */}
    
}

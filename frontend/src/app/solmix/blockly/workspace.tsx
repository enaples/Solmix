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
import {onBlockChange} from "../blockly/listeners/blockChangeListener";


interface BlocklyEditorProps {
    setCode: (code: string) => void;
}



export default function BlocklyEditor({ setCode }: BlocklyEditorProps) {
    const blocklyDivRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    const [popupVisible, setPopupVisible] = useState(false);

    const [varName, setVarName] = useState("");
    const [varType, setVarType] = useState("uint");
    const [varAccess, setVarAccess] = useState("public");
    const [isConstant, setIsConstant] = useState("not");
    const [isImmutable, setIsImmutable] = useState("not");
    const [isPayable, setIsPayable] = useState("not");
    
    const openPopup = () => setPopupVisible(true);
    const closePopup = () => setPopupVisible(false);

    const handleSubmit = () => {
    console.log({
      name: varName,
      type: varType,
      access: varAccess,
      constant: isConstant === "yes",
      immutable: isImmutable === "yes",
      payable: isPayable === "yes",
    });
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
        

        return () => {
            if (workspaceRef.current) {
                workspaceRef.current.dispose();
            }
        };
    }, [setCode]);

    return (
        <div className="w-full h-full rounded-md">
            <div ref={blocklyDivRef} className="w-full h-full rounded-md" />
            {popupVisible && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                    <h3 className="text-xl font-semibold mb-4">Crea una Variabile</h3>

                    <label className="block mb-2">Nome:</label>
                    <input className="w-full mb-4 p-2 border" type="text" value={varName} onChange={(e) => setVarName(e.target.value)} />

                    <label className="block mb-2">Tipo di dato:</label>
                    <select className="w-full mb-4 p-2 border" value={varType} onChange={(e) => setVarType(e.target.value)}>
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
                    <select className="w-full mb-4 p-2 border" value={varAccess} onChange={(e) => setVarAccess(e.target.value)}>
                    <option value="public">public</option>
                    <option value="private">private</option>
                    <option value="internal">internal</option>
                    <option value="external">external</option>
                    </select>

                    <label className="block mb-2">Constant:</label>
                    <select className="w-full mb-4 p-2 border" value={isConstant} onChange={(e) => setIsConstant(e.target.value)}>
                    <option value="not">not</option>
                    <option value="yes">yes</option>
                    </select>

                    <label className="block mb-2">Immutable:</label>
                    <select className="w-full mb-4 p-2 border" value={isImmutable} onChange={(e) => setIsImmutable(e.target.value)}>
                    <option value="not">not</option>
                    <option value="yes">yes</option>
                    </select>

                    <label className="block mb-2">Payable (only for Address data type):</label>
                    <select className="w-full mb-4 p-2 border" value={isPayable} onChange={(e) => setIsPayable(e.target.value)}>
                    <option value="not">not</option>
                    <option value="yes">yes</option>
                    </select>

                    <div className="flex justify-end gap-4">
                    <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        OK
                    </button>
                    <button onClick={closePopup} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                        Annulla
                    </button>
                    </div>
                </div>
                </div>
            )}
        </div>
    );
    
}

"use client";
import * as Blockly from "blockly";
import React, { useEffect, useRef } from "react";
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
import "./blocks/dynamicEventBlocks";
import "./blocks/dynamicMappingsBlocks";
import "./blocks/dynamicModifiersBlocks";
import "./blocks/dynamicStructsBlocks";
import "./blocks/dynamicStructArraysBlocks";
import "./blocks/dynamicArraysBlocks";
import {onBlockChange} from "../blockly/listeners/blockChangeListener";


interface BlocklyEditorProps {
    setCode: (code: string) => void;
}



export default function BlocklyEditor({ setCode }: BlocklyEditorProps) {
    const blocklyDivRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

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

        registerMappingFlyout(workspace);
        registerModifierFlyout(workspace);
        registerEventFlyout(workspace);
        registerStructFlyout(workspace);
        registerArrayFlyout(workspace);

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
        
        


        /*const createFlyoutMapping = function (){
        let xmlList = [];
            // Aggiungi i blocchi alla toolbox senza ridefinirli
        
        xmlList.push({ kind: 'block', type: "mapping" });
        xmlList.push({ kind: 'block', type: "getter_mappings" });
        //xmlList.push({ kind: 'block', type: "event" });
        //xmlList.push({ kind: 'block', type: "variables_get_s" });
            
        return xmlList;
        }

        workspace.registerToolboxCategoryCallback(
        'NEW_MAPPING',
        createFlyoutMapping,
        );*/

        return () => {
            if (workspaceRef.current) {
                workspaceRef.current.dispose();
            }
        };
    }, [setCode]);

    return (
        <div className="w-full h-full rounded-md">
            <div ref={blocklyDivRef} className="w-full h-full rounded-md" />
        </div>
    );
}

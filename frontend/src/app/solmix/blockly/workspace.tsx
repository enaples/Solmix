"use client";
import * as Blockly from "blockly";
import React, { useEffect, useRef } from "react";
import { blocklyToolbox } from "./toolbox/toolbox";
import blocklyTheme from "./blocklyTheme";
import "./blocks/blocks";
import "./blocks/variable_dynamic_blocks";
import { solidityGenerator } from "./generator/solidity";
import solidityTypesFlyoutCallback from "./toolbox/create_dynamic_variables";
import  './blocks/variable_dynamic_blocks';
import "./validators/validators";
// import { solidityTypeFlyoutCategoryBlocks } from "./toolbox/create_dynamic_variables";

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

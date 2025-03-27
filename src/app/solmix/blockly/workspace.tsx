"use client";
import * as Blockly from "blockly";
import React, { useEffect, useRef } from "react";
import { blocklyToolbox } from "./toolbox/toolbox";
import blocklyTheme from "./blocklyTheme";
import "./blocks/blocks";
import "./blocks/variable_dynamic_blocks";

import solidityTypesFlyoutCallback from "./toolbox/create_dynamic_variables";

export default function BlocklyEditor() {
    const blocklyDivRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

    useEffect(() => {
        if (!blocklyDivRef.current) return;

        // Create the Blockly workspace
        const workspace = Blockly.inject(blocklyDivRef.current, {
            toolbox: blocklyToolbox,
            trashcan: true,
            media: "https://unpkg.com/blockly/media/",
            move: {
                scrollbars: true,
                drag: true,
                wheel: true,
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2,
            },
            theme: blocklyTheme,
        });

        workspaceRef.current = workspace;

        // register Dynamic Category
        workspace.registerToolboxCategoryCallback(
            "SOLIDITY_TYPE",
            solidityTypesFlyoutCallback
        );

        // Effective resize function
        const resizeBlockly = () => {
            if (workspaceRef.current) {
                // Get the parent element's dimensions
                const parentElement = blocklyDivRef.current?.parentElement;
                if (parentElement) {
                    // Force a resize calculation after the layout is complete
                    setTimeout(() => {
                        if (workspaceRef.current) {
                            Blockly.svgResize(workspaceRef.current);
                        }
                    }, 10);
                }
            }
        };

        // Set up resize handling
        window.addEventListener("resize", resizeBlockly);

        // Initial resize after a short delay to ensure DOM is ready
        setTimeout(resizeBlockly, 50);

        // Return cleanup function
        return () => {
            if (workspaceRef.current) {
                workspaceRef.current.dispose();
            }
            window.removeEventListener("resize", resizeBlockly);
        };
    }, []);

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}
        >
            <div
                ref={blocklyDivRef}
                style={{
                    width: "100%",
                    height: "100%"
                }}
            />
        </div>
    );
}

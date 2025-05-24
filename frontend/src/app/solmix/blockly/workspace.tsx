"use client";
import * as Blockly from "blockly";
import React, { useEffect, useRef } from "react";
import { blocklyToolbox } from "./toolbox/toolbox";
import blocklyTheme from "./blocklyTheme";
import "./blocks/blocks";
import "./blocks/variable_dynamic_blocks";
import { solidityGenerator } from "./generator/solidity";

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
        startScale: 0.8,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      theme: blocklyTheme,
    });

    workspaceRef.current = workspace;

    const onWorkspaceChange = () => {
      if (workspaceRef.current) {
        const code = solidityGenerator.workspaceToCode(workspaceRef.current);
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

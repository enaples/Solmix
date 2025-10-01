"use client";
import React, { useState, useCallback, useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import {
    commentSmartContract,
    explainSmartContract,
    deploySmartContract,
    deployCodeSmartContract
} from "@/app/solmix/FloatingChat/llmAPI";
import solidity from "@/app/solmix/blockly/generator/solidity";

interface CodeViewerPropsDeploy {
    code: string;
    typescriptCode: string;
    language?: string;
    title?: string;
    className?: string;
    style?: React.CSSProperties;
    showLineNumbers?: boolean;
    showCopyButton?: boolean;
    showDownloadButton?: boolean;
    showExplainCodeButton?: boolean;
    showDeployCodeButton?: boolean;
    showExplainSCButton?: boolean;
    showHeader?: boolean;
    placeholder?: string;
    readOnly?: boolean;
    maxHeight?: string;
    onCodeChange?: (code: string) => void;
    fileName?: string;
}

const DeployCodeViewer: React.FC<CodeViewerPropsDeploy> = ({
    code,
    typescriptCode = "",
    language = "typescript",
    title = "",
    className = "",
    style = {},
    showLineNumbers = true,
    showCopyButton = true,
    showDownloadButton = true,
    showDeployCodeButton = true,
    showGenerationCodeButton = true,
    showHeader = true,
    placeholder = `// No code generated yet.\n// Please generate code using the editor.`,
    readOnly = true,
    maxHeight = "600px",
    onCodeChange,
    fileName = "script.ts"
}) => {
    const [copied, setCopied] = useState(false);
    const [deploying, setDeploying] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editableCode, setEditableCode] = useState(typescriptCode);
    const [showSpinner, setShowSpinner] = useState(false);

    // Memoized code processing
    const processedCode = useMemo(() => {
        if (!typescriptCode || typescriptCode.trim() === "") {
            return placeholder;
        }
        return code;
    }, [typescriptCode, placeholder]);

    const codeLines = useMemo(() => {
        return processedCode.split("\n");
    }, [processedCode]);

    const stats = useMemo(() => {
        const lines = codeLines.length;
        const characters = processedCode.length;
        const nonEmptyLines = codeLines.filter(
            (line) => line.trim().length > 0
        ).length;

        return {
            lines,
            characters,
            nonEmptyLines,
            isEmpty: typescriptCode.trim() === "",
        };
    }, [codeLines, processedCode, code]);

    // Memoized code processing
    const processedCodeSol = useMemo(() => {
        if (!code || code.trim() === "") {
            return placeholder;
        }
        return code;
    }, [code, placeholder]);

    const codeLinesSol = useMemo(() => {
        return processedCodeSol.split("\n");
    }, [processedCodeSol]);

    const statsSol = useMemo(() => {
        const lines = codeLinesSol.length;
        const characters = processedCode.length;
        const nonEmptyLines = codeLinesSol.filter(
            (line) => line.trim().length > 0
        ).length;

        return {
            lines,
            characters,
            nonEmptyLines,
            isEmpty: code.trim() === "",
        };
    }, [codeLinesSol, processedCode, code]);

    // explain code in editor
    const handleGenerateDeployCode = useCallback(async () => {
        if (!code || code.trim() === "") return;

        setShowSpinner(true);

        let codeGeneration = deployCodeSmartContract(code);
        let newcode = await codeGeneration;
        handleCodeEdit(newcode);

        setShowSpinner(false);

    }, [code]);

    // Copy to clipboard
    const handleCopy = useCallback(async () => {
        if (!typescriptCode || typescriptCode.trim() === "") return;

        try {
            await navigator.clipboard.writeText(typescriptCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy code:", err);
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = typescriptCode;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [typescriptCode]);

    // Download code as file
    const handleDownload = useCallback(() => {
        if (!typescriptCode || typescriptCode.trim() === "") return;

        setShowSpinner(true);

        const blob = new Blob([typescriptCode], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setShowSpinner(false);

    }, [typescriptCode, fileName]);

    // deploy smart contract
    const handleDeploy = useCallback(async () => {
        if (!typescriptCode || typescriptCode.trim() === "") return;

        setShowSpinner(true);

        let res = await deploySmartContract(typescriptCode);
        console.log(res);  // todo: remove

        setShowSpinner(false);

    }, [typescriptCode]);

    // Handle code editing
    const handleCodeEdit = useCallback(
        (newCode: string) => {
            setEditableCode(newCode);
            onCodeChange?.(newCode);
        },
        [onCodeChange]
    );

    const toggleEdit = useCallback(() => {
        if (readOnly) return;

        if (isEditing) {
            // Save changes
            onCodeChange?.(editableCode);
        } else {
            // Start editing
            setEditableCode(typescriptCode);
        }
        setIsEditing(!isEditing);
    }, [isEditing, readOnly, editableCode, code, onCodeChange]);

    return (
        <div
            className={`flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}
            style={style}
        >
            {/* Spinner */}
            {showSpinner && (
                <div role="status" className="bg-orange-300 p-3 flex items-center justify-center">
                    <svg aria-hidden="true"
                         className="inline w-12 h-12 animate-spin text-orange-400 fill-orange-100"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"/>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"/>
                    </svg>
                    <span className="pl-3">A task is currently running. Changes made to blocks or code before it finishes may not be saved. Please wait for the task to complete for best results.</span>
                </div>
            )}
            {/* Header */}
            {showHeader && (
                <div
                    className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
                    <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-semibold text-gray-800">
                            {title}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span className="px-2 py-1 bg-gray-200 rounded">
                                {language}
                            </span>
                            {!stats.isEmpty && (
                                <>
                                    <span>{stats.lines} lines</span>
                                    <span>•</span>
                                    <span>{stats.characters} chars</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {!readOnly && (
                            <button
                                onClick={toggleEdit}
                                className={`px-3 py-1 text-xs rounded transition-colors ${
                                    isEditing
                                        ? "bg-green-500 text-white hover:bg-green-600"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                                title={isEditing ? "Save changes" : "Edit code"}
                            >
                                {isEditing ? "Save" : "Edit"}
                            </button>
                        )}


                        <button
                            onClick={handleGenerateDeployCode}
                            disabled={statsSol.isEmpty}
                            className={`px-3 py-1 text-xs rounded transition-colors ${
                                generating
                                    ? "bg-green-500 text-white"
                                    : "bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            }`}
                            title="Generate"
                        >
                            {generating ? "✓ Generating deploy code" : "Generate"}
                        </button>


                        {showCopyButton && (
                            <button
                                onClick={handleCopy}
                                disabled={stats.isEmpty}
                                className={`px-3 py-1 text-xs rounded transition-colors ${
                                    copied
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                }`}
                                title="Copy to clipboard"
                            >
                                {copied ? "✓ Copied" : "Copy"}
                            </button>
                        )}

                        {showDownloadButton && (
                            <button
                                onClick={handleDownload}
                                disabled={stats.isEmpty}
                                className={`px-3 py-1 text-xs rounded transition-colors ${
                                    downloaded
                                        ? "bg-green-500 text-white"
                                        : "bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                }`}
                                title="Download as file"
                            >
                                {downloaded ? "✓ Downloaded" : "Download"}
                            </button>
                        )}

                        {showDeployCodeButton && (
                            <button
                                onClick={handleDeploy}
                                disabled={stats.isEmpty}
                                className={`px-3 py-1 text-xs rounded transition-colors ${
                                    deploying
                                        ? "bg-green-500 text-white"
                                        : "bg-green-400 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                }`}
                                title="Deploy the smart contract"
                            >
                                {deploying ? "✓ Deploying" : "Deploy"}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Code display area */}
            <div className="flex-1 overflow-auto" style={{maxHeight}}>
                {isEditing ? (
                    // Editable textarea
                    <textarea
                        value={editableCode}
                        onChange={(e) => handleCodeEdit(e.target.value)}
                        className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 border-none outline-none resize-none"
                        style={{minHeight: "300px"}}
                        spellCheck={false}
                    />
                ) : (
                    // Read-only display
                    // Read-only display with syntax highlighting
                    <div className="font-mono text-sm bg-gray-900 text-gray-100 p-4">
                        <SyntaxHighlighter
                            language={language}
                            style={oneDark}
                            showLineNumbers={showLineNumbers}
                            wrapLines
                            customStyle={{
                                background: "transparent",
                                padding: 0,
                                margin: 0,
                                fontSize: "0.875rem",
                                lineHeight: "1.5rem",
                            }}
                            lineNumberStyle={{
                                minWidth: "2rem",
                                paddingRight: "1rem",
                                color: "#6b7280",
                            }}
                        >
                            {processedCode}
                        </SyntaxHighlighter>
                    </div>
                )}
            </div>

            {/* Footer with stats */}
            {showHeader && (
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                            {!stats.isEmpty ? (
                                <>
                                    <span>
                                        {stats.nonEmptyLines} non-empty lines
                                    </span>
                                    <span>{stats.characters} characters</span>
                                </>
                            ) : (
                                <span>No code generated</span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <span>{language.toUpperCase()}</span>
                            {!readOnly && (
                                <span className="text-blue-500">
                                    • Editable
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeployCodeViewer;

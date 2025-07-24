"use client";
import React, { useState, useCallback, useMemo, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import {explainSmartContract} from "@/app/solmix/FloatingChat/llmAPI";
//import { sendSolidityToServer } from "../../blockly/Server/server";
import { sendSolidityToServer } from "@/app/solmix/blockly/Server/apiClient";

interface CodeViewerProps {
    code: string;
    language?: string;
    title?: string;
    className?: string;
    style?: React.CSSProperties;
    showLineNumbers?: boolean;
    showCopyButton?: boolean;
    showDownloadButton?: boolean;
    showExplainCodeButton?: boolean;
    showHeader?: boolean;
    placeholder?: string;
    readOnly?: boolean;
    maxHeight?: string;
    onCodeChange?: (code: string) => void;
    fileName?: string;
}

const CodeViewer: React.FC<CodeViewerProps> = ({
    code,
    language = "solidity",
    title = "Generated Code",
    className = "",
    style = {},
    showLineNumbers = true,
    showCopyButton = true,
    showDownloadButton = true,
    showExplainCodeButton = true,
    showHeader = true,
    placeholder = `// No code generated yet.\n// Please generate code using the editor.`,
    readOnly = true,
    maxHeight = "600px",
    onCodeChange,
    fileName = "contract.sol",
}) => {
    const [copied, setCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editableCode, setEditableCode] = useState(code);
    //const textareaRef = useRef<HTMLTextAreaElement | null>(null);


    // Memoized code processing
    const processedCode = useMemo(() => {
        if (!code || code.trim() === "") {
            return placeholder;
        }
        return code;
    }, [code, placeholder]);

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
            isEmpty: code.trim() === "",
        };
    }, [codeLines, processedCode, code]);

    // Copy to clipboard
    const handleCopy = useCallback(async () => {
        if (!code || code.trim() === "") return;

        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy code:", err);
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = code;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [code]);

    // Download code as file
    const handleDownload = useCallback(() => {
        if (!code || code.trim() === "") return;

        const blob = new Blob([code], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [code, fileName]);

    // Download code as file
    const handleExplanation = useCallback(async () => {
        // todo: edit code section annotating the code using a llm
        if (!code || code.trim() === "") return;

        let codeExplanation = explainSmartContract(code);
        let newcode = await codeExplanation;
        handleCodeEdit(newcode);
    }, [code]);

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
            setEditableCode(code);
        }
        setIsEditing(!isEditing);
    }, [isEditing, readOnly, editableCode, code, onCodeChange]);

    const goServer = () => {
        console.log("Codice Solidity generato:", code); //codeToSend);
        console.log("Invio codice solidity al server...");
        sendSolidityToServer(code);
        //sendSolidityToServer(code); //codeDiv.value); 
    }

    
    return (
        <div
            className={`flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}
            style={style}
        >
            {/* Header */}
            {showHeader && (
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
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
                                className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                title="Download as file"
                            >
                                Download
                            </button>
                        )}

                        {showExplainCodeButton && (
                            <button
                                onClick={handleExplanation}
                                disabled={stats.isEmpty}
                                className="px-3 py-1 text-xs bg-orange-400 text-white rounded hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                title="Download as file"
                            >
                                Explain code
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Code display area */}
            <div className="flex-1 overflow-auto" style={{ maxHeight }}>
                {/* aggiungo '<div>' per inserire il button di update in caso isEditing sia true */}
                {isEditing ? (
                    
                        // Editable textarea
                        <textarea 
                            value={editableCode}
                            onChange={(e) => handleCodeEdit(e.target.value)}
                            className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 border-none outline-none resize-none"
                            style={{ minHeight: "300px" }}
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

            {/* Button visibile solo in modalità editing */}
                        <button onClick={goServer} 
                        className="px-3 py-1 text-xs bg-orange-400 text-white rounded hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                            Update blocks
                        </button>

            


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

export default CodeViewer;

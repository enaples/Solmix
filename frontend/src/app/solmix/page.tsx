"use client";

import { useState } from "react";
import BlocklyEditor from "@/app/solmix/blockly/workspace";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import CodeViewer from "./components/CodeEditor/codeEditor";
import CardList from "./components/CardList/CardList";
import {defaultOptDetectionCard, defaultVulDetectionCard} from "./components/CardList/types";
import { FloatingChat } from "./FloatingChat";
import {sendLLMessage} from "@/app/solmix/FloatingChat/llmAPI";

import { Detector } from "./components/CardList/types";

// interface AnalysisData {
//     results: {
//         detectors: Detector[];
//     };
// }


// todo: precompilare template, estetica tab

export default function SolmixHome() {
    const [code, setCode] = useState<string>("no code yet");
    const detectors: Detector[] = [];

    return (
        <main className="w-full min-h-screen bg-foreground">
            <div className="w-full min-h-screen grid grid-cols-3">
                {/* Blockly Editor Section */}
                <div className="col-span-2 solmix-tools p-5 rounded-md flex flex-col">
                    <div className="flex-grow overflow-hidden">
                        <BlocklyEditor setCode={setCode} />
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="col-span-1 solmix-tools p-5 flex flex-col">
                    <div className="bg-background rounded-md flex flex-col h-full">
                        <Tabs
                            selectedTabClassName="border-b-2 border-orange-500 text-orange-600 font-semibold"
                            selectedTabPanelClassName="block"
                        >
                            <TabList className="flex space-x-6 border-b border-gray-300 bg-white px-4">
                                <Tab className="px-4 py-3 cursor-pointer hover:text-orange-500 [&.react-tabs__tab--selected]:bg-orange-50">
                                    Code Editor
                                </Tab>
                                <Tab className="px-4 py-3 cursor-pointer hover:text-orange-500 [&.react-tabs__tab--selected]:bg-orange-50">
                                    Vulnerability Report
                                </Tab>
                                <Tab className="px-4 py-3 cursor-pointer hover:text-orange-500 [&.react-tabs__tab--selected]:bg-orange-50">
                                    Code optimization
                                </Tab>
                            </TabList>

                            <TabPanel className="p-0 flex-grow overflow-auto">
                                <CodeViewer
                                    onCodeChange={setCode}
                                    code={code}
                                />
                            </TabPanel>
                            <TabPanel className="p-0 flex-grow overflow-auto">
                                <CardList data={{ detectors }} toKeep={["High", "Medium", "Low"]} defaultData={defaultVulDetectionCard}/>
                            </TabPanel>
                            <TabPanel className="p-0 flex-grow overflow-auto">
                                <CardList data={{ detectors }} toKeep={["Optimization"]} defaultData={defaultOptDetectionCard}/>
                            </TabPanel>
                        </Tabs>
                    </div>
                </div>
            </div>

            <FloatingChat
                title="Solmix AI Assistant"
                initialMessage="Hello! How do you want to edit your Smart Contract?"
                customResponse={async (message) => {
                    const generated_code = sendLLMessage(`${message}`, `${code}`);
                    setCode(await generated_code);
                    return generated_code;
                }}
                primaryColor="#f27b48"
            />
        </main>
    );
}
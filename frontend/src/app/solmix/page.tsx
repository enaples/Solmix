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
import Link from "next/link";

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
                    <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <p className="text-5xl font-black text-global-color-title text-global-color-title mb-4 text-white">
                            Solmix
                        </p>
                    </Link>
                    <div className="flex-grow overflow-hidden">
                        <BlocklyEditor setCode={setCode}/>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="col-span-1 solmix-tools pt-5 pr-5 pb-5 flex flex-col">
                <div className="bg-gray-100 rounded-lg flex flex-col h-full rounded-lg shadow-xl pt-1">
                        <Tabs
                            selectedTabClassName="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-secondary-color hover:text-white font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto font-semibold"
                            selectedTabPanelClassName="block"
                        >
                            <TabList className="p-1 rounded-lg flex mb-1 justify-center-safe">
                                <Tab
                                    className="px-4 py-3 cursor-pointer hover:text-orange-500 [&.react-tabs__tab--selected]:bg-orange-50 font-semibold">
                                    Code Editor
                                </Tab>
                                <Tab
                                    className="px-4 py-3 cursor-pointer hover:text-orange-500 [&.react-tabs__tab--selected]:bg-orange-50 font-semibold">
                                    Vulnerability Report
                                </Tab>
                                <Tab
                                    className="px-4 py-3 cursor-pointer hover:text-orange-500 [&.react-tabs__tab--selected]:bg-orange-50 font-semibold">
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
                                <CardList data={{detectors}} toKeep={["High", "Medium", "Low"]}
                                          defaultData={defaultVulDetectionCard}/>
                            </TabPanel>
                            <TabPanel className="p-0 flex-grow overflow-auto">
                                <CardList data={{detectors}} toKeep={["Optimization"]}
                                          defaultData={defaultOptDetectionCard}/>
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
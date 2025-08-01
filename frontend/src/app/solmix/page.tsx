"use client";

import React, { useState } from "react";
import BlocklyEditor from "@/app/solmix/blockly/workspace";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import CodeViewer from "./components/CodeEditor/codeEditor";
import CardList from "./components/CardList/CardList";
import {defaultOptDetectionCard, defaultVulDetectionCard} from "./components/CardList/types";
import { FloatingChat } from "./FloatingChat";
import {editSmartContract, sendLLMessage} from "@/app/solmix/FloatingChat/llmAPI";

import { Detector } from "./components/CardList/types";
import Link from "next/link";


export default function SolmixHome() {
    const [code, setCode] = useState<string>("no code yet");
    const [showSpinner, setShowSpinner] = useState(false);
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
                    setShowSpinner(true);

                    let generated_code = await editSmartContract(message, code);

                    setCode(generated_code);
                    setShowSpinner(false);
                    return generated_code;
                }}
                primaryColor="#f27b48"
            />
        </main>
    );
}
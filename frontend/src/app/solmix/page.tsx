"use client";

import { useState } from "react";
import BlocklyEditor from "@/app/solmix/blockly/workspace";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { FloatingChat } from "./FloatingChat";
import CodeViewer from "./blockly/codeViewer";
import {sendLLMessage} from "@/app/solmix/FloatingChat/llmAPI";

// todo: precompilare template, estetica tab

export default function SolmixHome() {
    const [code, setCode] = useState<string>("no code yet");

    return (
        <main className="w-full min-h-screen bg-foreground">
            <div className="w-full min-h-screen grid grid-cols-3">
                <div className="col-span-2 solmix-tools p-5 rounded-md">
                    <BlocklyEditor setCode={setCode} />
                </div>

                <div className="col-span-1 solmix-tools pt-5 pb-5 pr-5">
                    <div className="rounded-md bg-background w-full min-h-full">
                        <Tabs
                            selectedTabClassName="border-b-2 border-orange-500 text-orange-600 font-semibold"
                            selectedTabPanelClassName="block"
                        >
                            <TabList className="flex space-x-4 border-b border-gray-300 bg-white px-2">
                                <Tab className="px-4 py-2 cursor-pointer hover:text-orange-500">
                                    Source Report
                                </Tab>
                                <Tab className="px-4 py-2 cursor-pointer hover:text-orange-500">
                                    Vulnerability Report
                                </Tab>
                                <Tab className="px-4 py-2 cursor-pointer hover:text-orange-500">
                                    Code optimization
                                </Tab>
                            </TabList>

                            <TabPanel className="p-0">
                                
                                <CodeViewer
                                    onCodeChange={setCode}
                                    code={code}
                                />
                            </TabPanel>
                            <TabPanel className="p-0">
                                Content for Tab 2
                            </TabPanel>
                            <TabPanel className="p-0">
                                Content for Tab 3
                            </TabPanel>
                        </Tabs>
                    </div>
                </div>
            </div>

            <FloatingChat
                title="Solmix AI Assistant"
                initialMessage="Hello! How do you want to edit your Smart Contract?"
                customResponse={async (message) => {
                    let generated_code = sendLLMessage(`${message}`, `${code}`);
                    setCode(await generated_code);
                    return generated_code;
                }}
                primaryColor="#f27b48"
            />
        </main>
    );
}
"use client"; // This is a client component
import BlocklyEditor from "@/app/solmix/blockly/workspace";
import { useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';

import { FloatingChat } from './components/FloatingChat';


function sendPoeMessage(question: string): string {


    return `Custom response to: "${question}"`;
}

export default function SolmixHome() {
    const [state, setState] = useState("");

    return (

        <main className="w-full min-h-screen bg-foreground">

            <div className="w-full min-h-screen grid grid-cols-3 ">
                <div className="col-span-2 solmix-tools p-5 rounded-md">
                    <BlocklyEditor/>
                </div>
                <div className="col-span-1 solmix-tools pt-5 pb-5 pr-5">
                    <div className="rounded-md bg-background w-full min-h-full">
                        <Tabs>
                            <TabList>
                                <Tab>Tab 1</Tab>
                                <Tab>Tab 2</Tab>
                                <Tab>Tab 3</Tab>
                            </TabList>
                            <TabPanel>Content for Tab 1</TabPanel>
                            <TabPanel>Content for Tab 2</TabPanel>
                            <TabPanel>Content for Tab 3</TabPanel>
                        </Tabs>
                    </div>
                </div>
            </div>

            <FloatingChat
                title="Solmix AI Assistant"
                initialMessage="Hello! How do you want to edit your Smart Contract?"
                customResponse={async (message) => {
                    // You can implement your own response logic here
                    // For example, call an API to get a response
                    return sendPoeMessage(`${message}`);
                }}
                primaryColor="#f27b48"
            />

        </main>
    )
        ;
}

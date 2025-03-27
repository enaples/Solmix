"use client"; // This is a client component
import BlocklyEditor from "@/app/solmix/blockly/workspace";
import NavbarTool from "@/app/ui/navbar-tool";
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { useState } from "react";
import Solidity from "@/app/solmix/solidity/page";
import Link from "next/link";

export default function SolmixHome() {
    const [state, setState] = useState("");
    return (
        <main className="w-full min-h-screen">
            <NavbarTool/>
            <Tabs>
                <TabList>
                    <Tab>Blockly</Tab>
                    <Tab>Smart Contract</Tab>
                </TabList>
                <TabPanel>
                    <div className="w-full min-h-screen grid">
                        <div className="solmix-tools p-5">
                            <BlocklyEditor/>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel>
                    <Solidity/>
                </TabPanel>
            </Tabs>

        </main>
    );
}

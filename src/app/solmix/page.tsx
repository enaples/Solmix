import BlocklyEditor from "./components/workspace";

export default function SolmixHome() {
    return (
        <div
            className="flex flex-col flex-1"
            style={{ minHeight: "calc(100vh - 120px)" }}
        >
            <main className="flex-1 relative">
                <div className="blockly-container absolute inset-y-0 left-0 right-8 p-2">
                    <BlocklyEditor />
                </div>
            </main>
        </div>
    );
}

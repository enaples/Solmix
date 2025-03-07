import BlocklyEditor from "./components/workspace";

export default function Home() {
    return (
        <div className="flex flex-col h-screen">
            <header >
                <h1 className="text-2xl font-bold">Blockly Editor</h1>
            </header>

            <main className="flex-grow relative">
                <div className="blockly-container absolute inset-0 p-4">
                    <BlocklyEditor />
                </div>
            </main>

            <footer >
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-bold">Copyright</h4>
                        <p>
                            Blockchain4All (B4A) PRIN project, funded with
                            support of Ministero dell`&apos;`Università e della Ricerca
                            (MUR)
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold">Contacts</h4>
                        <p>
                            Email:
                            <a
                                href="mailto:info@blockchain4all.it"
                                className="ml-1 text-blue-600 hover:underline"
                            >
                                info@blockchain4all.it
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

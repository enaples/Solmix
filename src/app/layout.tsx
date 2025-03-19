import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Blockchain4All",
    description: "Create, edit, and deploy your smart contract. Easy.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <header>
                    <h1 className="text-2xl font-bold">Blockchain4All</h1>
                </header>

                {children}

                <footer>
                    <div className="max-w-4xl ml-4 md:ml-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-bold">Copyright</h4>
                            <p>
                                Blockchain4All (B4A) PRIN project, funded with
                                support of Ministero dell&apos;Università e
                                della Ricerca (MUR)
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
            </body>
        </html>
    );
}

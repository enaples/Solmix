import type { Metadata } from "next";
import "./ui/globals.css";
import { inter } from '@/app/ui/fonts';
import Footer from '@/app/ui/footer';
// import Navbar from "@/app/ui/navbar";

export const metadata: Metadata = {
    title: "Solmix",
    description: "Create, customize, and deploy your Solidity smart contracts easily with supported visual programming and AI assistance.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" style={{scrollBehavior:'smooth'}}>
            <body className={`${inter.className} antialiased`}>
                {children}
                <Footer />
            </body>
        </html>
    );
}

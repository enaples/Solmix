import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="border-gray-200 bg-foreground">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
                <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span
                        className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Solmix</span>
                </Link>
                <div className="flex items-center space-x-6 rtl:space-x-reverse">
                    <div className="max-w-screen-xl px-4 py-3 mx-auto">
                        <div className="flex items-center">
                            <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
                                <li>
                                    <a href="#"
                                       className="text-gray-900 dark:text-white hover:underline font-semibold"></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

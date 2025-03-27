import {
    UserGroupIcon,
    HomeIcon,
    DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';

import Link from 'next/link';
import {LinkIcon} from "@heroicons/react/16/solid";
import Navbar from "@/app/ui/navbar";

export default function Home() {
    return (
        <main className="w-full">
            <Navbar/>
            <div
                className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <p className="text-4xl font-black text-gray-900 dark:text-white">Smart Contract builder</p>

                <p>
                    Create, customize, and deploy your Solidity smart contracts easily with supported visual
                    programming and AI assistance.
                </p>

                <div className="flex gap-4 items-center flex-col sm:flex-row items-center">
                    <Link
                        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                        href="#choose-template"
                        scroll={true}
                    >
                        Start using Solmix
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg"
                             fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </Link>
                </div>
            </div>
            <div
                className="items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <p id="choose-template" className="text-4xl font-black text-gray-900 dark:text-white mt-10 mb-8">Choose a template</p>
                <div className="sm:items-start grid grid-cols-3 gap-4">
                    <div
                        className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <a href="#">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Blank project
                            </h5>
                        </a>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                            Start building your own custom smart contract from scratch.
                        </p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                            Perfect for developers who need precise control or want to create something unique.
                        </p>
                        <Link key={Link.name} href='solmix' className="flex h-[48px] grow items-center justify-center
                gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 ">
                            Continue
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </Link>
                    </div>

                    <div
                        className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <a href="#">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                DAO Governance Template
                            </h5>
                        </a>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                            Launch your Decentralized Autonomous Organization with this comprehensive template. Built on
                            proven
                            governance frameworks, this template includes essential voting mechanisms, proposal creation
                            and
                            execution, treasury management, and member management systems.
                        </p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                            Ideal for establishing transparent, community-led projects with built-in accountability and
                            decentralized
                            decision-making processes.
                        </p>
                        <Link key={Link.name} href='solmix' className="flex h-[48px] grow items-center justify-center
                gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 ">
                            Continue
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </Link>
                    </div>

                    <div
                        className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <a href="#">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                ERC-20 Token Template
                            </h5>
                        </a>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                            Start with this industry-standard template to create your own fungible token on the
                            blockchain.
                            This
                            ERC-20 compliant template includes all essential functions like transfer, approval, and
                            balance
                            tracking,
                            while allowing you to customize key parameters such as name, symbol, total supply, and
                            decimals.
                        </p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                            Perfect for crowdfunding projects, loyalty programs, or creating your own cryptocurrency
                            without
                            writing
                            complex code from scratch.
                        </p>
                        <Link key={Link.name} href='solmix' className="flex h-[48px] grow items-center justify-center
                gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 ">
                            Continue
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </Link>
                    </div>

                    <div
                        className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <a href="#">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Template name
                            </h5>
                        </a>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                            Description ...
                        </p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                            Perfect for ...
                        </p>
                        <Link key={Link.name} href='solmix' className="flex h-[48px] grow items-center justify-center
                gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 ">
                            Continue
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </Link>
                    </div>

                    <div
                        className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <a href="#">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Template name
                            </h5>
                        </a>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                            Description ...
                        </p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                            Perfect for ...
                        </p>
                        <Link key={Link.name} href='solmix' className="flex h-[48px] grow items-center justify-center
                gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 ">
                            Continue
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </Link>
                    </div>

                    <div
                        className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <a href="#">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Template name
                            </h5>
                        </a>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                            Description ...
                        </p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                            Perfect for ...
                        </p>
                        <Link key={Link.name} href='solmix' className="flex h-[48px] grow items-center justify-center
                gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 ">
                            Continue
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
);
}

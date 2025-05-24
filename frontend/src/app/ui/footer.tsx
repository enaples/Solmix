export default function Footer() {
    return (
        <footer className="bg-white">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="flex mt-4 sm:justify-center sm:mt-0">
                    <a href="mailto:https://www.blockchain4all.it/info@blockchain4all.it"
                       className="text-global-color-text hover:text-foreground ms-5">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                             fill="currentColor" viewBox="0 0 23 23">
                            <path fillRule="evenodd"
                                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                                  clipRule="evenodd"/>
                        </svg>
                    </a>
                    <a href="https://twitter.com/b4a_project"
                       className="text-global-color-text hover:text-foreground ms-5"
                       target="_blank">
                        <svg className="w-4 h-4"
                             xmlns="http://www.w3.org/2000/svg"
                             fill="currentColor"
                             viewBox="0 0 512 512">
                            <path fillRule="evenodd"
                                  d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                                  clipRule="evenodd"/>
                        </svg>
                    </a>
                    <a href="#" className="text-global-color-text hover:text-foreground ms-5">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                             fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                  d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                                  clipRule="evenodd"/>
                        </svg>
                    </a>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-400 lg:my-8"/>

                <span className="block text-sm text-global-color-text sm:text-center dark:text-gray-400">© 2025 <a
                    href="https://www.blockchain4all.it/"
                    className="hover:underline">Blockchain4All (B4A) PRIN project</a>, funded with support of Ministero dell’Università e della Ricerca (MUR).</span>

                <span
                    className="block text-sm text-global-color-text sm:text-center dark:text-gray-400">All Rights Reserved.</span>
            </div>
        </footer>
    );
}

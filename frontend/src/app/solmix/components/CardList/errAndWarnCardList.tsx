import React from "react";
import { AlertCircle, AlertTriangle, XCircle } from "lucide-react";

interface ErrAndWarnCardListProps {
    errorMessage: string | null;
    compilerErrors: string[];
    compilerWarnings: string[];
}

const ErrAndWarnCardList: React.FC<ErrAndWarnCardListProps> = ({
    errorMessage,
    compilerErrors,
    compilerWarnings,
}) => {
    return (
        <div className="p-4 space-y-4 bg-gray-50 h-full overflow-auto">
            {/* Main Error Message */}
            {errorMessage && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start">
                        <XCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-lg font-semibold text-red-800 mb-1">
                                Analysis Failed
                            </h3>
                            <p className="text-red-700 text-sm">
                                {errorMessage}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Compiler Errors */}
            {compilerErrors && compilerErrors.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        Compiler Errors ({compilerErrors.length})
                    </h3>
                    {compilerErrors.map((error, index) => (
                        <div
                            key={`error-${index}`}
                            className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center mr-3 mt-0.5">
                                    <span className="text-white text-xs font-bold">
                                        {index + 1}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-red-800 text-sm leading-relaxed">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Compiler Warnings */}
            {compilerWarnings && compilerWarnings.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                        Compiler Warnings ({compilerWarnings.length})
                    </h3>
                    {compilerWarnings.map((warning, index) => (
                        <div
                            key={`warning-${index}`}
                            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-yellow-500 flex items-center justify-center mr-3 mt-0.5">
                                    <span className="text-white text-xs font-bold">
                                        {index + 1}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-yellow-800 text-sm leading-relaxed">
                                        {warning}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!errorMessage &&
                (!compilerErrors || compilerErrors.length === 0) &&
                (!compilerWarnings || compilerWarnings.length === 0) && (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center text-gray-500">
                            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                            <p className="text-lg">
                                No errors or warnings to display
                            </p>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default ErrAndWarnCardList;

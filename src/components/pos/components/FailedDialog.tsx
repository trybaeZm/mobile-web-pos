import { AlertCircle, X, RefreshCcw } from "lucide-react";

interface FailedDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onRetry?: () => void;
    title?: string;
    message?: string;
}

export function FailedDialog({
    isOpen,
    onClose,
    onRetry,
    title = "Operation Failed",
    message = "Something went wrong. Please try again."
}: FailedDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {title}
                    </h2>

                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        {message}
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg font-medium transition-colors text-gray-700 dark:text-gray-300"
                        >
                            Close
                        </button>
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCcw className="w-4 h-4" />
                                Retry
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

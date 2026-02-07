import { CheckCircle2, Copy, X } from "lucide-react";
import { useState } from "react";

interface SuccessDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    orderId?: string;
}

export function SuccessDialog({
    isOpen,
    onClose,
    title = "Success!",
    message = "Operation completed successfully.",
    orderId
}: SuccessDialogProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const copyToClipboard = () => {
        if (orderId) {
            navigator.clipboard.writeText(orderId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {title}
                    </h2>

                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        {message}
                    </p>

                    {orderId && (
                        <div className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-6 flex items-center justify-between border border-gray-100 dark:border-gray-700">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                Order ID: {orderId}
                            </span>
                            <button
                                onClick={copyToClipboard}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors relative"
                                title="Copy Order ID"
                            >
                                {copied ? (
                                    <span className="text-xs text-green-600 font-medium absolute -top-8 left-1/2 -translate-x-1/2 bg-white shadow-sm px-2 py-1 rounded">Copied!</span>
                                ) : (
                                    <Copy className="w-4 h-4 text-gray-400" />
                                )}
                            </button>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg font-medium transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

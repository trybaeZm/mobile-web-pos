import { Loader2 } from "lucide-react";

interface LoadingDialogProps {
    isOpen: boolean;
    message?: string;
}

export function LoadingDialog({ isOpen, message = "Processing..." }: LoadingDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl flex flex-col items-center gap-4 min-w-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{message}</p>
            </div>
        </div>
    );
}
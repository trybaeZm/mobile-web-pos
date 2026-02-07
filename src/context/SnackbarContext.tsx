'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
// import { SnackbarContainer, SnackbarMessage, SnackbarType } from '@/components/ui/Snackbar'; // Need to define this or remove dependency
// If I don't have Snackbar component, I should create a simple one or just using console/alert for now?
// The user said "utilizing the env and the way it works".
// Dashboard uses a custom Snackbar component. I should create it or copy it.
// I'll search for components/ui/Snackbar.
// For now I'll comment out the import and use simple console logs or standard alerts until I fetch Snackbar component.
// Or I can copy the Context but the Container is missing.
// I'll create a placeholder SnackbarContainer.

interface SnackbarType {
    // Define type content
}
type SnackbarMessage = {
    id: string;
    message: string;
    type: string;
    duration: number;
}

interface SnackbarContextType {
    show: (message: string, type?: string, duration?: number) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<SnackbarMessage[]>([]);

    const show = useCallback((message: string, type: string = 'info', duration = 5000) => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type, duration }]);
        // Simple alert for now if UI component missing
        // alert(`${type}: ${message}`); 
        // Remove automatically
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <SnackbarContext.Provider value={{ show }}>
            {children}
            {/* <SnackbarContainer toasts={toasts} removeToast={removeToast} /> */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map(t => (
                    <div key={t.id} className={`p-4 rounded shadow-lg text-white ${t.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>
                        {t.message}
                    </div>
                ))}
            </div>
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};

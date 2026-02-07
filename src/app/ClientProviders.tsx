'use client';

import { Provider } from "react-redux";
import { store } from "@/store/store";
// import ReactQueryProvider from "@/components/ReactQueryProvider"; // Removed since handled in layout or need to copy separately
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import InitUserData from "./InitUserData";
import { SnackbarProvider } from "@/context/SnackbarContext";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const queryClient = new QueryClient()

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        // <Provider store={store}> // Already in RootLayout
        <QueryClientProvider client={queryClient}>
            <SnackbarProvider>
                <ThemeProvider>
                    <InitUserData>
                        {children}
                    </InitUserData>
                </ThemeProvider>
            </SnackbarProvider>
        </QueryClientProvider>
        // </Provider>
    );
}

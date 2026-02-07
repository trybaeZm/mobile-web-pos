'use client';

import { Provider } from "react-redux";
import { store } from "@/store/store";
// import ReactQueryProvider from "@/components/ReactQueryProvider"; // Removed since handled in layout or need to copy separately
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import InitUserData from "./InitUserData";
import { SnackbarProvider } from "@/context/SnackbarContext";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const queryClient = new QueryClient()

import NavigationLayout from "@/components/layout/NavigationLayout";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <SnackbarProvider>
                    <ThemeProvider>
                        <InitUserData>
                            <NavigationLayout>
                                {children}
                            </NavigationLayout>
                        </InitUserData>
                    </ThemeProvider>
                </SnackbarProvider>
            </QueryClientProvider>
        </Provider>
    );
}

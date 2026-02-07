'use client'
import "./globals.css" // Changed from ../css/style.css to gloabl.css (standard next app) or I should copy style.css
import React from "react"
// import ReactQueryProvider from "@/components/ReactQueryProvider" // Need this
import { themeScript } from "./theme-script"
import { Provider } from "react-redux"
import { store } from "@/store/store"
import ClientProviders from "./ClientProviders"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Simple ReactQueryProvider inline
const queryClient = new QueryClient()
function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Provider store={store}>
      <html suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{ __html: themeScript() }}
          />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" />
          <title>Trybae POS</title>
        </head>
        <body suppressHydrationWarning className="dark:bg-boxdark-2 dark:text-bodydark">
          <ReactQueryProvider>
            {/* Load user data when app starts */}
            <ClientProviders>
              {children}
              <div className="fixed bottom-5 right-5 z-50">
                <ThemeToggle />
              </div>
            </ClientProviders>
          </ReactQueryProvider>
        </body>
      </html>
    </Provider>
  )
}

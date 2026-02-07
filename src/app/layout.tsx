import "./globals.css"
import React from "react"
import { themeScript } from "./theme-script"
import ClientProviders from "./ClientProviders"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "Trybae POS",
  description: "Point of Sale for Trybae",
  manifest: "/manifest.json",
  icons: {
    icon: "/globe.svg",
    apple: "/globe.svg",
  }
}

export const viewport: Viewport = {
  themeColor: "#317EFB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeScript() }}
        />
      </head>
      <body suppressHydrationWarning className="dark:bg-boxdark-2 dark:text-bodydark">
        <ClientProviders>
          {children}
          <div className="fixed bottom-5 right-5 z-50">
            <ThemeToggle />
          </div>
        </ClientProviders>
      </body>
    </html>
  )
}

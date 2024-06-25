"use client"

import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"

import { queryClient } from "@/api/query-client"
import { QueryClientProvider } from "@tanstack/react-query"
import { ConfigProvider } from "antd"
import colors from "tailwindcss/colors"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={inter.className}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: colors.emerald[500],
            },
          }}
        >
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </ConfigProvider>
      </body>
    </html>
  )
}

import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Mona_Sans as FontSans, Playfair_Display as FontSerif } from "next/font/google"
import { cn } from "@/lib/utils"
// import { ThemeProvider } from "@/components/theme-provider"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontSerif = FontSerif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
})

// Use the serif font as the heading font
const fontHeading = fontSerif

export const metadata: Metadata = {
  title: "Welcome",
  description: "Sign in or create an account to get started",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontSerif.variable,
          fontHeading.variable,
        )}
      >
          {children}
      </body>
    </html>
  )
}


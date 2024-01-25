import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google";

import '../globals.css'
import { ukUA } from "@clerk/localizations";

export const metadata = {
    title: 'Knot',
    description: 'A Next.js 14 Meta Knot',
}

const inter = Inter({ subsets: ['latin']});

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <ClerkProvider localization={ukUA}>
        <html lang="en">
          <body className={`${inter.className} bg-dark-1`}>
            {children}
            </body>
        </html>
      </ClerkProvider>
    )
  }
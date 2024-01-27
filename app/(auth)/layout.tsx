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
        <html lang="ua">
          <body className={`${inter.className} bg-dark-1 h-full py-5 flex justify-center items-center`}>
              {children}
            </body>
        </html>
      </ClerkProvider>
    )
  }
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import Topbar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Bottombar from "@/components/shared/Bottombar";
import { ukUA } from "@clerk/localizations";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Knot',
  description: 'A Next.js 14 Meta Knot',
}

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <ClerkProvider localization={ukUA}>
        <html lang="ua">
          <body className={inter.className}>
            <Topbar />

            <main className="flex">
              <LeftSidebar />

              <section className="main-container">
                <div className="w-full max-w-4xl">
                  {children}
                </div>
              </section>

              <RightSidebar />
            </main>

            <Bottombar />
          </body>
        </html>
      </ClerkProvider>
    )
  }

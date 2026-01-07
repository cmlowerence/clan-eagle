import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Script from "next/script"; // <--- IMPORT THIS

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clash Troop Themes",
  description: "Dynamic Themed Clash of Clans Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-skin-bg text-skin-text transition-colors duration-500">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </ThemeProvider>

        {/* --- ERUDA MOBILE CONSOLE INJECTOR --- */}
        <Script 
          src="//cdn.jsdelivr.net/npm/eruda" 
          strategy="afterInteractive"
          onLoad={() => {
            // @ts-ignore
            if (typeof eruda !== 'undefined') eruda.init();
          }}
        />
        {/* ------------------------------------- */}
      
      </body>
    </html>
  );
}


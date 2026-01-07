import type { Metadata } from "next";
import { Inter, Luckiest_Guy } from "next/font/google"; // <--- Import from google
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import FaviconManager from "@/components/FaviconManager";

// 1. Setup Inter (Standard Text)
const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter' 
});


const clashFont = Luckiest_Guy({
  subsets: ["latin"],
  weight: "400",
  variable: '--font-clash',
});

export const metadata: Metadata = {
  title: "Clan Eagle",
  description: "Clash of Clans Stats & Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${clashFont.variable} bg-skin-bg text-skin-text transition-colors duration-300 min-h-screen relative`}>
        
        {/* TEXTURE OVERLAY */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        
        <ThemeProvider>
          <FaviconManager />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="container mx-auto px-4 py-6 flex-1">
              {children}
            </main>
            
            {/* Footer */}
            <footer className="border-t border-skin-primary/10 py-8 text-center mt-10">
              <p className="text-skin-muted text-xs font-mono">
                Clan Eagle &copy; 2026. Not affiliated with Supercell.
              </p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

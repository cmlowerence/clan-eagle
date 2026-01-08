 import type { Metadata, Viewport } from "next";
import { Inter, Luckiest_Guy } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter',
  display: 'swap',
});

const clashFont = Luckiest_Guy({
  weight: "400",
  subsets: ["latin"],
  variable: '--font-clash',
  display: 'swap',
});

// PWA & Meta Configuration
export const metadata: Metadata = {
  title: "Clan Eagle",
  description: "Advanced Clash of Clans Tracker & Army Planner",
  manifest: "/manifest.json", // Link to manifest
  icons: {
    icon: "/assets/icons/electro_owl.png", // Static Electro Owl
    apple: "/assets/icons/electro_owl.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${clashFont.variable} font-sans bg-skin-bg text-skin-text transition-colors duration-300 min-h-screen relative`}>
        {/* TEXTURE OVERLAY */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        
        <ThemeProvider>
          {/* Removed FaviconManager for static icon */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="container mx-auto px-4 py-6 flex-1">
              {children}
            </main>
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

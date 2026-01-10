import type { Metadata, Viewport } from "next";
import { Inter, Luckiest_Guy } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundSlider from "@/components/BackgroundSlider";

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

export const metadata: Metadata = {
  title: "Clan Eagle",
  description: "Advanced Clash of Clans Tracker & Army Planner",
  manifest: "/manifest.json",
  icons: {
    icon: "/assets/icons/electro_owl.png", 
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
      <body className={`${inter.variable} ${clashFont.variable} font-sans text-skin-text min-h-screen relative overflow-x-hidden`}>
        
        {/* Dynamic Background */}
        <BackgroundSlider />

        {/* Texture Pattern Overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-[-40] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        
        <ThemeProvider>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="container mx-auto px-4 py-6 flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        
      </body>
    </html>
  );
}

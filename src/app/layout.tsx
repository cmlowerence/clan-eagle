import type { Metadata, Viewport } from "next";
import { Inter, Luckiest_Guy } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundSlider from "@/components/BackgroundSlider";
import Eruda from "@/components/Eruda";
import ErrorBoundary from "@/components/ErrorBoundary";

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
        
        <BackgroundSlider />

        <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-[-40] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        
        <ThemeProvider>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="container mx-auto px-4 py-6 flex-1">
              {/* Wraps page content to catch crashes without breaking the layout */}
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
            <Footer />
          </div>
        </ThemeProvider>

        <div className="fixed z-[1000] bottom-0 right-0">
          <Eruda />
        </div>
        
      </body>
    </html>
  );
}

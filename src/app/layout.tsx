import type { Metadata } from "next";
import { Inter, Luckiest_Guy } from "next/font/google"; // Import the Clash-style font
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Eruda from "@/components/Eruda";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
// Initialize the Clash Font
const clashFont = Luckiest_Guy({ 
  weight: "400", 
  subsets: ["latin"],
  variable: '--font-clash' 
});

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
      <body className={`${inter.variable} ${clashFont.variable} font-sans`}>
        <ThemeProvider>
          <div className="min-h-screen bg-skin-bg text-skin-text transition-colors duration-500">
            <Navbar />
            <main className="container mx-auto px-2 md:px-4 py-4 md:py-8">
              {children}
            </main>
          </div>
        </ThemeProvider>
        <Eruda />
      </body>
    </html>
  );
}


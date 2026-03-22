import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppPrivyProvider } from "@/components/providers/privy-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Hacker House Protocol",
  description: "Find your Builder. Build together. Live the protocol.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        inter.variable,
        spaceGrotesk.variable,
        jetbrainsMono.variable
      )}
    >
      <body className="antialiased">
        <AppPrivyProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AppPrivyProvider>
      </body>
    </html>
  );
}

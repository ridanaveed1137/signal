import CommandPalette from "@/components/CommandPalette";
import type { MetaData } from "next";
import { JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/inter";
import "./globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const heading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Signal",
  description: "Signal: trends, tools, research, and projects from the cybersecurity community.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
    <body className={`${mono.variable} ${heading.variable} bg-bg text-tx font-mono min-h-screen flex flex-col`}>
  <Header />
  {children}
  <Footer />
  <CommandPalette />
</body>
    </html>
  );
}

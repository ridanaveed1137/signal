import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/inter";
import "@fontsource/bebas-neue";
import "@fontsource-variable/caveat";
import "@fontsource/instrument-serif";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/unbounded";
import "@fontsource-variable/caveat";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";

export const metadata: Metadata = {
  title: "Signal",
  description:
    "Signal: trends, tools, research, and projects from the cybersecurity community.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-bg text-tx">
        <Header />
        {children}
        <Footer />
        <CommandPalette />
      </body>
    </html>
  );
}
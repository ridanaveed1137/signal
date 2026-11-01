import type { Metadata } from "next";
import HomePage from "@/components/HomePage";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Signal",
  description:
    "Trends, tools, ports and projects from the people building and breaking security. Curated and written by the community.",
};

export default HomePage;
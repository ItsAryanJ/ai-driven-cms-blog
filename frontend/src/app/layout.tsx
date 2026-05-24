import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "BlogCMS — AI-Driven Blog Platform",
    template: "%s | BlogCMS",
  },
  description:
    "A modern self-hosted blog platform with powerful markdown editing, category and tag management, and a beautiful reading experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="min-h-screen bg-[#0a0a12] text-white antialiased">
        {children}
      </body>
    </html>
  );
}

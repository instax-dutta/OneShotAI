import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OneShotAI – AI-Powered Prompt Engineering Tool",
  description: "OneShotAI helps AI developers generate highly effective one-shot prompts based on user ideas. Fast, intuitive, and powered by Mistral API.",
  keywords: [
    "AI",
    "Prompt Engineering",
    "One-Shot Prompts",
    "Mistral API",
    "Next.js",
    "AI Development",
    "AI Tools"
  ],
  openGraph: {
    title: "OneShotAI – AI-Powered Prompt Engineering Tool",
    description: "Generate optimized one-shot prompts for AI development. Simple, fast, and powered by Mistral API.",
    url: "https://oneshotai.com/",
    siteName: "OneShotAI",
    images: [
      {
        url: "https://oneshotai.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "OneShotAI – AI-Powered Prompt Engineering Tool"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "OneShotAI – AI-Powered Prompt Engineering Tool",
    description: "Generate optimized one-shot prompts for AI development. Simple, fast, and powered by Mistral API.",
    images: ["https://oneshotai.com/og-image.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

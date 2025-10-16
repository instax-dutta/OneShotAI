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
  title: "OneShotAI – Big Update: History, Templates, Better Prompts",
  description: "New release: auto-saved prompt history with tags/search, curated templates, real-time guidance, improved run controls, and accessibility. Powered by Mistral API.",
  keywords: [
    "AI",
    "Prompt Engineering",
    "One-Shot Prompts",
    "Prompt History",
    "Templates",
    "Accessibility",
    "Mistral API",
    "Next.js",
    "AI Development",
    "AI Tools"
  ],
  openGraph: {
    title: "OneShotAI – Big Update: History, Templates, Better Prompts",
    description: "Auto-saved history with tags/search, templates, real-time guidance, improved run controls.",
    url: "https://oneshotai.com/",
    siteName: "OneShotAI",
    images: [
      {
        url: "https://oneshotai.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "OneShotAI – Big Update"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "OneShotAI – Big Update: History, Templates, Better Prompts",
    description: "Auto-saved history with tags/search, templates, real-time guidance, improved run controls.",
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
        <div role="status" aria-live="polite" className="w-full text-center text-[13px] sm:text-sm bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 text-white py-2 shadow">
          🚀 Big update just dropped: better prompts, history, templates, and more!
        </div>
        {children}
      </body>
    </html>
  );
}

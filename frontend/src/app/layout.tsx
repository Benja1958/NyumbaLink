import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AuthProvider } from "@/context/AuthContext";

import { Toaster } from "sonner";

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
  metadataBase: new URL("https://kayahub.co.ke"),
  title: {
    default: "KayaHub",
    template: "%s | KayaHub",
  },
  description:
    "Find and rent verified homes across Kenya.",
  applicationName: "KayaHub",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "KayaHub",
    title: "KayaHub — Find your next home with confidence",
    description:
      "Find and rent verified homes across Kenya.",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: "KayaHub — Find your next home with confidence",
    description:
      "Find and rent verified homes across Kenya.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster 
          position="top-right"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
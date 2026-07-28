import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NyumbaLink | Find Your Next Home",
  description:
    "A modern homes and rentals marketplace for comfortable, trusted living.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

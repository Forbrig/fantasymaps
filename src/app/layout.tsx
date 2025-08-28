import type { Metadata } from "next";
import { Geist, Geist_Mono, Bilbo_Swash_Caps } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bilboSwashCaps = Bilbo_Swash_Caps({
  variable: "--font-bilbo-swash-caps",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Fantasy Maps",
  description: "Explore interactive fantasy maps with detailed locations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bilboSwashCaps.variable}`}
      >
        {children}
      </body>
    </html>
  );
}

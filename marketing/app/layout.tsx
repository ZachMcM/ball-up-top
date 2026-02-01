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
  title: "Ball Up Top - Find Courts, Rate Players, Track Your Game",
  description:
    "Discover basketball courts near you, rate players, track your game time, and climb the leaderboards. The ultimate app for hoopers.",
  keywords: [
    "basketball",
    "courts",
    "player ratings",
    "pickup basketball",
    "hoops",
    "basketball app",
  ],
  openGraph: {
    title: "Ball Up Top - Find Courts, Rate Players, Track Your Game",
    description:
      "Discover basketball courts near you, rate players, track your game time, and climb the leaderboards.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ball Up Top",
    description:
      "Discover basketball courts near you, rate players, track your game time, and climb the leaderboards.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}

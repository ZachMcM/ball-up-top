import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ball Up Top — Your Campus's Pickup Basketball Community",
  description:
    "Check in at your school's rec center, get rated by real opponents, earn your player archetype, and see where you rank on the campus leaderboard.",
  keywords: [
    "college pickup basketball",
    "campus basketball app",
    "player ratings",
    "basketball leaderboard",
    "basketball archetype",
    "Purdue basketball",
    "pickup basketball community",
  ],
  openGraph: {
    title: "Ball Up Top — Who Runs Your Court?",
    description:
      "The social layer for college pickup basketball. Check in. Get rated. See where you rank on your campus leaderboard.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ball Up Top — Who Runs Your Court?",
    description:
      "Check in. Get rated. See who runs your campus court.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${barlowCondensed.variable} ${dmSans.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}

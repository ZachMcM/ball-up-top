import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-heading",
  weight: "400",
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
      <body className={`${bebasNeue.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

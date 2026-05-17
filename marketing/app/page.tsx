import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Ratings } from "@/components/sections/Ratings";
import { CampusExpansion } from "@/components/sections/CampusExpansion";
import { DownloadCTA } from "@/components/sections/DownloadCTA";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Ratings />
        <CampusExpansion />
        <DownloadCTA />
      </main>
      <Footer />
    </>
  );
}

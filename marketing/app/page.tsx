import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { AppPreview } from "@/components/sections/AppPreview";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { DownloadCTA } from "@/components/sections/DownloadCTA";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <AppPreview />
        <HowItWorks />
        <DownloadCTA />
      </main>
      <Footer />
    </>
  );
}

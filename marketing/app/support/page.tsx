"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";

const faqs = [
  {
    question: "How do I find basketball courts near me?",
    answer:
      "Open the Ball Up Top app and go to the Discover tab. Courts near your current location will automatically appear. You can search by name or address, and filter by indoor/outdoor, verified status, and more.",
  },
  {
    question: "How does the player rating system work?",
    answer:
      "After playing at a court, you can rate other players you played with. Ratings are given across four categories: Shooting, Finishing, Playmaking, and Defense. Your overall rating is calculated based on all ratings you receive. The more games you play, the more accurate your rating becomes.",
  },
  {
    question: "How do I check in at a court?",
    answer:
      "When you arrive at a court, open the app and navigate to that court's page. Tap the 'Check In' button to start tracking your game time. Your check-in will be visible to other players, and your session will appear in your activity feed when you're done.",
  },
  {
    question: "What determines my player archetype?",
    answer:
      "Your archetype (like 'Inside-Out Scorer' or 'Defensive Anchor') is automatically determined based on your ratings across all categories. As you receive more ratings and your strengths emerge, your archetype will update to reflect your playing style.",
  },
  {
    question: "How do court leaderboards work?",
    answer:
      "Each court has a leaderboard showing the top-rated players from the past 30 days. To appear on a court's leaderboard, you need to check in and receive ratings while playing there. Compete with others to climb the rankings at your local courts.",
  },
  {
    question: "Is the app free to use?",
    answer:
      "Yes, Ball Up Top is completely free to download and use. All core features including court discovery, player ratings, check-ins, and leaderboards are available at no cost.",
  },
  {
    question: "How do I add a new court to the app?",
    answer:
      "If you know of a court that isn't in the app yet, you can submit it for addition. Go to the Discover tab, tap the filter/settings icon, and select 'Submit a Court'. Fill out the court details and location, and our team will review and verify it.",
  },
  {
    question: "Can I delete my account?",
    answer:
      "Yes, you can delete your account at any time from the Profile tab. Go to Settings > Account > Delete Account. This will permanently remove your profile, ratings, and all associated data.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-5 text-left"
      >
        <span className="font-medium pr-8">{question}</span>
        <svg
          className={`w-5 h-5 shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-5">
          <p className="text-muted-foreground">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <Container size="md">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Support</h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions or get in touch with our team.
            </p>
          </div>

          {/* FAQ Section */}
          <Card className="mb-12">
            <h2 className="text-xl font-semibold mb-6">
              Frequently Asked Questions
            </h2>
            <div>
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onToggle={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                />
              ))}
            </div>
          </Card>

          {/* Contact Section */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Our support team is here to
              help.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email us at</p>
                <a
                  href="mailto:support@balluptop.com"
                  className="font-medium hover:underline"
                >
                  support@balluptop.com
                </a>
              </div>
            </div>
          </Card>
        </Container>
      </main>
      <Footer />
    </>
  );
}

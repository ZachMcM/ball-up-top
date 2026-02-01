"use client";

import Image from "next/image";
import { useState } from "react";
import { Container } from "../ui/Container";

const screenshots = [
  {
    id: "discover",
    title: "Discover Courts",
    description: "Find courts near you with photos and real-time activity",
    image: "/screenshots/discover-courts.png",
  },
  {
    id: "players",
    title: "Find Players",
    description: "Browse player profiles and see who's hooping",
    image: "/screenshots/discover-players.png",
  },
  {
    id: "court",
    title: "Court Details",
    description: "Check in, get directions, and see court activity",
    image: "/screenshots/court-detail.png",
  },
  {
    id: "profile",
    title: "Your Profile",
    description: "Track your ratings across all skill categories",
    image: "/screenshots/profile.png",
  },
  {
    id: "activity",
    title: "Activity Feed",
    description: "See your game history and achievements",
    image: "/screenshots/activity.png",
  },
  {
    id: "leaderboard",
    title: "Leaderboards",
    description: "Compete with players at your local courts",
    image: "/screenshots/leaderboard.png",
  },
];

export function AppPreview() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-20 md:py-32 bg-card/50">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            See It in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A clean, intuitive interface designed for hoopers who want to focus on the game.
          </p>
        </div>

        {/* Screenshot tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {screenshots.map((screen, index) => (
            <button
              key={screen.id}
              onClick={() => setActiveIndex(index)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeIndex === index
                  ? "bg-white text-black"
                  : "bg-card border border-border text-muted-foreground hover:text-white hover:border-white/20"
              }`}
            >
              {screen.title}
            </button>
          ))}
        </div>

        {/* Phone mockup with active screenshot */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 flex justify-center">
            <div className="relative w-[280px] sm:w-[300px] h-[580px] sm:h-[620px] bg-card rounded-[3rem] p-2 border border-border shadow-2xl">
              {/* Screen */}
              <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-black">
                {screenshots.map((screen, index) => (
                  <Image
                    key={screen.id}
                    src={screen.image}
                    alt={screen.title}
                    fill
                    className={`object-cover object-top transition-opacity duration-300 ${
                      activeIndex === index ? "opacity-100" : "opacity-0"
                    }`}
                    priority={index === 0}
                  />
                ))}
              </div>
              {/* Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full" />
            </div>
          </div>

          {/* Description */}
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-2xl font-bold mb-4">
              {screenshots[activeIndex].title}
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              {screenshots[activeIndex].description}
            </p>

            {/* Navigation dots */}
            <div className="flex gap-2 justify-center lg:justify-start">
              {screenshots.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeIndex === index
                      ? "bg-white w-6"
                      : "bg-muted-foreground/50 hover:bg-muted-foreground"
                  }`}
                  aria-label={`View screenshot ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

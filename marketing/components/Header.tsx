"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Container } from "./ui/Container";
import { Button } from "./ui/Button";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Ball Up Top"
              width={24}
              height={24}
            />
            <span className="font-semibold text-lg">Ball Up Top</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/#features"
              className="text-sm text-muted-foreground hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm text-muted-foreground hover:text-white transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/support"
              className="text-sm text-muted-foreground hover:text-white transition-colors"
            >
              Support
            </Link>
          </div>

          <div className="hidden md:block">
            <Button href="#download" size="sm">
              Download App
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                href="/#features"
                className="text-sm text-muted-foreground hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/#how-it-works"
                className="text-sm text-muted-foreground hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/support"
                className="text-sm text-muted-foreground hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Support
              </Link>
              <Button href="#download" size="sm" className="w-fit">
                Download App
              </Button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}

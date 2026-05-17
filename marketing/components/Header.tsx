"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Container } from "./ui/Container";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border/60">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Ball Up Top"
              width={26}
              height={26}
              className="opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <span className="font-heading text-xl uppercase tracking-wide">Ball Up Top</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              The Platform
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#campuses"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Campuses
            </Link>
            <Link
              href="/support"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Support
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-medium">
                Live at Purdue
              </span>
            </div>
            <a
              href="#download"
              className="inline-flex items-center justify-center h-9 px-5 text-sm font-semibold bg-accent text-white rounded-full hover:bg-accent/90 transition-colors active:scale-[0.98]"
            >
              Get the App
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 -mr-2 text-muted-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5"
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
          <div className="md:hidden py-4 border-t border-border space-y-4">
            <Link
              href="/#features"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              The Platform
            </Link>
            <Link
              href="/#how-it-works"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/#campuses"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Campuses
            </Link>
            <Link
              href="/support"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Support
            </Link>
            <a
              href="#download"
              className="inline-flex items-center justify-center h-9 px-5 text-sm font-semibold bg-accent text-white rounded-full hover:bg-accent/90 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get the App
            </a>
          </div>
        )}
      </Container>
    </header>
  );
}

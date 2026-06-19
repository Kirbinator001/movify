"use client";
import { Search, MessageCircle } from "lucide-react";
import Link from "next/link";
import Movies from "./movies";

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <MessageCircle className="w-7 h-7 text-primary fill-primary/10" strokeWidth={2.5} />
            <span className="text-2xl font-bold text-primary tracking-tight">movify</span>
          </Link>
        </div>
      </header>

      <section className="relative py-20 px-6" style={{ background: "var(--gradient-hero)" }}>
        <div
          className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 0, transparent 35%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.3) 0, transparent 40%), radial-gradient(circle at 50% 50%, rgba(255,200,200,0.2) 0, transparent 60%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <h1 id="movie-text" className="text-5xl md:text-6xl font-semibold text-white tracking-tight">Movies</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="relative max-w-2xl mt-10"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search movies by keyword..."
              className="w-full pl-14 pr-32 py-4 rounded-md bg-white text-foreground shadow-2xl outline-none focus:ring-4 focus:ring-white/30"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold tracking-wide hover:opacity-90 transition"
            >
              SEARCH
            </button>
          </form>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <Movies />
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Copyright 2026 &copy; Movify. All rights reserved.
      </footer>
    </div>
  );
}

import type { Metadata } from "next";
import { HomeClient } from "./_components/home-client";

export const metadata: Metadata = {
  title: "Movify — Discover Movies",
  description: "Search and discover movies powered by TMDB.",
  openGraph: {
    title: "Movify — Discover Movies",
    description: "Search and discover movies powered by TMDB.",
  },
};

export default function Home() {
  return <HomeClient />;
}

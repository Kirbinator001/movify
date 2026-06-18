import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Star, Play } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Movify — Discover Movies" },
      { name: "description", content: "Search and discover movies powered by TMDB." },
      { property: "og:title", content: "Movify — Discover Movies" },
      { property: "og:description", content: "Search and discover movies powered by TMDB." },
    ],
  }),
  component: Index,
});

const TMDB_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMWY2OGE2YzFlMzM0MTIyZjEzMWM4ZTliZjc2MzViMSIsIm5iZiI6MTc4MTc2NDAzMi44MzM5OTk5LCJzdWIiOiI2YTMzOGZjMDdlNGQxNGIwMGFlNmU1YzYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ftNSX6YPUG0eLJLaRZFgmwIhrTyMMTPgsrP8sIsrVUg";

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
};

async function fetchMovies(query: string): Promise<Movie[]> {
  const url = query.trim()
    ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`
    : `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TMDB_TOKEN}`, accept: "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch movies");
  const data = await res.json();
  return data.results ?? [];
}

function Index() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");

  const { data: movies = [], isLoading, isError } = useQuery({
    queryKey: ["movies", query],
    queryFn: () => fetchMovies(query),
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-primary">●</span> movify
          </h1>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a className="hover:text-foreground transition" href="#">Home</a>
            <a className="hover:text-foreground transition" href="#">Movies</a>
            <a className="hover:text-foreground transition" href="#">TV Shows</a>
            <a className="hover:text-foreground transition" href="#">Blog</a>
          </nav>
        </div>
      </header>

      {/* Hero with search */}
      <section
        className="relative py-24 px-6 text-center"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Discover your next favorite movie
          </h2>
          <p className="text-white/80 text-lg mb-10">
            Search thousands of films powered by TMDB.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setQuery(input);
            }}
            className="relative max-w-2xl mx-auto"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search movies by keyword..."
              className="w-full pl-14 pr-32 py-5 rounded-full bg-card text-foreground shadow-2xl outline-none focus:ring-4 focus:ring-primary/30"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h3 className="text-2xl font-semibold">
            {query ? `Results for "${query}"` : "Popular now"}
          </h3>
          <span className="text-sm text-muted-foreground">
            {movies.length} {movies.length === 1 ? "movie" : "movies"}
          </span>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-destructive text-center py-12">Something went wrong loading movies.</p>
        )}

        {!isLoading && movies.length === 0 && (
          <p className="text-muted-foreground text-center py-12">No movies found.</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {movies.map((m) => (
            <article
              key={m.id}
              className="group rounded-2xl overflow-hidden bg-card border border-border hover:-translate-y-1 transition-transform"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                {m.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                    alt={m.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    No image
                  </div>
                )}
                <button className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition">
                  <Play className="w-5 h-5 fill-current" />
                </button>
              </div>
              <div className="p-5">
                <h4 className="font-semibold text-lg mb-2 line-clamp-1">{m.title}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span>{m.vote_average.toFixed(1)}/10</span>
                  {m.release_date && (
                    <>
                      <span>·</span>
                      <span>{m.release_date.slice(0, 4)}</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {m.overview || "No description available."}
                </p>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Data provided by TMDB.
      </footer>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Star, Play, ShoppingBag, MessageCircle, User } from "lucide-react";

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <MessageCircle className="w-7 h-7 text-primary fill-primary/10" strokeWidth={2.5} />
            <span className="text-2xl font-bold text-primary tracking-tight">movify</span>
          </a>
          <nav className="hidden md:flex items-center gap-9 text-[15px] text-foreground/80">
            <a className="hover:text-primary transition" href="#">Home</a>
            <a className="hover:text-primary transition" href="#">Pages</a>
            <a className="hover:text-primary transition" href="#">Movies & TV Shows</a>
            <a className="hover:text-primary transition" href="#">Blog</a>
            <a className="hover:text-primary transition" href="#">Contact Us</a>
          </nav>
          <div className="flex items-center gap-5">
            <button aria-label="Search" className="text-foreground/70 hover:text-primary"><Search className="w-5 h-5" /></button>
            <button aria-label="Cart" className="relative text-foreground/70 hover:text-primary">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">2</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-md border-2 border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition">
              <User className="w-4 h-4" /> LOGIN
            </button>
          </div>
        </div>
      </header>

      {/* Hero with search */}
      <section
        className="relative py-20 px-6"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div
          className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 0, transparent 35%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.3) 0, transparent 40%), radial-gradient(circle at 50% 50%, rgba(255,200,200,0.2) 0, transparent 60%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-semibold text-white tracking-tight">
            Movie Grid
          </h1>
          <div className="mt-4 text-white/80 text-sm">
            <a href="/" className="hover:text-white">Home</a>
            <span className="mx-3 opacity-50">|</span>
            <span>Discover</span>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setQuery(input);
            }}
            className="relative max-w-2xl mt-10"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
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

      {/* Results */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded grid place-items-center text-muted-foreground hover:text-primary border border-border" aria-label="List view">
              <span className="flex flex-col gap-1"><span className="block w-4 h-0.5 bg-current" /><span className="block w-4 h-0.5 bg-current" /><span className="block w-4 h-0.5 bg-current" /></span>
            </button>
            <button className="w-10 h-10 rounded grid place-items-center bg-primary text-primary-foreground" aria-label="Grid view">
              <span className="grid grid-cols-2 gap-0.5"><span className="w-1.5 h-1.5 bg-current" /><span className="w-1.5 h-1.5 bg-current" /><span className="w-1.5 h-1.5 bg-current" /><span className="w-1.5 h-1.5 bg-current" /></span>
            </button>
          </div>
          <div className="px-5 py-2.5 rounded border border-border text-sm text-muted-foreground bg-card min-w-[180px]">
            {query ? `Results: "${query}"` : "Default Order"}
          </div>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {movies.map((m) => (
            <article
              key={m.id}
              className="group bg-card border border-border rounded-sm overflow-hidden hover:-translate-y-1 transition-transform"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
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
                <button className="absolute -bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl hover:scale-110 transition z-10">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>
              </div>
              <div className="p-6 pt-7">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h4 className="font-semibold text-xl text-foreground line-clamp-1">{m.title}</h4>
                </div>
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span>{m.vote_average.toFixed(1)}/10</span>
                  </div>
                  <span className="text-muted-foreground">
                    {m.release_date ? m.release_date.slice(0, 4) : "—"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-5 leading-relaxed">
                  {m.overview || "No description available."}
                </p>
                <button className="px-5 py-2 rounded-sm bg-primary text-primary-foreground text-xs font-bold tracking-widest hover:opacity-90 transition">
                  DETAILS
                </button>
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

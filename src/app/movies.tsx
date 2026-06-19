"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Check, ExternalLink, Star, X } from "lucide-react";
import { useEffect, useState } from "react";

function useWatchedMovies() {
  const [watched, setWatched] = useState<Set<number>>(() => {
    try {
      const stored = localStorage.getItem("watchedMovies");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleWatched = (id: number) => {
    setWatched((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("watchedMovies", JSON.stringify([...next]));
      return next;
    });
  };

  return { isWatched: (id: number) => watched.has(id), toggleWatched };
}

interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
}

interface Genre {
  id: number;
  name: string;
}

interface MovieDetails extends Movie {
  tagline: string;
  runtime: number | null;
  genres: Genre[];
  budget: number;
  revenue: number;
  imdb_id: string | null;
  original_language: string;
  vote_count: number;
}

const TMDB_READ_ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN;

async function getMovies(page: number): Promise<MovieResponse> {
  const url = `https://api.themoviedb.org/3/discover/movie?page=${page}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`, accept: "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch movies");

  const data = await res.json();

  return data ?? {
    page: 1,
    results: [],
    total_pages: 1,
    total_results: 0,
  };
}

async function getMovieDetails(id: number): Promise<MovieDetails> {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    headers: { Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`, accept: "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch movie details");

  return res.json();
}

function formatRuntime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatMoney(amount: number) {
  if (amount === 0) return null;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(amount);
}

function MovieModal({ id, onClose }: { id: number; onClose: () => void }) {
  const { data, isPending, isError } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(id),
  });

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const budget = data ? formatMoney(data.budget) : null;
  const revenue = data ? formatMoney(data.revenue) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-card border border-border rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: "var(--shadow-card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 text-white/80 flex items-center justify-center hover:bg-black/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isPending && (
          <div className="flex flex-col gap-4 p-8">
            <div className="h-6 w-2/3 rounded bg-muted animate-pulse" />
            <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
            <div className="aspect-video w-full rounded bg-muted animate-pulse mt-2" />
            <div className="space-y-2 mt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-3 rounded bg-muted animate-pulse" style={{ width: `${90 - i * 10}%` }} />
              ))}
            </div>
          </div>
        )}

        {isError && (
          <p className="text-destructive text-center p-12">Failed to load movie details.</p>
        )}

        {data && (
          <>
            {data.backdrop_path && (
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={`https://image.tmdb.org/t/p/w1280${data.backdrop_path}`}
                  alt={data.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-7">
              <h2 className="font-bold text-2xl text-foreground mb-1">{data.title}</h2>

              {data.tagline && (
                <p className="text-sm text-muted-foreground italic mb-4">"{data.tagline}"</p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-5">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span>{data.vote_average.toFixed(1)}/10</span>
                  <span className="text-muted-foreground/60">({data.vote_count.toLocaleString()} votes)</span>
                </div>
                {data.release_date && <span>{data.release_date.slice(0, 4)}</span>}
                {data.runtime ? <span>{formatRuntime(data.runtime)}</span> : null}
                {data.original_language && (
                  <span className="uppercase">{data.original_language}</span>
                )}
              </div>

              {data.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {data.genres.map((g) => (
                    <span
                      key={g.id}
                      className="px-2.5 py-0.5 rounded-sm border border-border text-xs text-muted-foreground"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {data.overview && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{data.overview}</p>
              )}

              {(budget || revenue) && (
                <div className="flex gap-6 text-sm mb-6">
                  {budget && (
                    <div>
                      <span className="text-muted-foreground/60 block text-xs uppercase tracking-wide mb-0.5">Budget</span>
                      <span className="text-foreground font-medium">{budget}</span>
                    </div>
                  )}
                  {revenue && (
                    <div>
                      <span className="text-muted-foreground/60 block text-xs uppercase tracking-wide mb-0.5">Revenue</span>
                      <span className="text-foreground font-medium">{revenue}</span>
                    </div>
                  )}
                </div>
              )}

              {data.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${data.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-primary text-primary-foreground text-xs font-bold tracking-widest hover:opacity-90 transition"
                >
                  READ MORE ON IMDB
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Movies() {
  const [page, setPage] = useState(1);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const { isWatched, toggleWatched } = useWatchedMovies();
  const {
    isPending,
    isError,
    data: response,
  } = useQuery({
    queryKey: ["movies", page],
    queryFn: () => getMovies(page),
    placeholderData: keepPreviousData,
  });

  if (isPending)
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );

  if (isError)
    return (
      <p className="text-destructive text-center py-12">Something went wrong loading movies.</p>
    );

  return (
    <>
      {selectedMovieId !== null && (
        <MovieModal id={selectedMovieId} onClose={() => setSelectedMovieId(null)} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {response.results.map((m) => (
          <article
            key={m.id}
            onClick={() => setSelectedMovieId(m.id)}
            className="group bg-card border border-border rounded-sm overflow-hidden hover:-translate-y-1 transition-transform cursor-pointer"
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
              <div
                className="absolute top-2 right-2 z-10 group/tooltip"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => toggleWatched(m.id)}
                  aria-label={isWatched(m.id) ? "Mark as unwatched" : "Mark as watched"}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isWatched(m.id)
                      ? "bg-green-500 text-white"
                      : "bg-black/40 text-white/70 hover:bg-black/60"
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>
                <span className="pointer-events-none absolute top-1/2 right-10 -translate-y-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover/tooltip:opacity-100">
                  Watched
                </span>
              </div>
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
            </div>
          </article>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 mt-12">
        <button
          onClick={() => {
            setPage((old) => Math.max(old - 1, 1));
            document.getElementById("movie-text")?.scrollIntoView({ behavior: "smooth" });
          }}
          disabled={page === 1}
          className="px-6 py-2.5 rounded-sm border border-primary text-primary text-xs font-bold tracking-widest hover:bg-primary hover:text-primary-foreground transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          PREV
        </button>
        <span className="text-sm text-muted-foreground tabular-nums">
          Page {page} of {response.total_pages}
        </span>
        <button
          onClick={() => {
            if (page < response.total_pages) {
              setPage((old) => old + 1);
              document.getElementById("movie-text")?.scrollIntoView({ behavior: "smooth" });
            }
          }}
          disabled={page >= (response.total_pages || 0)}
          className="px-6 py-2.5 rounded-sm bg-primary text-primary-foreground text-xs font-bold tracking-widest hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          NEXT
        </button>
      </div>
    </>
  );
}

import "./globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./QueryClient";
import type { Metadata } from "next";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const metadata: Metadata = {
  title: "Movify — Discover Movies",
  description: "Search and discover movies powered by TMDB.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} position="right" />
        </QueryClientProvider>
      </body>
    </html>
  );
}

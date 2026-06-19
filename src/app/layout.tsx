import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Movify — Discover Movies",
  description: "Search and discover movies powered by TMDB.",
  openGraph: { title: "Movify — Discover Movies", type: "website" },
  twitter: { card: "summary", site: "@Lovable" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

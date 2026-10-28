"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Form from "next/form";
import { askUrl } from "./lib/ai-examples";

interface Anime {
  id: number;
  title: string;
  image: string;
  synopsis: string;
  url: string;
}

const GENRES = [
  { name: "Action", emoji: "💥" },
  { name: "Romance", emoji: "💖" },
  { name: "Comedy", emoji: "😂" },
  { name: "Psychological", emoji: "🧠" },
  { name: "Fantasy", emoji: "🧙" },
  { name: "Slice of Life", emoji: "🍵" },
];

export default function Home() {
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [errorTrending, setErrorTrending] = useState("");

  useEffect(() => {
    const fetchTrendingAnime = async () => {
      try {
        const response = await fetch("/api/trending");
        if (!response.ok) throw new Error("Failed to fetch trending anime");
        const data: Anime[] = await response.json();
        setTrendingAnime(data);
      } catch {
        setErrorTrending("Could not load anime.");
      } finally {
        setLoadingTrending(false);
      }
    };

    fetchTrendingAnime();
  }, []);

  return (
    <div className="container mx-auto px-4 bg-gray-900 text-white">
      <section className="flex flex-col items-center justify-center text-center min-h-[20vh] pt-6 pb-2">
        <h1 className="text-4xl md:text-5xl font-bold">Anime Explorer</h1>

        <label htmlFor="home-ai-question" className="mt-4 text-lg text-gray-300">
          Not sure what to watch? Describe it and AI will pick for you.
        </label>
        <Form action="/ask" className="mt-3 w-full max-w-xl flex flex-col sm:flex-row gap-2">
          <input
            id="home-ai-question"
            name="q"
            type="text"
            required
            maxLength={200}
            enterKeyHint="send"
            placeholder="🤖 e.g. Please suggest some sad anime"
            className="flex-1 min-w-0 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-base text-white placeholder-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-base font-semibold py-3 px-6 rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Ask AI
          </button>
        </Form>

        <p className="mt-4 text-sm text-gray-400">Or pick a genre:</p>
        <ul aria-label="Genres" className="mt-2 flex flex-wrap justify-center gap-2">
          {GENRES.map((genre) => (
            <li key={genre.name}>
              <Link
                href={askUrl(`Suggest some ${genre.name.toLowerCase()} anime`)}
                className="inline-flex items-center gap-2 min-h-11 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full px-4 py-2 text-sm text-gray-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <span aria-hidden="true">{genre.emoji}</span>
                {genre.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="pt-8 pb-12">
        <div className="flex items-baseline justify-between gap-4 mb-6 border-b border-gray-700 pb-2">
          <h2 className="text-2xl font-semibold">⭐ Highly Rated</h2>
          <Link
            href="/popular"
            className="text-sm text-blue-400 hover:underline rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            See all →
          </Link>
        </div>
        {loadingTrending && (
          <p className="text-center text-gray-400">Loading anime...</p>
        )}
        {errorTrending && (
          <p className="text-center text-red-500">{errorTrending}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingAnime.map((anime, index) => (
            <div
              key={anime.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
            >
              <Image
                src={anime.image}
                alt={anime.title}
                width={400}
                height={560}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                quality={90}
                loading={index < 4 ? "eager" : "lazy"}
                className="w-full aspect-[3/4] object-cover"
              />
              <div className="p-4">
                <h3 className="text-sm font-semibold truncate">{anime.title}</h3>
                <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                  {anime.synopsis}
                </p>
                <Link
                  href={anime.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`More info about ${anime.title} (opens in a new tab)`}
                  className="block mt-3 w-full py-3 text-sm text-center bg-blue-600 hover:bg-blue-700 rounded-md text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  More Info
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
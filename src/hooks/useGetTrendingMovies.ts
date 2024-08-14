import React from "react";

// store
import { useStore } from "@/src/store/store";

// types
import { Movie } from "@/src/types/api.types";

export default function useGetTrendingMovies({ title }: { title: string }) {
  const nowPlayingMovies = useStore((store) => store.nowPlaying);
  const popularMovies = useStore((store) => store.popularMovies);
  const topRatedMovies = useStore((store) => store.topRatedMovies);
  const upcomingMovies = useStore((store) => store.upcomingMovies);

  const [movies, setMovies] = React.useState<Movie[]>([]);

  React.useEffect(() => {
    switch (title) {
      case "Now Playing":
        setMovies(nowPlayingMovies);
        break;

      case "Popular":
        setMovies(popularMovies);
        break;

      case "Top Rated":
        setMovies(topRatedMovies);
        break;

      case "Upcoming":
        setMovies(upcomingMovies);
        break;

      default:
        setMovies([]);
        break;
    }
  }, [nowPlayingMovies, popularMovies, topRatedMovies, upcomingMovies]);

  return { movies };
}

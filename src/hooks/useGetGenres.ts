import React from "react";

// store
import { useStore } from "@/src/store/store";

// types
import { Movie } from "@/src/types/api.types";

export default function useGetGenres({ movie }: { movie: Movie | undefined }) {
  const categories = useStore((store) => store.categories);

  const genres = React.useMemo(() => {
    if (!movie) return [];

    const preparegGenres: string[] = [];

    movie.genre_ids.map((id) => {
      categories.map((category) => {
        if (category.id !== id) return;

        preparegGenres.push(category.name);
      });
    });

    return preparegGenres;
  }, [movie]);

  return { genres: genres };
}

// store
import { useStore } from "@/src/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

// types
import { Movie } from "@/src/types/api.types";

// config
import { constants } from "@/src/config/constants";

export default function useHandleFavorites() {
  const favorites = useStore((store) => store.favorites);
  const setFavorites = useStore((store) => store.setFavorites);

  const handleFavorites = async (movie: Movie) => {
    if (!movie) return;

    if (favorites.some((fav) => fav.id === movie.id)) {
      try {
        const favs = favorites.filter((fav) => fav.id !== movie.id);
        await AsyncStorage.setItem(constants.favorites, JSON.stringify(favs));

        return setFavorites(favs);
      } catch (e) {
        return;
      }
    }

    try {
      const favs = [...favorites, movie];

      await AsyncStorage.setItem(constants.favorites, JSON.stringify(favs));

      setFavorites(favs);
    } catch (e) {
      return;
    }
  };

  return { handleFavorites };
}

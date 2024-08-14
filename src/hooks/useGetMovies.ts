import AsyncStorage from "@react-native-async-storage/async-storage";

// utils
import api from "@/src/utils/fetchers";

// store
import { useStore } from "@/src/store/store";

// config
import { constants } from "@/src/config/constants";

export default function useGetMovies() {
  const setNowPlaying = useStore((store) => store.setNowPlaying);
  const setPopular = useStore((store) => store.setPopular);
  const setTopRated = useStore((store) => store.setTopRated);
  const setupcoming = useStore((store) => store.setupcoming);

  const getNowPlaying = async () => {
    const lang = await AsyncStorage.getItem(constants.language);

    const movies = await api.getNowPlaying({ language: lang || "en-US" });
    setNowPlaying(movies.results);
  };

  const getUpcomingMovies = async () => {
    const lang = await AsyncStorage.getItem(constants.language);

    const movies = await api.getUpcomingMovies({ language: lang || "en-US" });
    setupcoming(movies.results);
  };

  const getTopRatedMovies = async () => {
    const lang = await AsyncStorage.getItem(constants.language);

    const movies = await api.getTopRatedMovies({ language: lang || "en-US" });
    setTopRated(movies.results);
  };

  const getPopularMovies = async () => {
    const lang = await AsyncStorage.getItem(constants.language);

    const movies = await api.getPopularMovies({ language: lang || "en-US" });
    setPopular(movies.results);
  };

  const getMovies = async () =>
    await Promise.all([
      getNowPlaying(),
      getTopRatedMovies(),
      getPopularMovies(),
      getUpcomingMovies(),
    ]);

  return { getMovies };
}

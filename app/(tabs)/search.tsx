import React from "react";
import { View, TextInput, ActivityIndicator, FlatList } from "react-native";

// components
import { Icon } from "@/src/components/shared/Icon";
import MovieCard from "@/src/components/MovieCard";

// types
import { SearchResponse } from "@/src/types/api.types";

// utils
import { cn } from "@/src/utils/cn";
import api from "@/src/utils/fetchers";

// hooks
import useDebounce from "@/src/hooks/useDebounce";

// store
import { useStore } from "@/src/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

// configs
import { constants } from "@/src/config/constants";

export default function SearchScreen() {
  const popularMovies = useStore((store) => store.popularMovies);

  const [search, setSearch] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [movies, setMovies] = React.useState<SearchResponse>({
    page: 0,
    total_pages: 0,
    total_results: 0,
    results: [],
  });

  React.useEffect(() => {
    if (search) return;

    console.log("girdi");

    setMovies({ ...movies, results: popularMovies });
  }, [search]);

  React.useEffect(() => {
    console.log(movies.results.length);
  }, [movies]);

  const { debouncedValue } = useDebounce(search, 500);

  const handleSearch = async (query: string) => {
    setMovies({ page: 0, total_pages: 0, total_results: 0, results: [] });
    setLoading(true);

    const lang = await AsyncStorage.getItem(constants.language);

    const response = await api.getSearchedMovies({
      language: lang || "en-US",
      query: query,
    });

    const filterMovies = response.results.filter((mov) => mov.poster_path);

    setMovies({
      page: response.page,
      total_pages: response.total_pages,
      total_results: response.total_results,
      results: filterMovies,
    });

    setLoading(false);
  };

  const handleContinuation = async (query: string) => {
    if (movies.page + 1 > movies?.total_pages) return;
    setLoading(true);

    const lang = await AsyncStorage.getItem(constants.language);

    const response = await api.getSearchedMovies({
      language: lang || "en-US",
      query: query,
      page: movies.page + 1,
    });

    const filterMovies = response.results.filter((mov) => mov.poster_path);

    setMovies({
      ...movies,
      page: response.page,
      total_pages: response.total_pages,
      total_results: response.total_results,
      results: [...movies.results, ...filterMovies],
    });

    setLoading(false);
  };

  React.useEffect(() => {
    if (!debouncedValue) return;

    handleSearch(debouncedValue);
  }, [debouncedValue]);

  return (
    <View className="flex-1 bg-background p-5 pt-24">
      {/* Search Box */}
      <View
        className={cn(
          "flex-row items-center border-solid border-[1px] rounded-md p-2 mb-3 border-white/50 transition-colors",
          { "border-white": focused }
        )}
      >
        <TextInput
          placeholder="Search for a movie..."
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={"#FFFFFF50"}
          value={search}
          onChangeText={(e) => setSearch(e)}
          className="flex-1 text-white"
        />

        <Icon
          name="search"
          color={focused ? "white" : "#FFFFFF50"}
          className="transition-colors"
        />
      </View>

      {loading && movies.results.length === 0 ? (
        <ActivityIndicator className="mt-2" size={30} color="white" />
      ) : null}

      {movies.results.length > 0 ? (
        <FlatList
          data={movies.results}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          onEndReached={() => handleContinuation(search)}
          ListFooterComponent={
            <View className="h-20">
              {loading ? (
                <ActivityIndicator className="mt-2" size={30} color="white" />
              ) : null}
            </View>
          }
          renderItem={({ item }) => (
            <MovieCard
              favoriteButton={false}
              movie={item}
              classname="w-1/2 p-2 bg-transparent"
            />
          )}
        />
      ) : null}
    </View>
  );
}

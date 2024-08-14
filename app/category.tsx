import React from "react";
import {
  Stack,
  useLocalSearchParams,
  router,
  useFocusEffect,
} from "expo-router";
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// components
import { Icon } from "@/src/components/shared/Icon";
import { BlurView } from "expo-blur";
import MovieCard from "@/src/components/MovieCard";
import MovieDetailSkeleton from "@/src/components/MovieDetailSkeleton";

// utils
import { getImage } from "@/src/utils/getImage";
import api from "@/src/utils/fetchers";

// types
import {
  CastDetail as CastDetailType,
  CastMovies,
  Movie,
  MovieResponse,
} from "@/src/types/api.types";

// config
import { constants } from "@/src/config/constants";
import CategorySkeleton from "@/src/components/CategorySkeleton";

export default function Category() {
  const { title } = useLocalSearchParams();

  const [loading, setLoading] = React.useState(false);
  const [movies, setMovies] = React.useState<MovieResponse>({
    dates: {
      maximum: "",
      minimum: "",
    },
    page: 0,
    total_pages: 0,
    total_results: 0,
    results: [],
  });

  const getMovies = async () => {
    if (movies.page && movies.page + 1 > movies?.total_pages) return;
    setLoading(true);

    const lang = await AsyncStorage.getItem(constants.language);

    let response: MovieResponse | null = null;

    if (title === "Now Playing") {
      response = await api.getNowPlaying({
        language: lang || "en-US",
        page: movies.page + 1,
      });
    } else if (title === "Popular") {
      response = await api.getPopularMovies({
        language: lang || "en-US",
        page: movies.page + 1,
      });
    } else if (title === "Top Rated") {
      response = await api.getTopRatedMovies({
        language: lang || "en-US",
        page: movies.page + 1,
      });
    } else if (title === "Upcoming") {
      response = await api.getUpcomingMovies({
        language: lang || "en-US",
        page: movies.page + 1,
      });
    }

    if (!response?.results || response.results.length === 0)
      return setLoading(false);

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

  // React.useEffect(() => {
  //   console.log(movies);
  // }, [movies]);

  React.useEffect(() => {
    getMovies();
  }, []);

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerLeft: () => (
            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={50}
              className="p-3 rounded-full overflow-hidden bg-black/20"
            >
              <Icon name="chevron-back" onPress={() => router.back()} />
            </BlurView>
          ),
          headerTitle: title as string,
          headerTitleStyle: { color: "white" },
          headerTitleAlign: "center",
          headerTransparent: true,
        }}
      />

      {loading ? (
        <CategorySkeleton />
      ) : movies.results.length === 0 ? (
        <View className="w-full mt-24">
          <Text className="text-white/50 text-center text-base font-semibold">
            Sorry, an unknown error occured.
          </Text>
        </View>
      ) : (
        <FlatList
          data={movies.results}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          onEndReached={() => getMovies()}
          className="pt-20"
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
      )}
    </View>
  );
}

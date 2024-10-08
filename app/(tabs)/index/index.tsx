import React from "react";
import { View, Image, Text, ScrollView, FlatList } from "react-native";

// components
import MovieCard from "@/src/components/MovieCard";
import Button from "@/src/components/shared/Button";
import Loader from "@/src/components/Loader";
import Swiper from "react-native-swiper";
import { Link } from "expo-router";
import { Icon } from "@/src/components/shared/Icon";
import { LinearGradient } from "expo-linear-gradient";

// hooks
import useGetMovies from "@/src/hooks/useGetMovies";
import useGetTrendingMovies from "@/src/hooks/useGetTrendingMovies";
import useHandleFavorites from "@/src/hooks/useHandleFavorites";

// store
import { useStore } from "@/src/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

// utils
import { getImage } from "@/src/utils/getImage";

// config
import { constants } from "@/src/config/constants";

export default function HomeScreen() {
  const { getMovies } = useGetMovies();

  const [loading, setLoading] = React.useState(false);

  const setFavorites = useStore((store) => store.setFavorites);

  const getFavorites = async () => {
    const favorites = await AsyncStorage.getItem(constants.favorites);

    if (!favorites) return;

    setFavorites(JSON.parse(favorites));
  };

  const init = async () => {
    setLoading(true);

    await getMovies();
    await getFavorites();

    setLoading(false);
  };

  React.useEffect(() => {
    init();
  }, []);

  if (loading) return <Loader />;
  return (
    <View className="flex-1 bg-background">
      <ScrollView>
        <BannerMovie />
        <TrendingScroller title="Now Playing" />
        <TrendingScroller title="Popular" />
        <TrendingScroller title="Top Rated" />
        <TrendingScroller title="Upcoming" />
      </ScrollView>
    </View>
  );
}

function BannerMovie() {
  const nowPlayingMovies = useStore((store) => store.nowPlaying);

  return (
    <View className="w-full aspect-[2/3]">
      <Swiper
        showsButtons={false}
        showsPagination={false}
        loop={true}
        autoplay={true}
        autoplayTimeout={4}
      >
        {nowPlayingMovies.map((movie) => {
          return (
            <View
              key={movie.id}
              className="flex-1 relative mb-14 w-full bg-red-500"
            >
              <Image
                src={getImage(movie.poster_path)}
                className="w-full h-full z-0"
              />

              <LinearGradient
                colors={["rgba(0,0,0,0)", "rgba(0,0,0,1)"]}
                className="absolute bottom-0 left-0 w-full flex-row items-end justify-between gap-3 py-3 z-10 m-0"
              >
                <View className="flex-col w-1/2">
                  <View className="flex-row">
                    <Icon name="star" color="yellow" size={26} />
                    <Text className="font-semibold text-white ml-1 text-lg">
                      {movie.vote_average.toFixed(1)}
                    </Text>
                  </View>

                  <Text className="font-bold text-2xl text-white">
                    {movie.original_title}
                  </Text>
                </View>

                <Button classname="mr-4 flex-row items-center">
                  <Link
                    href={{
                      pathname: `/(tabs)/movieDetail`,
                      params: { movie: JSON.stringify(movie) },
                    }}
                    className="font-semibold text-white mt-1"
                  >
                    View Details
                  </Link>

                  <Icon
                    name="chevron-forward-outline"
                    color="white"
                    size={20}
                  />
                </Button>
              </LinearGradient>
            </View>
          );
        })}
      </Swiper>
    </View>
  );
}

interface ITrendingScrollerProps {
  title: string;
}

function TrendingScroller(props: ITrendingScrollerProps) {
  const { movies } = useGetTrendingMovies({ title: props.title });

  return (
    <View className="mb-14 px-5">
      <View className="flex-row justify-between">
        <Text className="text-white font-bold mb-4">{props.title}</Text>
        <Link
          href={{
            pathname: `/(tabs)/category`,
            params: { title: props.title },
          }}
          className="text-primary"
        >
          See All
        </Link>
      </View>

      <FlatList
        data={movies}
        horizontal
        ItemSeparatorComponent={() => <View className="w-4" />}
        renderItem={({ item: movie }) => (
          <MovieCard movie={movie} favoriteButton={false} />
        )}
      />
    </View>
  );
}

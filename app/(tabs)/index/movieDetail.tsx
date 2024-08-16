import React from "react";
import { Stack, useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// components
import Button from "@/src/components/shared/Button";
import { Icon } from "@/src/components/shared/Icon";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import MovieCard from "@/src/components/MovieCard";
import Loader from "@/src/components/Loader";
import ImageView from "react-native-image-viewing";

// utils
import api from "@/src/utils/fetchers";
import { getImage } from "@/src/utils/getImage";

// types
import {
  CastResponse,
  Movie,
  MovieDetail as MovieDetailType,
  MovieImages,
} from "@/src/types/api.types";

// config
import { constants } from "@/src/config/constants";

// hooks
import useHandleFavorites from "@/src/hooks/useHandleFavorites";

// store
import { useStore } from "@/src/store/store";
import { ImageSource } from "react-native-image-viewing/dist/@types";

export default function MovieDetail() {
  const { movie } = useLocalSearchParams();

  const [movieDetail, setMovieDetail] = React.useState<
    MovieDetailType | undefined | null
  >(undefined);
  const [movieImages, setMovieImages] = React.useState<
    MovieImages["backdrops"]
  >([]);
  const [similarMovies, setSimilarMovies] = React.useState<Movie[]>([]);
  const [cast, setCast] = React.useState<CastResponse["cast"]>([]);

  const [loading, setLoading] = React.useState(false);

  const getMovie = async () => {
    setLoading(true);

    const lang = await AsyncStorage.getItem(constants.language);

    const [moviedetail, movieImages, similarMovies, moviecast] =
      await Promise.all([
        api.getMovieDetail({
          movieId: JSON.parse(movie as string)?.id,
          language: lang || "en-US",
        }),
        api.getMovieImages({ movieId: JSON.parse(movie as string)?.id }),
        api.getSimilarMovies({
          movieId: JSON.parse(movie as string)?.id,
          language: lang || "",
        }),
        api.getMovieCast({
          movieId: JSON.parse(movie as string)?.id,
          language: lang || "",
        }),
      ]);

    if (!moviedetail) {
      setMovieDetail(null);
      return setLoading(false);
    }

    setMovieDetail(moviedetail);
    movieImages && setMovieImages(movieImages.backdrops);
    similarMovies && setSimilarMovies(similarMovies.results);
    moviecast && setCast(moviecast);
    setLoading(false);
  };

  React.useEffect(() => {
    getMovie();
  }, []);

  const runtime = React.useMemo(() => {
    if (!movieDetail) return "";

    const hours = (movieDetail.runtime / 60).toString().split(".")[0];

    return `${hours.includes(".") ? hours.split(".")[0] : hours}h ${
      movieDetail.runtime % 60
    }m`;
  }, [movieDetail]);

  const [visible, setIsVisible] = React.useState(false);
  const [image, setImage] = React.useState("");

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          headerLeft: () => (
            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={50}
              className="p-2 rounded-full overflow-hidden bg-black/20"
            >
              <Icon name="chevron-back" onPress={() => router.back()} />
            </BlurView>
          ),
          headerTitle: "",
          headerTransparent: true,
        }}
      />

      {loading || movieDetail === null || movieDetail === undefined ? (
        <Loader />
      ) : (
        <ScrollView className="flex-1 bg-background">
          <Banner
            movie={JSON.parse(movie as string)}
            genres={movieDetail.genres}
          />

          <View className="p-3">
            <Text className="text-grey">{movieDetail.overview}</Text>

            {/* Descriptions */}
            <View className="flex-row items-center my-8">
              {/* Left side */}
              <View className="flex-1">
                <View className="mb-4">
                  <Text className="text-white">Audio Track</Text>
                  <Text className="text-grey">
                    {movieDetail.spoken_languages
                      .map((lan) => lan.name)
                      .join(", ")}
                  </Text>
                </View>

                <View>
                  <Text className="text-white">Country</Text>
                  <Text className="text-grey">
                    {movieDetail.production_countries[0].name}
                  </Text>
                </View>
              </View>

              {/* Right side */}
              <View className="flex-1">
                <View className="mb-4">
                  <Text className="text-white">Runtime</Text>
                  <Text className="text-grey">{runtime}</Text>
                </View>

                <View>
                  <Text className="text-white">Release Date</Text>
                  <Text className="text-grey">{movieDetail.release_date}</Text>
                </View>
              </View>
            </View>

            <ImageView
              images={[
                {
                  uri: image,
                },
              ]}
              imageIndex={0}
              key={image}
              doubleTapToZoomEnabled={true}
              swipeToCloseEnabled={true}
              visible={visible}
              onRequestClose={() => setIsVisible(false)}
            />

            {/* Images */}
            <View className="w-full">
              <Text className="text-white font-semibold mb-2">Images</Text>
              {movieImages ? (
                <FlatList
                  data={movieImages}
                  keyExtractor={(item) => item.file_path}
                  horizontal
                  ItemSeparatorComponent={() => <View className="w-3" />}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setImage(getImage(item.file_path));
                        setIsVisible(true);
                      }}
                    >
                      <Image
                        source={{ uri: getImage(item.file_path) }}
                        className="rounded-md h-44 aspect-video"
                      />
                    </TouchableOpacity>
                  )}
                />
              ) : null}
            </View>

            {/* CAST */}
            <View className="w-full mt-8">
              <Text className="text-white font-semibold mb-2">Cast</Text>
              {cast ? (
                <FlatList
                  data={cast}
                  keyExtractor={(item) => item.cast_id.toString()}
                  horizontal
                  ItemSeparatorComponent={() => <View className="w-3" />}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/(tabs)/castDetail",
                          params: { castId: item.id },
                        })
                      }
                    >
                      <View className="rounded-md w-[100px] aspect-[9/16] bg-grey">
                        <Image
                          source={{ uri: getImage(item.profile_path) }}
                          className="rounded-md w-full h-full"
                        />
                      </View>
                      <Text className="text-grey mt-1 text-xs font-semibold max-w-[100px]">
                        {item.original_name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              ) : null}
            </View>

            {/* Similar Movies */}
            <View className="w-full mt-8 mb-20">
              <Text className="text-white font-semibold mb-2">
                Similar Contents
              </Text>
              {similarMovies ? (
                <FlatList
                  data={[...similarMovies].filter((mov) => mov.poster_path)}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  ItemSeparatorComponent={() => <View className="w-3" />}
                  renderItem={({ item }) => (
                    <MovieCard favoriteButton={false} movie={item} />
                  )}
                />
              ) : null}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function Banner({
  movie,
  genres,
}: {
  movie: Movie;
  genres: MovieDetailType["genres"];
}) {
  const { handleFavorites } = useHandleFavorites();

  const favorites = useStore((store) => store.favorites);

  return (
    <View className="relative mb-3">
      <Image
        src={getImage(movie.poster_path)}
        className="w-full aspect-[2/3] object-contain z-0"
      />

      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,1)"]}
        className="absolute bottom-0 left-0 w-full px-3 py-3 pb-1 z-10 m-0"
      >
        <View className="flex-row">
          <Icon name="star" color="yellow" size={16} />
          <Text className="font-semibold text-white ml-2">
            {movie.vote_average.toFixed(1)}
          </Text>
        </View>

        <Text className="font-bold text-lg text-white mb-3">
          {movie.original_title}
        </Text>

        <View className="flex-row mb-1">
          {genres.slice(0, 3).map((genre) => {
            return (
              <View
                key={genre.id}
                className="px-3 py-1.5 rounded-full border-solid border-2 border-primary bg-primary/30 mr-3"
              >
                <Text className="text-primary text-xs font-semibold">
                  {genre.name}
                </Text>
              </View>
            );
          })}

          <Button
            type="border"
            onClick={() => handleFavorites(movie)}
            classname="p-1"
          >
            <Icon
              name={
                favorites.some((fav) => fav.id === movie?.id)
                  ? "heart"
                  : "heart-outline"
              }
              size={26}
              color={
                favorites.some((fav) => fav.id === movie.id) ? "red" : "black"
              }
            />
          </Button>
        </View>
      </LinearGradient>
    </View>
  );
}

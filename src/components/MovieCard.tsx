import React from "react";
import { router } from "expo-router";
import { Image, TouchableWithoutFeedback, View, Text } from "react-native";

// components
import { Icon } from "@/src/components/shared/Icon";
import Button from "@/src/components/shared/Button";

// types
import { Movie } from "@/src/types/api.types";

// utils
import { cn } from "@/src/utils/cn";
import { getImage } from "@/src/utils/getImage";

// hooks
import useHandleFavorites from "@/src/hooks/useHandleFavorites";

// store
import { useStore } from "@/src/store/store";

interface IMovieCardProps {
  movie: Movie;
  favoriteButton: boolean;
  classname?: string;
}

function MovieCard(props: IMovieCardProps) {
  const { handleFavorites } = useHandleFavorites();

  const favorites = useStore((store) => store.favorites);

  return (
    <TouchableWithoutFeedback
      onPress={() =>
        router.push({
          pathname: `/movieDetail`,
          params: { movie: JSON.stringify(props.movie) },
        })
      }
    >
      <View
        className={cn(
          "relative w-36 aspect-[2/3] bg-grey rounded-md",
          props.classname
        )}
      >
        <Image
          source={{ uri: getImage(props.movie.poster_path) }}
          className="w-full h-full rounded-md"
        />

        <View
          className={cn(
            "flex-row items-center justify-between w-full absolute top-2.5 pl-2",
            { "pl-5": props.favoriteButton }
          )}
        >
          <View className="flex-row items-center bg-[#00000090] p-1 rounded-lg gap-1">
            <Icon name="star" size={16} color="#ffea00" />
            <Text className="text-white font-bold">
              {props.movie.vote_average.toFixed(1)}
            </Text>
          </View>

          {props.favoriteButton ? (
            <Button
              type="border"
              onClick={() => handleFavorites(props.movie)}
              classname="flex-row items-center justify-center bg-[#00000090] p-2 rounded-full"
            >
              <Icon
                name={
                  favorites.some((fav) => fav.id === props.movie.id)
                    ? "heart"
                    : "heart-outline"
                }
                size={20}
                color={
                  favorites.some((fav) => fav.id === props.movie.id)
                    ? "red"
                    : "white"
                }
              />
            </Button>
          ) : null}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default React.memo(MovieCard);

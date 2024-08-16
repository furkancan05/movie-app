import React from "react";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { View, Text, ScrollView, Image, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// components
import { Icon } from "@/src/components/shared/Icon";
import { BlurView } from "expo-blur";
import MovieCard from "@/src/components/MovieCard";
import Loader from "@/src/components/Loader";

// utils
import { getImage } from "@/src/utils/getImage";
import api from "@/src/utils/fetchers";

// types
import {
  CastDetail as CastDetailType,
  CastMovies,
} from "@/src/types/api.types";

// config
import { constants } from "@/src/config/constants";

export default function CastDetail() {
  const { castId } = useLocalSearchParams();

  const [castDetail, setCastDetail] = React.useState<
    CastDetailType | undefined | null
  >(undefined);
  const [castMovies, setCastMovies] = React.useState<CastMovies["cast"]>([]);

  const [loading, setLoading] = React.useState(false);

  const getCast = async () => {
    setLoading(true);

    const lang = await AsyncStorage.getItem(constants.language);

    const [castDetail, castMovies] = await Promise.all([
      api.getCastDetail({
        castId: JSON.parse(castId as string),
        language: lang || "en-US",
      }),
      api.getCastMovies({
        castId: JSON.parse(castId as string),
        language: lang || "en-US",
      }),
    ]);

    if (!castDetail) {
      setCastDetail(null);
      return setLoading(false);
    }

    setCastDetail(castDetail);
    castMovies && setCastMovies(castMovies.cast);
    setLoading(false);
  };

  React.useEffect(() => {
    getCast();
  }, []);

  return (
    <View className="flex-1">
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
          headerTitle: "",
          headerTransparent: true,
        }}
      />

      {loading || castDetail === null || castDetail === undefined ? (
        <Loader />
      ) : (
        <ScrollView className="flex-1 bg-background">
          <Banner cast={castDetail} />

          <View className="p-3">
            <Text className="text-lg text-white font-semibold">
              {castDetail.name}
            </Text>

            {/* Details */}
            <View className="w-full my-8">
              <View className="flex-row">
                <View className="flex-1">
                  <Text className="text-white mb-2">Born</Text>
                  <Text className="text-grey">{castDetail.birthday}</Text>
                </View>

                <View className="flex-1 mb-6">
                  <View className="flex-1">
                    <Text className="text-white text-center mb-2">Age</Text>
                    <Text className="text-grey text-center">
                      {new Date().getFullYear() -
                        new Date(castDetail.birthday).getFullYear()}
                    </Text>
                  </View>
                </View>

                <View className="flex-1">
                  <View className="flex-1">
                    <Text className="text-white text-right mb-2">Death</Text>
                    <Text className="text-grey text-right">
                      {castDetail.deathday || "---"}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="w-full">
                <View className="flex-row">
                  <View className="flex-1">
                    <Text className="text-white mb-2">Nation</Text>
                    <Text className="text-grey">
                      {castDetail.place_of_birth}
                    </Text>
                  </View>

                  <View className="flex-1">
                    <View className="flex-1">
                      <Text className="text-white text-right mb-2">Gender</Text>
                      <Text className="text-grey text-right">
                        {castDetail.gender === 1 ? "Woman" : "Man"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <Text className="text-grey">{castDetail.biography}</Text>

            {/* Movies */}
            <View className="w-full mt-8 mb-20">
              <Text className="text-white font-semibold mb-2">Movies</Text>
              {castMovies ? (
                <FlatList
                  data={castMovies}
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

function Banner({ cast }: { cast: CastDetailType }) {
  return (
    <View className="relative mb-3">
      <Image
        src={getImage(cast.profile_path)}
        className="w-full aspect-[2/3] object-contain z-0"
      />
    </View>
  );
}

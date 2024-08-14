import React from "react";
import { View, Text, FlatList } from "react-native";

// components
import MovieCard from "@/src/components/MovieCard";

// store
import { useStore } from "@/src/store/store";

export default function FavoritesScreen() {
  const favorites = useStore((store) => store.favorites);

  return (
    <View className="flex-1 bg-background pt-24">
      {favorites.length === 0 ? (
        <Text className="text-center color-white/50 mb-6 w-full">
          No favorites here
        </Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <MovieCard
              favoriteButton={true}
              movie={item}
              classname="w-1/2 p-2 bg-transparent"
            />
          )}
        />
      )}
    </View>
  );
}

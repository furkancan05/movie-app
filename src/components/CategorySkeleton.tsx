import React from "react";
import { View, FlatList } from "react-native";

// components
import Skeleton from "@/src/components/shared/Skeleton";

export default function CategorySkeleton() {
  const data = ["", "", "", "", "", "", "", ""];

  return (
    <FlatList
      data={data}
      keyExtractor={(_, i) => i.toString()}
      numColumns={2}
      ListFooterComponent={<View className="h-20" />}
      className="pt-20"
      renderItem={() => (
        <View className="w-1/2 aspect-[2/3] bg-red p-2">
          <Skeleton classname="w-full h-full" />
        </View>
      )}
    />
  );
}

import React from "react";
import { View, ScrollView } from "react-native";

// components
import Skeleton from "@/src/components/shared/Skeleton";

export default function MovieDetailSkeleton() {
  return (
    <ScrollView className="flex-1 bg-background gap-8">
      <View className="w-full aspect-[2/3]">
        <Skeleton />
      </View>

      <View className="w-full h-32">
        <Skeleton />
      </View>

      <View className="w-full h-44 mb-10">
        <Skeleton />
      </View>
    </ScrollView>
  );
}

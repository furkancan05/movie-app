import React from "react";
import { View, Image, ActivityIndicator } from "react-native";

// assets
import LOGO from "@/assets/icon.png";

export default function Loader() {
  return (
    <View className="flex-1 bg-background items-center justify-center gap-6">
      <View className="w-1/3 aspect-square">
        <Image source={LOGO} className="w-full h-full" />
      </View>
      <ActivityIndicator color="white" size={32} />
    </View>
  );
}

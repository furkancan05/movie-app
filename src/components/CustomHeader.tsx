import React from "react";
import { Text } from "react-native";
import { BlurView } from "expo-blur";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";

export default function CustomHeader(props: BottomTabHeaderProps) {
  const isBlur = props.route.name !== "search";

  return (
    <BlurView
      experimentalBlurMethod="dimezisBlurView"
      intensity={isBlur ? 30 : 0}
      className="w-full h-20 overflow-hidden absolute flex items-center justify-end"
    >
      <Text className="text-white font-bold text-lg pb-3">
        {props.options.title}
      </Text>
    </BlurView>
  );
}

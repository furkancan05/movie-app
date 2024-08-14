import React from "react";
import { Animated, Dimensions, Easing, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// utils
import { cn } from "@/src/utils/cn";

const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);

export default function Skeleton({ classname }: { classname?: string }) {
  const animatedValue = new Animated.Value(0);

  const width = Dimensions.get("window").width;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 2, width * 2],
  });

  return (
    <View className={cn("w-full h-full bg-grey/40 overflow-hidden", classname)}>
      <AnimatedLG
        colors={["#c6c6c610", "#b0b0b050", "#b0b0b050", "#c6c6c610"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{
          width: "100%",
          height: "100%",
          transform: [{ translateX: translateX }],
        }}
      />
    </View>
  );
}

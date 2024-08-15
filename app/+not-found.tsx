import Button from "@/src/components/shared/Button";
import { Link, Stack } from "expo-router";
import { View, Text } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Oops!",
          headerTransparent: true,
          headerTitleAlign: "center",
          headerTitleStyle: { color: "white" },
        }}
      />
      <View className="flex-1 items-center justify-center bg-background p-5">
        <Text className="text-white">This screen doesn't exist.</Text>
        <Link href="/(tabs)" className="mt-4 py-4">
          <Button>
            <Text className="text-white">Go to home screen!</Text>
          </Button>
        </Link>
      </View>
    </>
  );
}

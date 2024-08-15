import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="category" />
      <Stack.Screen name="castDetail" />
      <Stack.Screen name="movieDetail" />
    </Stack>
  );
}

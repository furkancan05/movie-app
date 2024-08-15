import React from "react";
import { Tabs } from "expo-router";

// components
import { BlurView } from "expo-blur";
import { Icon } from "@/src/components/shared/Icon";
import CustomHeader from "@/src/components/CustomHeader";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: {
          color: "white",
        },
        header: (props) => <CustomHeader {...props} />,
        tabBarStyle: {
          position: "absolute",
          elevation: 0,
          borderColor: "transparent",
        },
        tabBarBackground: () => (
          <BlurView
            experimentalBlurMethod="dimezisBlurView"
            intensity={30}
            className="flex-1 overflow-hidden"
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? "home" : "home-outline"}
              color={focused ? "#0d86f1" : "#FFFFFF"}
            />
          ),
        }}
      />
      ,
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? "search" : "search-outline"}
              color={focused ? "#0d86f1" : "#FFFFFF"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? "heart" : "heart-outline"}
              color={focused ? "#0d86f1" : "#FFFFFF"}
            />
          ),
        }}
      />
    </Tabs>
  );
}

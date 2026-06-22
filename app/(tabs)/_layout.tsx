import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { TabBarStyles } from "@/constants/style";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? "dark"].tint,
        tabBarActiveTintColor:
          TabBarStyles[colorScheme ?? "light"].activeTintColor,
        tabBarInactiveTintColor:
          TabBarStyles[colorScheme ?? "light"].inactiveTintColor,
        tabBarStyle: TabBarStyles[colorScheme ?? "light"].tabBarStyle,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Recipes",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="menucard.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: "Grocery List",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="list.dash.header.rectangle.fill"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="info.circle.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

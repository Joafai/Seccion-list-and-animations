import { Tabs } from "expo-router";
import React from "react";
import { CalendarIcon, HomeIcon } from "react-native-heroicons/outline";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, focused }) => <CalendarIcon color={color} />,
        }}
      />
    </Tabs>
  );
}

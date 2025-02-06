import React from "react";
import { Stack } from "expo-router";

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#FF6E4E" },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="Chat/[roomId]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Home/details/[detailsId]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="search/[searchId]"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Home/details/FilterPage"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Products/[edit]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Profile/updateProfile/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Profile/ChangeLang"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Likes"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Profile/CityNeighborhoodPicker"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

import React from "react";
import { Tabs } from "expo-router";
import { Image, View, Platform } from "react-native";
import { icons } from "@/constants";
import { useUserStore } from "@/store/userStore";

export default function TabLayout() {
  const { language } = useUserStore();

  const getTabTitle = (tabName: string): string => {
    const translations = {
      home: { ar: "الرئيسية", en: "Home", fr: "Accueil" },
      products: { ar: "منتجاتي", en: "My Products", fr: "Mes Produits" },
      create: { ar: "إضافة", en: "Create", fr: "Créer" },
      chats: { ar: "دردشاتي", en: "Chats", fr: "Discussions" },
      profile: { ar: "حسابي", en: "My Profile", fr: "Mon Profil" },
    } as any;

    return translations[tabName]?.[language] || translations[tabName]?.en;
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF6E4E",
        tabBarInactiveTintColor: "#9E9E9E",
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            height: 60,
            backgroundColor: "#fff",
          },
          default: {
            position: "relative",
            backgroundColor: "#fff",
            height: 60,
          },
        }),
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 10,
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: getTabTitle("home"),
          tabBarIcon: ({ color }) => (
            <View style={{ marginBottom: 3 }}>
              <Image
                source={icons.home}
                tintColor={color}
                resizeMode="contain"
                style={{ width: 24, height: 24 }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Products/index"
        options={{
          title: getTabTitle("products"),
          tabBarIcon: ({ color }) => (
            <View style={{ marginBottom: 5 }}>
              <Image
                source={icons.product}
                tintColor={color}
                resizeMode="contain"
                style={{ width: 24, height: 24 }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Create/index"
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color }) => (
            <View style={{ marginBottom: 5 }}>
              {color === "#FF6E4E" ? (
                <Image
                  source={icons.create2}
                  resizeMode="contain"
                  style={{ width: 40, height: 40 }}
                />
              ) : (
                <Image
                  source={icons.create1}
                  resizeMode="contain"
                  style={{ width: 40, height: 40 }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Chats/index"
        options={{
          title: getTabTitle("chats"),
          tabBarIcon: ({ color }) => (
            <View style={{ marginBottom: 5 }}>
              <Image
                source={icons.chat}
                tintColor={color}
                resizeMode="contain"
                style={{ width: 24, height: 24 }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Profile/index"
        options={{
          title: getTabTitle("profile"),
          tabBarIcon: ({ color }) => (
            <View style={{ marginBottom: 5 }}>
              <Image
                source={icons.user}
                tintColor={color}
                resizeMode="contain"
                style={{ width: 24, height: 24 }}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

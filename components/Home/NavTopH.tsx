import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { useRouter } from "expo-router";
import { icons } from "../../constants";
import ProductCategories from "./ProductCategories";
import { useUserStore } from "@/store/userStore";

interface NavTopHProps {
  title: string; // Title for routing or search functionality
  containerStyle?: any; // Optional additional styles for the container
  logo?: boolean; // Determines whether to show the logo
  toggleSidebar: (event: GestureResponderEvent) => void; // Callback for toggling the sidebar
}

const NavTopH: React.FC<NavTopHProps> = ({
  title,
  containerStyle = "",
  logo = false,
  toggleSidebar,
}) => {
  const router = useRouter();
  const { setLanguage, language } = useUserStore();

  // Handler to toggle language
  const handleToggleLanguage = (newLanguage: "ar" | "en" | "fr") => {
    setLanguage(newLanguage);
  };

  return (
    <View>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        {logo && (
          <Image
            source={icons.logo}
            style={[styles.logo]}
            resizeMode="contain"
          />
        )}

        <View className="flex-row mx-0 my-auto justify-center items-center">
          {/* Bill Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            className=" flex justify-center items-center p-[18px]  w-6 h-6 rounded-full bg-gray-200  ml-1"
            onPress={toggleSidebar}
          >
            <Image
              source={icons.billH}
              style={styles.icon}
              tintColor="#000"
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Search Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            className=" flex justify-center items-center p-[18px]  w-6 h-6 rounded-full bg-gray-200 ml-2"
            onPress={() => router.push(`/screens/search/[id]`)}
          >
            <Image
              source={icons.searchH}
              style={styles.icon}
              tintColor="#000"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Below Navigation Bar */}
      <View style={styles.content}>
        <ProductCategories />
      </View>
    </View>
  );
};

export default NavTopH;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#000",
  },
  navBar: {
    width: "100%",
    alignItems: "flex-end",
    flexDirection: "row-reverse",
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  logo: {
    width: 32,
    height: 32,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 5,
  },
  icon: {
    width: 20,
    height: 20,
  },
  content: {
    width: "100%",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
});

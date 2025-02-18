import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, View } from "react-native";
import * as Animatable from "react-native-animatable";

const RotatingIcon = () => {
  return (
    <View className="flex items-center justify-center relative w-full h-full  bg-primary">
      <Image
        source={require("../../assets/images/splash.png")}
        className="h-full w-full"
        resizeMode="contain"
      />
      <Animatable.View
        animation={{
          from: { rotate: "0deg" },
          to: { rotate: "360deg" },
        }}
        iterationCount="infinite"
        duration={6000} // Duration of one full rotation (2 seconds)
        easing="linear" // Linear easing for smooth rotation
        className="w-16 h-16 absolute bottom-40"
      >
        <Image
          source={require("../../assets/images/ss.png")}
          resizeMode="contain"
          className="w-16 h-16"
        />
      </Animatable.View>
      <StatusBar style="light" />
    </View>
  );
};

export default RotatingIcon;

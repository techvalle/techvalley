import React, { ReactNode } from "react";
import { ScrollView, StyleSheet, ScrollViewProps } from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";

interface SafeAreaScrollViewProps extends SafeAreaViewProps {
  children: ReactNode;
  className?: string; // Optional additional class names for SafeAreaView
  scrollClassName?: any; // Optional additional class names for ScrollView
  contentContainerStyle?: ScrollViewProps["contentContainerStyle"]; // For styling content inside ScrollView
  scrollEnabled?: boolean; // Optionally enable or disable scrolling
}

const SafeAreaScrollView: React.FC<SafeAreaScrollViewProps> = ({
  children,
  className = "",
  scrollClassName = "",
  contentContainerStyle = {},
  scrollEnabled = true,
  ...safeAreaProps
}) => {
  return (
    <SafeAreaView
      style={[styles.safeArea, safeAreaProps.style]}
      {...safeAreaProps}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
        style={[
          styles.scrollView,
          scrollClassName && { className: scrollClassName },
        ]}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SafeAreaScrollView;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

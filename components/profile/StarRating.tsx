import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface StarRatingProps {
  rating: number; // The current rating (e.g., 3.5)
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const totalStars = 5; // Total number of stars

  // Function to render stars
  const renderStars = () => {
    const stars: JSX.Element[] = [];
    for (let i = 1; i <= totalStars; i++) {
      if (i <= rating) {
        // Full star
        stars.push(
          <FontAwesome key={i} name="star" size={13} color="#FF6E4E" />
        );
      } else if (i - 0.5 <= rating) {
        // Half star
        stars.push(
          <View key={i} style={styles.halfStarWrapper}>
            <FontAwesome name="star" size={13} color="#FF6E4E" />
            <FontAwesome name="star-o" size={13} color="#d3d3d3" />
          </View>
        );
      } else {
        // Empty star
        stars.push(
          <FontAwesome key={i} name="star-o" size={13} color="#d3d3d3" />
        );
      }
    }
    return stars;
  };

  return <View style={styles.starContainer}>{renderStars()}</View>;
};

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,
  halfStarWrapper: {
    position: "relative",
    width: 13, // Same as star size
    height: 13, // Same as star size
  } as ViewStyle,
  halfStarOverlay: {
    position: "absolute",
    left: 6.5, // Half of the star width
  } as ViewStyle,
});

export default StarRating;

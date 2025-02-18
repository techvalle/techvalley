import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useUserStore } from "@/store/userStore";
import ImageGrid from "./ImageGrid";
import { useProductStore } from "@/store/productStore";
import { translationProducst } from "@/constants/lang";

const ProductDetailss = () => {
  const { language } = useUserStore();
  const { currentProduct } = useProductStore();

  const t = translationProducst[language || "en"]; // Fallback to English if language is undefined

  if (!currentProduct.Details) {
    return null;
  }

  const styles = {
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 5,
    },
    description: {
      fontSize: 16,
      color: "gray",
      marginBottom: 15,
      marginTop: 5,
    },
  } as any;

  return (
    <>
      {/* Price and Title Section */}
      <View className="justify-between items-center flex-row py-3">
        <View className="bg-primary p-1 rounded-md ml-2 max-w-[100px]">
          <Text className="text-white font-bold text-base">
            <Text className="text-[10px] mx-3 text-white"> {t.currency} </Text>
            {currentProduct.Details.price}
          </Text>
        </View>
        <Text style={styles.title} className="text-primary">
          {currentProduct.Details.salesName}
        </Text>
      </View>

      {/* Description */}
      <Text style={styles.description} className="text-right">
        {currentProduct.Details.description
          ? currentProduct.Details.description
          : t.noDescription}
      </Text>
      {/* Image Grid */}
      <ImageGrid />
    </>
  );
};

export default ProductDetailss;

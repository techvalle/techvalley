import React from "react";
import { View, Text, Image } from "react-native";
import { icons } from "../../constants";
import { Product, ProductDetails } from "@/types/appwriteTypes";
import { ImageAt } from "../ui/ImageAt";

type CardPPProps = {
  productDetails: ProductDetails;
  item: Product;
};

const CardPP: React.FC<CardPPProps> = ({ productDetails, item }) => {
  return (
    <View style={{ flexDirection: "row", marginBottom: 10 }}>
      {/* Left side: Name, Description, and Price */}
      <View style={{ flex: 1, justifyContent: "flex-start", paddingRight: 10 }}>
        {/* Product Name */}
        <Text
          style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}
          numberOfLines={1}
          className="text-primary font-sans-arabic-bold text-right"
        >
          {productDetails?.salesName}
        </Text>
        {/* Product Description */}
        <Text
          style={{ fontSize: 16, marginBottom: 5 }}
          numberOfLines={1}
          className="text-right"
        >
          {productDetails.description}
        </Text>
        {/* Product Price */}
        <View className="justify-center items-end">
          <View className="bg-primary p-1 rounded-sm">
            <Text
              className="text-right"
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "white",
              }}
            >
              <Text className="text-[10px] mx-3"> XAF </Text>
              {productDetails.price}
            </Text>
          </View>
        </View>
      </View>
      {/* Right side: Image */}
      <View className="justify-center items-center">
        <ImageAt
          source={productDetails.mainPhoto}
          style={{
            width: 100,
            height: 100,
            borderRadius: 10,
            resizeMode: "cover",
          }}
          contentFit="cover"
        />
        <View className="flex-row justify-center items-center mt-1">
          <Image
            source={icons.anE}
            className={`w-4 h-4 mr-1`}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 14, color: "gray" }}>
            {item.views.view_count ?? 0} {/* Fallback to 0 if undefined */}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CardPP;

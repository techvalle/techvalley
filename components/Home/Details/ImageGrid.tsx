import React, { useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

import { useUserStore } from "@/store/userStore";
import { useProductStore } from "@/store/productStore";
import { translationImageGrid } from "@/constants/lang";

const ImageGrid = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { currentProduct } = useProductStore();

  const { language } = useUserStore();

  const t = translationImageGrid[language || "ar"]; // Default to English if language is undefined

  const styles = {
    gridImage: {
      width: "49.5%",
      height: 150,
      borderRadius: 5,
      marginBottom: 10,
    },
    columnWrapper: {
      justifyContent: "space-between",
    },
    modalImage: {
      width: "90%",
      height: "70%",
      borderRadius: 10,
    },
  } as any;

  const renderImageItem = ({ item }: { item: any }) => {
    if (!item) {
      console.warn("Image item is null or undefined");
      return null;
    }

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.gridImage}
        onPress={() => {
          setSelectedImage(item);
          setModalVisible(true);
        }}
        accessibilityLabel={t.tapToView}
      >
        <Image
          source={{ uri: item }}
          className="w-full h-full rounded-md"
          resizeMode="cover"
          onError={(error) =>
            console.error("Failed to load image:", error.nativeEvent.error)
          }
        />
      </TouchableOpacity>
    );
  };

  if (
    !currentProduct ||
    (!currentProduct.Details?.mainPhoto &&
      !currentProduct.Details?.descriptionPhotos?.length)
  ) {
    return <Text className="text-center text-gray-500 mt-4">{t.noImages}</Text>;
  }

  return (
    <View>
      <FlatList
        scrollEnabled={false}
        data={[
          currentProduct?.Details?.mainPhoto,
          ...(currentProduct?.Details?.descriptionPhotos || []),
        ]}
        renderItem={renderImageItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        backdropOpacity={0.1}
        animationIn="zoomIn"
        animationOut="zoomOut"
        style={{ margin: 0, justifyContent: "center", alignItems: "center" }}
      >
        <View className="items-center w-96 h-96">
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          ) : (
            <Text className="text-center text-gray-500">
              {t.imageNotAvailable}
            </Text>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default ImageGrid;

import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { router, useRouter } from "expo-router";
import { categoryOptions, chadCities, icons } from "@/constants";
import FormFieldC from "@/components/Create/FormFieldC";
import CustomPickerV2 from "@/components/ui/CustomPickerV2";
import CustomButton from "@/components/ui/CustomButton";
import BuyModal from "@/components/Create/BuyModal";
import { useUserStore } from "@/store/userStore";
import { createProduct, uploadImageToCloud } from "@/lib/api";
import CustomButtonV2 from "@/components/Create/CustomButtonV2";
import { translationCreate } from "@/constants/lang";

const MAX_DESCRIPTION_PHOTOS = 5;

const Create = () => {
  const [mainPhoto, setMainPhoto] = useState<string | null>(null);
  const [descriptionPhotos, setDescriptionPhotos] = useState<string[]>([]);
  const [salesName, setSalesName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const { user, language, setLanguage } = useUserStore();

  const [description, setDescription] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [categories, setCategories] = useState({
    category1: "",
    category2: "",
    category3: "",
  });

  const t = translationCreate[language];

  // useEffect to show the modal when the page is loaded
  useEffect(() => {
    setIsModalVisible(true);
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleReplaceDescriptionPhoto = async (index: number) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        // Compress the selected image
        const compressedUri = await compressImage(result.assets[0].uri);

        // Update the specific index in the descriptionPhotos array
        setDescriptionPhotos((prevPhotos) => {
          const updatedPhotos = [...prevPhotos];
          updatedPhotos[index] = compressedUri;
          return updatedPhotos;
        });

        // Success notification
        Toast.show({
          type: "success",
          text1: "Photo replaced successfully!",
        });
      }
    } catch (error) {
      console.error("Error replacing image:", error);

      // Error notification
      Toast.show({
        type: "error",
        text1: "Failed to replace the photo. Please try again.",
      });
    }
  };

  const compressImage = async (uri: string) => {
    const result = await manipulateAsync(uri, [{ resize: { width: 800 } }], {
      compress: 0.6,
      format: SaveFormat.JPEG,
    });
    return result.uri;
  };

  const handleAddMainPhoto = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Toast.show({ type: "error", text1: t.selectMainPhotoError });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const compressedUri = await compressImage(result.assets[0].uri);
      setMainPhoto(compressedUri);
    }
  };

  const handleAddDescriptionPhoto = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Toast.show({ type: "error", text1: t.selectDescriptionPhotoError });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const compressedUri = await compressImage(result.assets[0].uri);
      setDescriptionPhotos([...descriptionPhotos, compressedUri]);
    }
  };

  const validateForm = () => {
    if (!salesName) return t.validationError;
    if (!description) return t.validationError;
    if (!mainPhoto) return t.validationError;
    if (!price) return t.validationError;
    return null;
  };

  const handleCancel = (loading: boolean, resetForm: () => void) => {
    // Translations for the error toast
    const translations = {
      ar: {
        errorTitle: "خطأ",
        errorMessage: "فشل إلغاء النموذج. يرجى المحاولة مرة أخرى.",
      },
      en: {
        errorTitle: "Error",
        errorMessage: "Failed to cancel the form. Please try again.",
      },
      fr: {
        errorTitle: "Erreur",
        errorMessage:
          "Échec de l'annulation du formulaire. Veuillez réessayer.",
      },
    };

    if (loading) return; // Prevent double navigation

    setLoading(true);
    try {
      // Reset all states to their initial values
      resetForm();
      // Navigate back to the home page
      router.push("/(tabs)/home");
    } catch (error) {
      console.error("Error cancelling form:", error);

      // Show localized error toast
      const { errorTitle, errorMessage } = translations[language];
      Toast.show({
        type: "error",
        text1: errorTitle,
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setMainPhoto(null);
    setDescriptionPhotos([]);
    setSalesName("");
    setPrice("");
    setDescription("");
    setSelectedCity(null);
    setCategories({ category1: "", category2: "", category3: "" });
  };

  const handlePost = async () => {
    try {
      const validationError = validateForm();
      if (validationError) {
        Toast.show({ type: "error", text1: validationError });
        return;
      }

      setLoading(true);
      if (!user) throw new Error("User not logged in");

      const mainPhotoUrl = await uploadImageToCloud(
        mainPhoto as string,
        "main/"
      );
      const descriptionPhotoUrls = await Promise.all(
        descriptionPhotos.map((photo) =>
          uploadImageToCloud(photo, "additional/")
        )
      );

      const details = {
        salesName,
        description,
        selectedCity,
        price,
        mainPhoto: mainPhotoUrl,
        descriptionPhotos: descriptionPhotoUrls,
        categories,
      };

      const response = await createProduct(details as any, user.$id);
      if (response) {
        Toast.show({ type: "success", text1: t.productCreated });
        resetForm();
        router.push("/Products");
      } else {
        throw new Error("Failed to create the product.");
      }
    } catch (error) {
      Toast.show({ type: "error", text1: t.errorFetching });
    } finally {
      setLoading(false);
    }
  };

  const handleDevice1Change = (value: string | null) => {
    setCategories({
      category1: value || "",
      category2: "",
      category3: "",
    });
  };

  const handleDevice2Change = (value: string | null) => {
    setCategories((prevCategories) => ({
      ...prevCategories,
      category2: value || "",
      category3: "",
    }));
  };

  const handleDevice3Change = (value: string | null) => {
    setCategories((prevCategories) => ({
      ...prevCategories,
      category3: value || "",
    }));
  };

  return (
    <SafeAreaView className="h-full w-full p-3 bg-secondary">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full justify-center items-center">
          <Text className="font-sans-arabic-medium text-xl mb-4 text-right text-primary">
            {t.addProductTitle}
          </Text>
        </View>
        {user && (
          <View className="flex-row-reverse border-b-[1px] border-b-[#d2d1d1]  py-3 mb-6">
            <Image
              source={{ uri: user?.Details?.imageUrl || icons.profile }}
              className="w-14 h-14 rounded-full ml-4"
              resizeMode="cover"
            />
            <View className="pt-1 justify-center items-center">
              <Text className="text-primary ml-4 font-sans-arabic-semibold ">
                {user?.Details?.name}
              </Text>
            </View>
          </View>
        )}

        {/* Main Photo Section */}
        <View className="mb-7 gap-4 items-center">
          <Text>{t.addPhoto}</Text>
          <TouchableOpacity
            onPress={handleAddMainPhoto}
            className="w-40 h-40  bg-[#f9856b] justify-center items-center mt-2 rounded-md overflow-hidden"
          >
            {mainPhoto ? (
              <Image
                source={{ uri: mainPhoto }}
                className="w-full h-full "
                resizeMode="cover"
              />
            ) : (
              <>
                <Image
                  source={icons.camera1}
                  className="w-10 h-10 mb-2"
                  tintColor={"white"}
                  resizeMode="contain"
                />
                <Text className="text-white">{t.addMainPhoto}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        {/* Description Photos Section */}
        <View className="mb-4">
          <ScrollView
            horizontal
            className="flex-row mt-2"
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: 1000, y: 0 }}
          >
            {descriptionPhotos.map((photo, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleReplaceDescriptionPhoto(index)} // Function to replace the selected photo
                className="w-24 h-24 ml-1 rounded-md overflow-hidden"
              >
                <Image
                  source={{ uri: photo }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
            {Array.from(
              { length: MAX_DESCRIPTION_PHOTOS - descriptionPhotos.length },
              (_, index) => (
                <TouchableOpacity
                  key={`placeholder-${index}`}
                  onPress={handleAddDescriptionPhoto}
                  className="w-24 h-24 bg-gray-50 justify-center items-center ml-2 rounded-md overflow-hidden"
                >
                  <Image
                    source={icons.camera1}
                    className="w-6 h-6 mb-2 "
                    resizeMode="contain"
                  />
                  <Text className="text-gray-500 text-[10px]">
                    {t.addDescriptionPhoto}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
        </View>
        {/* Reusable FormField Component for Sales Name */}
        <FormFieldC
          label={t.productName}
          language={language}
          type="t"
          value={salesName}
          onChangeText={setSalesName}
          placeholder={t.enterProductName}
        />
        {/* Reusable FormField Component for Description */}
        <FormFieldC
          label={t.productDescription}
          value={description}
          onChangeText={setDescription}
          language={language}
          type="t"
          placeholder={t.enterDescription}
          multiline
        />

        <FormFieldC
          label={t.productPrice}
          value={price}
          type="n"
          language={language}
          onChangeText={setPrice}
          placeholder={t.enterPrice}
        />

        {/* Categories Section using RNPickerSelect */}
        <View className="mb-4">
          {/* Category 1 */}
          <CustomPickerV2
            label={t.category}
            items={categoryOptions.category1.map((item: any) => ({
              value: item.value,
              label: item.label,
            }))}
            value={categories.category1}
            onValueChange={handleDevice1Change}
            language={language}
          />

          {/* Category 2 */}
          {categories.category1 && (
            <CustomPickerV2
              label={t.subCategory}
              items={
                categoryOptions.category2[categories.category1]?.map(
                  (item: any) => ({
                    value: item.value,
                    label: item.label,
                  })
                ) || []
              }
              value={categories.category2}
              onValueChange={handleDevice2Change}
              language={language}
            />
          )}

          {/* Category 3 */}
          {categories.category2 && (
            <CustomPickerV2
              label={t.subSubCategory}
              items={
                categoryOptions.category3[categories.category2]?.map(
                  (item: any) => ({
                    value: item.value,
                    label: item.label,
                  })
                ) || []
              }
              value={categories.category3}
              onValueChange={handleDevice3Change}
              language={language}
            />
          )}
        </View>
        {/* Error Modal */}
        <View className="my-2">
          {/* City Picker */}
          <CustomPickerV2
            label={t.cityPickerLabel}
            items={chadCities}
            value={selectedCity}
            language={language}
            onValueChange={(value) => setSelectedCity(value)}
          />
        </View>

        {/* Post and Cancel Buttons */}
        <View className="flex-row justify-around mt-4 px-3 ">
          <CustomButtonV2
            title={t.cancel}
            isLoading={loading}
            cancel
            handlePress={() => handleCancel(loading, resetForm)}
            containerStyles={
              "w-28 h-11 bg-white border-[#D2D2D2] border-[1px] bg-black"
            }
            textStyles={"text-textLight"}
          />
          <CustomButtonV2
            title={t.save}
            isLoading={loading}
            handlePress={() => handlePost()}
          />
        </View>
        {/* The BuyModal component */}
        <BuyModal
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          language={language}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;

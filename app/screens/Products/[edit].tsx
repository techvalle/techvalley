import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { router } from "expo-router";
import { categoryOptions, chadCities, icons } from "@/constants";
import FormFieldC from "@/components/Create/FormFieldC";
import CustomPickerV2 from "@/components/ui/CustomPickerV2";
import BuyModal from "@/components/Create/BuyModal";
import { useUserStore } from "@/store/userStore";
import {
  deleteImageFromCloud,
  extractKeyFromUrl,
  updateProduct,
  uploadImageToCloud,
} from "@/lib/api";
import CustomButtonV2 from "@/components/Create/CustomButtonV2";
import { useEditStore } from "@/store/EditStore";
import { translationEditPage, translationErorrsEdit } from "@/constants/lang";

const MAX_DESCRIPTION_PHOTOS = 5;

const EditPage = () => {
  const { productData, clearProductData } = useEditStore();
  console.log(productData);

  const [mainPhoto, setMainPhoto] = useState<string | "">(
    productData.Details.mainPhoto || ""
  );
  const [descriptionPhotos, setDescriptionPhotos] = useState<string[]>(
    productData.Details.descriptionPhotos || []
  );
  const [salesName, setSalesName] = useState(
    productData.Details.salesName || ""
  );
  const [price, setPrice] = useState(productData.Details.price || "");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const { user, language, setLanguage } = useUserStore();

  const [description, setDescription] = useState(
    productData.Details.description || ""
  );
  const [selectedCity, setSelectedCity] = useState<string | null>(
    productData.Details.selectedCity || null
  );
  const [categories, setCategories] = useState({
    category1: productData.Details.categories.category1 || "",
    category2: productData.Details.categories.category2 || "",
    category3: productData.Details.categories.category3 || "",
  });

  // Track changes
  const [changedImages, setChangedImages] = useState({
    mainPhoto: false,
    descriptionPhotos: Array(productData.Details.descriptionPhotos.length).fill(
      false
    ),
  });

  const [oldMainPhoto, setOldMainPhoto] = useState<string | null>(null);
  const [oldDescriptionPhotos, setOldDescriptionPhotos] = useState<string[]>(
    []
  );

  console.log(changedImages);

  const d = translationErorrsEdit[language];
  const t = translationEditPage[language];

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
        const compressedUri = await compressImage(result.assets[0].uri);

        setDescriptionPhotos((prevPhotos) => {
          const updatedPhotos = [...prevPhotos];
          updatedPhotos[index] = compressedUri;
          return updatedPhotos;
        });

        // Track the old photo for deletion
        setOldDescriptionPhotos((prev) => {
          const updatedOldPhotos = [...prev];
          updatedOldPhotos[index] = descriptionPhotos[index];
          return updatedOldPhotos;
        });

        // Mark this photo as changed
        setChangedImages((prev) => {
          const updatedChanges = [...prev.descriptionPhotos];
          updatedChanges[index] = true;
          return { ...prev, descriptionPhotos: updatedChanges };
        });

        Toast.show({
          type: "success",
          text1: "Photo replaced successfully!",
        });
      }
    } catch (error) {
      console.error("Error replacing image:", error);
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
      Toast.show({ type: "error", text1: d.selectMainPhoto });
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

      // Track the old main photo for deletion
      setOldMainPhoto(mainPhoto);

      // Mark the main photo as changed
      setChangedImages((prev) => ({ ...prev, mainPhoto: true }));
    }
  };

  const handleAddDescriptionPhoto = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Toast.show({ type: "error", text1: d.selectDescriptionPhoto });
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
    if (!salesName) return d.validationError;
    if (!description) return d.validationError;
    if (!mainPhoto) return d.validationError;
    if (!price) return d.validationError;
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
      router.push("/(tabs)/Products");
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
    setMainPhoto("");
    setDescriptionPhotos([]);
    setSalesName("");
    setPrice("");
    setDescription("");
    setSelectedCity(null);
    setCategories({ category1: "", category2: "", category3: "" });
  };

  const handleUpdate = async (): Promise<void> => {
    try {
      if (!salesName || !description || !mainPhoto || !price) {
        Alert.alert("Error", "Please fill in all required fields.");
        return;
      }

      setLoading(true);

      // Handle main photo upload or retain URL
      const mainPhotoUrl = mainPhoto.startsWith("http")
        ? mainPhoto
        : await uploadImageToCloud(mainPhoto, "main/");

      // Handle description photos upload or retain URLs
      const descriptionPhotoUrls = await Promise.all(
        descriptionPhotos.map((photo) =>
          photo.startsWith("http")
            ? photo
            : uploadImageToCloud(photo, "additional/")
        )
      );

      // Prepare product details for update
      const details: any = {
        salesName,
        description,
        selectedCity,
        price,
        mainPhoto: mainPhotoUrl,
        descriptionPhotos: descriptionPhotoUrls,
        categories,
      };

      // Delete old photos from storage
      if (oldMainPhoto && changedImages.mainPhoto) {
        await deleteImageFromCloud(extractKeyFromUrl(oldMainPhoto));
      }
      await Promise.all(
        oldDescriptionPhotos.map((url, index) => {
          console.log(url);
          if (changedImages.descriptionPhotos[index]) {
            return deleteImageFromCloud(extractKeyFromUrl(url));
          }
        })
      );

      // Perform the update API call
      await updateProduct(productData.$id, details);
      Alert.alert("Success", "Product updated successfully!");
      router.push("/(tabs)/Products");
    } catch (error) {
      console.error("Error updating product:", error);
      Alert.alert("Error", "Failed to update the product. Please try again.");
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
        <View className="flex-row-reverse items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-0">
            <Image
              source={icons.backArrow}
              className="w-6 h-5 mt-2"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
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
            label="اختر المدينة"
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
            handlePress={() => handleUpdate()}
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

export default EditPage;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { fetchAllProducts } from "@/lib/api";
import calculateTimeAgo from "@/components/Product/calculateTimeAgo";
import GetCityName from "@/components/Product/GetArabicCityName";
import UserTopHome from "@/components/Home/UserTopHome";
import CardHome from "@/components/Home/CardHome";
import { categoryOptions, icons } from "@/constants";
import { useUserStore } from "@/store/userStore";
import { Product } from "@/types/appwriteTypes";
import PhoneNumberModal from "@/components/Product/PhoneNumberModal";
import { translationFilterPage } from "@/constants/lang";

const FilterPage = () => {
  const { category, title } = useLocalSearchParams<{
    category?: string;
    title?: string;
  }>();
  const { user, language } = useUserStore();

  const t = translationFilterPage[language || "ar"];

  const [selectedCategory1, setSelectedCategory1] = useState<string | null>(
    category || null
  );
  const [selectedCategory2, setSelectedCategory2] = useState<string | null>(
    null
  );
  const [selectedCategory3, setSelectedCategory3] = useState<string | null>(
    null
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [phone, setPhone] = useState<string>("+1 234 567 8900");
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts = await fetchAllProducts();
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (error) {
        Alert.alert("Error", "Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const filterProducts = () => {
      const filtered = products.filter(({ Details }) => {
        const matchesCategory1 = selectedCategory1
          ? Details?.categories?.category1 === selectedCategory1
          : true;
        const matchesCategory2 =
          selectedCategory2 !== null
            ? Details?.categories?.category2 === selectedCategory2
            : true;
        const matchesCategory3 =
          selectedCategory3 !== null
            ? Details?.categories?.category3 === selectedCategory3
            : true;
        return matchesCategory1 && matchesCategory2 && matchesCategory3;
      });
      setFilteredProducts(filtered);
    };
    filterProducts();
  }, [products, selectedCategory1, selectedCategory2, selectedCategory3]);

  const handleCategoryChange = (level: 1 | 2 | 3, value: string | null) => {
    if (level === 1) {
      setSelectedCategory1(value);
      setSelectedCategory2(null);
      setSelectedCategory3(null);
    } else if (level === 2) {
      setSelectedCategory2(value === "all" ? null : value);
      setSelectedCategory3(null);
    } else if (level === 3) {
      setSelectedCategory3(value === "all" ? null : value);
    }
  };

  const CategoryButton = ({
    item,
    selectedValue,
    onPress,
    allowSelectAll = false,
  }: {
    item: { value: string; label: { ar: string; en: string; fr: string } };
    selectedValue: string | null;
    onPress: (value: string | null) => void;
    allowSelectAll?: boolean;
  }) => (
    <TouchableOpacity
      onPress={() => onPress(item.value)}
      className={`px-4 py-2 rounded-2xl mr-2 ${
        selectedValue === item.value ||
        (allowSelectAll && item.value === "all" && !selectedValue)
          ? "bg-[#010035]"
          : "bg-secondary"
      }`}
    >
      <Text
        className={`text-center ${
          selectedValue === item.value ||
          (allowSelectAll && item.value === "all" && !selectedValue)
            ? "text-white font-bold"
            : "text-[#010035]"
        }`}
      >
        {allowSelectAll && item.value === "all"
          ? t.selectAll
          : item.label[language]}
      </Text>
    </TouchableOpacity>
  );

  const ProductCard = ({ item }: { item: Product }) => {
    const timeAgo = calculateTimeAgo(item?.$createdAt, language);
    const city = GetCityName(
      item.Details?.selectedCity || "Unknown City",
      language
    );
    const isOwner = item?.creator?.$id === user?.$id;

    return (
      <View className="mb-3 bg-white mx-4" key={item.$id}>
        <UserTopHome
          timeAgo={timeAgo}
          city={city}
          userId={user?.$id || ""}
          item={item}
        />
        <CardHome
          phone={phone}
          setPhone={setPhone}
          item={item}
          setModalVisible={setModalVisible}
          Ownerproduct={isOwner}
        />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <View
        className="py-6 px-2 pt-9 bg-primary"
        style={{ paddingTop: Platform.OS === "ios" ? 20 : 39 }}
      >
        <View className="flex-row-reverse justify-start items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="mx-2">
            <Image
              source={icons.backArrow}
              className="w-5 h-5"
              resizeMode="contain"
              tintColor="white"
            />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">
            {title || t.filterProducts}
          </Text>
        </View>
        {selectedCategory1 && (
          <FlatList
            data={[
              { value: "all", label: { ar: "الكل", en: "All", fr: "Tous" } },
              ...categoryOptions.category2[selectedCategory1],
            ]}
            inverted
            renderItem={({ item }) => (
              <CategoryButton
                item={item}
                selectedValue={selectedCategory2}
                onPress={(value) => handleCategoryChange(2, value)}
                allowSelectAll
              />
            )}
            horizontal
            keyExtractor={(item) => item.value}
            showsHorizontalScrollIndicator={false}
            className="mb-2"
          />
        )}
        {selectedCategory2 && (
          <FlatList
            data={categoryOptions.category3[selectedCategory2] || []}
            renderItem={({ item }) => (
              <CategoryButton
                item={item}
                selectedValue={selectedCategory3}
                onPress={(value) => handleCategoryChange(3, value)}
              />
            )}
            horizontal
            inverted
            keyExtractor={(item) => item.value}
            showsHorizontalScrollIndicator={false}
            className="mb-2"
          />
        )}
      </View>
      <View className="flex-1 pt-4 bg-white">
        {loading ? (
          <ActivityIndicator size="large" color="#3498db" />
        ) : filteredProducts.length > 0 ? (
          <FlatList
            data={filteredProducts}
            renderItem={({ item }) => <ProductCard item={item} />}
            keyExtractor={(item) => item.$id}
          />
        ) : (
          <Text className="text-center text-gray-500 mt-4">{t.noProducts}</Text>
        )}
      </View>
      <PhoneNumberModal
        phoneNumber={phone}
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        lang={language}
      />
    </SafeAreaView>
  );
};

export default FilterPage;

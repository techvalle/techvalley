import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList } from "react-native";
import debounce from "lodash.debounce";

import { SafeAreaView } from "react-native-safe-area-context";
import { fetchAllProducts, searchProducts } from "@/lib/api";
import calculateTimeAgo from "@/components/Product/calculateTimeAgo";
import GetCityName from "@/components/Product/GetArabicCityName";
import UserTopHome from "@/components/Home/UserTopHome";
import CardHome from "@/components/Home/CardHome";
import { Product } from "@/types/appwriteTypes";
import { useUserStore } from "@/store/userStore";
import TopPart from "@/components/Search/TopPart";
import NotfoundPage from "@/components/ui/NotfoundPage";
import PhoneNumberModal from "@/components/Product/PhoneNumberModal";

const translations = {
  en: {
    title: "Cancel",
    searchPlaceholder: "Search by product name...",
    loading: "Loading...",
    noProductsFound: "No products found",
  },
  ar: {
    title: "إلغاء",
    searchPlaceholder: "ابحث باسم المنتج...",
    loading: "جار التحميل...",
    noProductsFound: "لا توجد منتجات",
  },
  fr: {
    title: "Annuler",
    searchPlaceholder: "Rechercher par nom de produit...",
    loading: "Chargement...",
    noProductsFound: "Aucun produit trouvé",
  },
};

const Search: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [phone, setPhone] = useState<string>("+1 234 567 8900");
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const { user, language } = useUserStore();

  const t = translations[language] || translations.en;

  // Fetch all products initially
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await fetchAllProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Debounced search to reduce requests on each keystroke
  const debouncedSearch = useCallback(
    debounce(async (input: string) => {
      setLoading(true);
      try {
        const searchResults = await searchProducts(input);
        setProducts(searchResults);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Handle search input changes
  const handleSearch = (input: string) => {
    setQuery(input);
    debouncedSearch(input);
  };

  // Render individual product
  const renderProduct = ({ item }: { item: Product }) => {
    const timeAgo = calculateTimeAgo(item?.$createdAt);
    const city = GetCityName(item?.Details?.selectedCity || "Unknown City");

    return (
      <View className="mb-3 bg-white mx-4" key={item?.$id}>
        <UserTopHome
          timeAgo={timeAgo}
          city={city}
          item={item}
          userId={user?.$id as any}
        />
        <CardHome
          item={item}
          Ownerproduct={item?.creator?.$id as any}
          phone={phone}
          setPhone={setPhone}
          setModalVisible={setModalVisible}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-bgcolor">
      <TopPart
        query={query}
        title={t.title}
        handleSearch={handleSearch}
        placeholder={t.searchPlaceholder}
      />

      {loading ? (
        <Text className="text-center text-lg mt-4">{t.loading}</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item, index) => `${item?.$id}-${index}`}
          renderItem={renderProduct}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => <NotfoundPage text={t.noProductsFound} />}
        />
      )}
      {/* Phone Modal */}
      <PhoneNumberModal
        phoneNumber={phone}
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        lang={language}
      />
    </SafeAreaView>
  );
};

export default Search;

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Animated,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Product } from "@/types/appwriteTypes";
import { fetchAllProducts } from "@/lib/api";
import NavTopH from "@/components/Home/NavTopH";
import UserTopHome from "@/components/Home/UserTopHome";
import CardHome from "@/components/Home/CardHome";
import calculateTimeAgo from "@/components/Product/calculateTimeAgo";
import GetCityName from "@/components/Product/GetArabicCityName";
import { useUserStore } from "@/store/userStore";
import NotfoundPage from "@/components/ui/NotfoundPage";
import PhoneNumberModal from "@/components/Product/PhoneNumberModal";
import { translationHomePage } from "@/constants/lang";
import { icons } from "@/constants";

// Translations for multiple languages

// Screen width for animations
const { width } = Dimensions.get("window");

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const sidebarAnim = useRef(new Animated.Value(-width)).current;

  const [isModalVisible, setModalVisible] = useState(false);
  const [phone, setPhone] = useState<string>("+1 234 567 8900");
  const { user, language } = useUserStore();

  const t = translationHomePage[language] || translationHomePage.en;

  const loadProducts = async (reset = false) => {
    if (isLoading || (reset && isRefreshing)) return;

    setIsLoading(!reset);
    setIsRefreshing(reset);

    try {
      const fetchedProducts = await fetchAllProducts(null, reset ? 0 : offset);

      if (reset) {
        setProducts(fetchedProducts);
        setOffset(fetchedProducts.length);
        setHasMore(fetchedProducts.length > 0);
      } else if (fetchedProducts.length > 0) {
        setProducts((prev) => [...prev, ...fetchedProducts]);
        setOffset((prev) => prev + fetchedProducts.length);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert(t.errorFetching);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Sidebar toggle animation
  const toggleSidebar = useCallback(() => {
    setSidebarVisible(!isSidebarVisible);
    Animated.timing(sidebarAnim, {
      toValue: isSidebarVisible ? -width : 0,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [isSidebarVisible, sidebarAnim]);

  const handleEndReached = () => {
    if (hasMore) loadProducts();
  };

  const handleRefresh = () => {
    loadProducts(true);
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const productDetails = item.Details || {};
    const timeAgo = calculateTimeAgo(item.$createdAt, language);
    const city = GetCityName(
      productDetails?.selectedCity || t.unknownCity,
      language
    );

    return (
      <View style={styles.productContainer}>
        <UserTopHome
          timeAgo={timeAgo}
          city={city}
          userId={user?.$id || ""}
          item={item}
        />
        <CardHome
          item={item}
          phone={phone}
          setPhone={setPhone}
          setModalVisible={setModalVisible}
          Ownerproduct={item.creator?.$id === user?.$id}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavTopH
        toggleSidebar={toggleSidebar}
        logo
        title={t.myProducts}
        containerStyle="w-14 h-14"
      />
      {/* Sidebar */}
      <Animated.View
        className="h-screen"
        style={{
          position: "absolute",
          top: 0,
          left: sidebarAnim,
          width: width * 0.8,
          backgroundColor: "#fff",
          zIndex: 10,
          paddingTop: 50,
          paddingLeft: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        <Pressable
          onPress={toggleSidebar}
          className="flex flex-row-reverse justify-start items-center"
        >
          <Image
            source={icons.backArrow}
            className="w-5 h-5 ml-3"
            resizeMode="contain"
          />
          <Text className="font-sans-arabic-regular text-primary text-3xl">
            الاشعارات
          </Text>
        </Pressable>
      </Animated.View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.$id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading ? <ActivityIndicator size="small" color="#FF6E4E" /> : null
        }
        ListEmptyComponent={() =>
          !isLoading && <NotfoundPage text={t.noProducts} />
        }
      />

      <PhoneNumberModal
        phoneNumber={phone}
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        lang={language}
      />
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  productContainer: {
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
    padding: 10,
    marginHorizontal: 10,
  },
});

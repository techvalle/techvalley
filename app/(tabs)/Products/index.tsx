import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import {
  deleteDocument,
  deleteImageFromCloud,
  deleteMultipleImagesFromCloud,
  extractKeyFromUrl,
  fetchUserProductsDocument,
} from "@/lib/api";
import { appwriteConfig } from "@/lib/config";
import { useUserStore } from "@/store/userStore";
import { Product, ProductDetails } from "@/types/appwriteTypes";
import calculateTimeAgo from "@/components/Product/calculateTimeAgo";
import GetCityName from "@/components/Product/GetArabicCityName";
import NavTop from "@/components/Product/NavTop";
import UserTop from "@/components/Product/UserTop";
import CardPP from "@/components/Product/CardPP";
import NotfoundPage from "@/components/ui/NotfoundPage";
import { SafeAreaView } from "react-native-safe-area-context";

// Translations for Arabic, English, and French
const translations = {
  en: {
    headerTitle: "My Products",
    loading: "Loading...",
    noProducts: "You have no products.",
    errorDeleting: "Failed to delete product. Please try again.",
  },
  ar: {
    headerTitle: "منتجاتي",
    loading: "جاري التحميل...",
    noProducts: "ليس لديك منتجات.",
    errorDeleting: "فشل في حذف المنتج. يرجى المحاولة مرة أخرى.",
  },
  fr: {
    headerTitle: "Mes Produits",
    loading: "Chargement...",
    noProducts: "Vous n'avez aucun produit.",
    errorDeleting: "Échec de la suppression du produit. Veuillez réessayer.",
  },
};

const Products: React.FC = () => {
  const { user, language } = useUserStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const t = translations[language] || translations.en;

  const syncProducts = async ({ reset = false } = {}) => {
    if (!user?.$id) {
      setLoading(false);
      return;
    }

    reset
      ? setIsRefreshing(true)
      : offset === 0
      ? setLoading(true)
      : setLoadingMore(true);

    try {
      const fetchedProducts = await fetchUserProductsDocument(
        user.$id,
        null,
        reset ? 0 : offset,
        2 // Fetch 2 products per page
      );

      if (reset) {
        setProducts(fetchedProducts);
        setOffset(fetchedProducts.length);
        setHasMore(true);
      } else {
        if (fetchedProducts.length > 0) {
          setProducts((prev) => [...prev, ...fetchedProducts]);
          setOffset((prev) => prev + fetchedProducts.length);
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error syncing products:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    syncProducts();
  }, [user?.$id]);

  const refreshProducts = () => syncProducts({ reset: true });

  const handleEndReached = () => {
    if (hasMore && !loadingMore && !loading) {
      syncProducts();
    }
  };

  const deleteProduct = async (
    productId: string,
    mainPhotoUrl: string,
    descriptionPhotoUrls: string[] = []
  ) => {
    try {
      await deleteDocument(appwriteConfig.productsCollectionId, productId);

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.$id !== productId)
      );

      if (mainPhotoUrl) {
        const mainPhotoKey = extractKeyFromUrl(mainPhotoUrl);
        await deleteImageFromCloud(mainPhotoKey);
      }

      if (descriptionPhotoUrls.length > 0) {
        const descriptionPhotoKeys =
          descriptionPhotoUrls.map(extractKeyFromUrl);
        await deleteMultipleImagesFromCloud(descriptionPhotoKeys);
      }

      console.log("Product and associated images deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error(t.errorDeleting);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => {
    let productDetails: ProductDetails = {} as ProductDetails;

    try {
      productDetails = item.Details;
    } catch (error) {
      console.error("Error parsing product details:", error);
    }

    const timeAgo = calculateTimeAgo(item.$createdAt, language);
    const city = GetCityName(
      productDetails?.selectedCity || "Unknown City",
      language
    );

    return (
      <View className="mb-5 bg-white mx-4">
        <UserTop
          timeAgo={timeAgo}
          city={city}
          productDetails={productDetails}
          item={item}
          onDelete={() =>
            deleteProduct(
              item.$id,
              productDetails.mainPhoto,
              productDetails.descriptionPhotos || []
            )
          }
        />
        <CardPP productDetails={productDetails} item={item} />
      </View>
    );
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "slategray",
        }}
      >
        <Text style={{ color: "white" }}>{t.loading}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      <FlatList
        data={products}
        showsVerticalScrollIndicator={false}
        ListHeaderComponentStyle={{ paddingHorizontal: 20, paddingTop: 7 }}
        ListHeaderComponent={() => (
          <NavTop logo title={t.headerTitle} containerS={"w-14 h-14"} />
        )}
        keyExtractor={(item, index) => `${item.$id}-${index}`}
        renderItem={renderProduct}
        ListEmptyComponent={() => <NotfoundPage text={t.noProducts} />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.7}
        ListFooterComponent={() =>
          loadingMore ? (
            <ActivityIndicator size="large" color="#FF6E4E" />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshProducts}
          />
        }
      />
    </SafeAreaView>
  );
};

export default Products;

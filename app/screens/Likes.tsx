import { View, FlatList, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "@/store/userStore";
import { appwriteConfig, databases } from "@/lib/config";
import { Query } from "react-native-appwrite";
import calculateTimeAgo from "@/components/Product/calculateTimeAgo";
import GetCityName from "@/components/Product/GetArabicCityName";
import TopLikes from "@/components/Likes/TopLikes";
import CardPP from "@/components/Product/CardPP";
import { Product } from "@/types/appwriteTypes";
import NotfoundPage from "@/components/ui/NotfoundPage";
import NavTop from "@/components/Product/NavTop";

const Likes = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, language } = useUserStore();

  const translations = {
    ar: {
      title: "اعجبني",
      noLikes: "ليس لديك اعجابات",
      unknownCity: "مدينة غير معروفة",
    },
    en: {
      title: "Liked Items",
      noLikes: "You have no likes",
      unknownCity: "Unknown City",
    },
    fr: {
      title: "Articles aimés",
      noLikes: "Vous n'avez pas de likes",
      unknownCity: "Ville inconnue",
    },
  };

  const t = translations[language] || translations.en;

  // Fetch liked products by the user
  const fetchLikedProducts = async () => {
    try {
      if (!user?.$id) return;

      const likedResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.likesCollectionId,
        [Query.equal("userId", user.$id)]
      );

      const likedProducts = likedResponse.documents;

      if (!likedProducts.length) {
        setProducts([]);
        return;
      }

      const productDetails = await Promise.all(
        likedProducts.map(async (like) => {
          try {
            const productResponse = await databases.getDocument(
              appwriteConfig.databaseId,
              appwriteConfig.productsCollectionId,
              like.productId
            );
            return { ...productResponse, likedAt: like.$createdAt };
          } catch (error) {
            console.error("Error fetching product details:", error);
            return null;
          }
        })
      );

      setProducts(productDetails.filter((product) => product) as any);
    } catch (error) {
      console.error("Error fetching liked products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedProducts();
  }, []);

  const parseProductDetails = (item: Product) => {
    try {
      if (
        item?.Details &&
        Array.isArray(item.Details) &&
        item.Details.length > 0
      ) {
        return JSON.parse(item.Details[0]);
      }
    } catch (error) {
      console.error("Error parsing product details:", error);
    }
    return {};
  };

  const renderProduct = ({ item }: { item: Product }) => {
    if (!item || !item.$id) return null;

    const productDetails = parseProductDetails(item);
    const timeAgo = calculateTimeAgo(item?.$createdAt);
    const city = GetCityName(productDetails?.selectedCity || t.unknownCity);

    return (
      <View className="mb-5 bg-white mx-4 w-11/12" key={item.$id}>
        <TopLikes
          timeAgo={timeAgo}
          city={city}
          item={item}
          userId={user?.$id as string}
        />
        <CardPP productDetails={productDetails} item={item} />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-bgcolor">
      <View style={{ paddingHorizontal: 20, paddingTop: 7 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#FF6E4E" />
        ) : (
          <FlatList
            data={products}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => <NavTop title={t.title} />}
            keyExtractor={(item) => item.$id}
            renderItem={renderProduct}
            ListEmptyComponent={() => <NotfoundPage text={t.noLikes} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Likes;

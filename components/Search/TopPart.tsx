import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TextInput, TouchableOpacity, View, Text } from "react-native";

const TopPart = ({
  query,
  handleSearch,
  placeholder,
  title,
}: {
  query: string;
  handleSearch: (input: string) => void;
  placeholder: string;
  title: string;
}) => {
  return (
    <View className="flex-row items-center justify-between p-4 bg-primary">
      <TouchableOpacity
        onPress={() => router.back()}
        className="justify-center items-center px-3"
      >
        <Text className="text-white font-bold text-lg">{title}</Text>
      </TouchableOpacity>

      <TextInput
        className="flex-1 mx-3 bg-white border-0 p-2 rounded-full"
        placeholder={placeholder}
        value={query}
        onChangeText={handleSearch}
      />
      <StatusBar style="light" backgroundColor="#FF6E4E" />
    </View>
  );
};

export default TopPart;

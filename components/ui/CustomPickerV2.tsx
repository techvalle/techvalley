import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  useWindowDimensions,
} from "react-native";
import { Entypo } from "@expo/vector-icons";

type PickerItem = {
  value: string | number;
  label: { ar: string; en: string; fr: string };
};

type CustomPickerV2Props = {
  label?: string;
  items: PickerItem[];
  value: string | null;
  placeholder?: string;
  onValueChange: (value: string | null) => void;
  containerStyle?: object;
  language: "en" | "ar" | "fr";
};

const translations = {
  en: { select: "Select" },
  ar: { select: "اختار" },
  fr: { select: "Sélectionner" },
};

const CustomPickerV2: React.FC<CustomPickerV2Props> = ({
  label,
  items = [],
  value,
  placeholder,
  onValueChange,
  containerStyle = {},
  language,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Find the currently selected item
  const selectedItem = items.find((item) => item.value === value);
  const selectedLabel =
    selectedItem?.label[language] ||
    placeholder ||
    translations[language]?.select ||
    "Select";

  const { width } = useWindowDimensions();
  const textAlignment = language === "ar" ? "text-right" : "text-left";

  return (
    <View style={containerStyle} className="my-2">
      {label && (
        <Text
          className={`text-base text-primary font-sans-arabic-medium mb-1 ${textAlignment}`}
        >
          {label}
        </Text>
      )}
      <TouchableOpacity
        className="h-10 bg-white rounded border-[#eeecec] border-[1px] flex-row items-center justify-between px-3"
        onPress={() => setIsModalVisible(true)}
      >
        <Text className="text-base text-gray-700">{selectedLabel}</Text>
        <Entypo name="chevron-thin-down" size={19} color="black" />
      </TouchableOpacity>
      <Modal
        transparent
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View
            style={{ width: width * 0.8 }}
            className="bg-white rounded p-4 max-h-[60%]"
          >
            {items.length > 0 ? (
              <FlatList
                data={items}
                keyExtractor={(item) => item.value.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="py-3 border-b border-gray-200"
                    onPress={() => {
                      onValueChange(item.value as any);
                      setIsModalVisible(false);
                    }}
                  >
                    <Text className={`text-base ${textAlignment}`}>
                      {item.label[language]}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text className="text-center text-gray-500">
                {translations[language]?.select}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomPickerV2;

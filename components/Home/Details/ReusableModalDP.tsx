import { icons } from "@/constants";
import { useUserStore } from "@/store/userStore";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";

interface Action {
  key: string;
  onPress: () => Promise<void>;
  label: { ar: string; en: string; fr: string };
}

interface ReusableModalDPProps {
  isVisible: boolean;
  onClose: () => void;
  actions: Action[];
  currentUserId: string | null;
  productOwnerId: string | null;
  messageOwnerId: string | null;
  language: "ar" | "en" | "fr";
}

const ReusableModalDP: React.FC<ReusableModalDPProps> = ({
  isVisible,
  onClose,
  actions,
  currentUserId,
  productOwnerId,
  messageOwnerId,
}) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null); // Track loading state for each action

  const { language } = useUserStore();

  // Filter actions based on conditions
  const filteredActions = actions.filter((action) => {
    if (action.key === "BanUser") {
      return (
        currentUserId === productOwnerId && currentUserId !== messageOwnerId
      ); // Only include "Ban User" if you're the product owner but not the message owner
    }
    if (action.key === "Delete") {
      return currentUserId === messageOwnerId; // Only show "Delete" for message owners
    }
    if (action.key === "Report") {
      return currentUserId !== messageOwnerId; // Can't report yourself
    }
    return true; // Show all other actions
  });

  const handleActionPress = async (action: Action) => {
    if (action.onPress) {
      try {
        setLoadingAction(action.key); // Set loading for the current action
        await action.onPress(); // Execute the action
      } finally {
        setLoadingAction(null); // Clear loading state
      }
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View className="bg-white rounded-lg p-6 py-8 relative">
        {/* Close button */}
        <TouchableOpacity className="absolute top-3 right-3" onPress={onClose}>
          <Image
            className="w-3 h-3"
            source={icons.close}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Render filtered actions */}
        {filteredActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            className={`py-3 px-6 flex flex-row ${
              language === "ar" && "flex-row-reverse"
            } justify-between items-center ${
              action.key === "Delete"
                ? "bg-white"
                : action.key === "Report"
                ? ""
                : action.key === "BanUser"
                ? "border-y-[1px] border-y-green-500 border-gray-100"
                : ""
            }`}
            onPress={() => handleActionPress(action)}
            disabled={loadingAction === action.key} // Disable while loading
          >
            {/* Loading indicator or label */}
            {loadingAction === action.key ? (
              <ActivityIndicator size="small" color="#FF5C39" />
            ) : (
              <Text
                className={`text-center text-base font-semibold ${
                  action.key === "Report" ? "text-red-500" : "text-red-500"
                } ${language === "ar" && "text-right"} text-black`}
              >
                {action.label[language]}
              </Text>
            )}

            {/* Icon */}
            {action.key === "Report" && (
              <Image
                className="w-6 h-6"
                source={icons.banUser}
                resizeMode="contain"
              />
            )}
            {action.key === "BanUser" && (
              <Image
                className="w-6 h-6"
                source={icons.report}
                resizeMode="contain"
              />
            )}
            {action.key === "Delete" && (
              <Image
                className="w-6 h-6"
                source={icons.bin}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
};

export default ReusableModalDP;

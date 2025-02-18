import React, { useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { icons } from "../../constants";

// Translation structure
const translations = {
  en: {
    placeholder: "Select your birthday",
  },
  ar: {
    placeholder: "اختر تاريخ ميلادك",
  },
  fr: {
    placeholder: "Sélectionnez votre anniversaire",
  },
} as any;

const BirthdayPicker = ({
  onDateChange,
  birthDay,
  language = "en", // Default language is English
}) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);

    // Pass the selected date to the parent component
    onDateChange(currentDate);
  };

  const placeholderText =
    birthDay ||
    translations[language]?.placeholder ||
    translations.en.placeholder;

  return (
    <Pressable
      onPress={() => setShow(true)}
      className="flex border border-[#D8D6D6] rounded-full flex-row  px-3 mb-4 w-full  h-11 justify-center items-center"
    >
      <Text className="text-right w-[95%] m-auto ">{placeholderText}</Text>
      <Image
        source={icons.dateIn}
        className="w-4 h-4 ml-2"
        resizeMode="contain"
      />
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          maximumDate={new Date()}
          onChange={onChange}
        />
      )}
    </Pressable>
  );
};

export default BirthdayPicker;

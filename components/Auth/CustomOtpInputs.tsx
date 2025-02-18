import React, { useRef, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";

interface CustomOtpInputProps {
  numberOfInputs?: number;
  onChangeOtp: (otp: string) => void;
}

const CustomOtpInputs: React.FC<CustomOtpInputProps> = ({
  numberOfInputs = 4,
  onChangeOtp,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(numberOfInputs).fill(""));
  const inputsRef = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = text;

    setOtp(updatedOtp);
    onChangeOtp(updatedOtp.join(""));

    // Move focus to the next input
    if (text && index < numberOfInputs - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (text: string, index: number) => {
    if (!text && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    handleChange(text, index);
  };

  return (
    <View style={styles.otpContainer}>
      {otp.map((_, index) => (
        <TextInput
          key={index}
          ref={(input) => (inputsRef.current[index] = input as TextInput)}
          value={otp[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={({ nativeEvent }) =>
            nativeEvent.key === "Backspace" && handleBackspace("", index)
          }
          maxLength={1}
          keyboardType="number-pad"
          style={styles.inputBox}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  inputBox: {
    width: 40,
    height: 45,
    marginHorizontal: 8,
    fontSize: 20,
    textAlign: "center",
    borderBottomWidth: 2,
    borderColor: "#000",
    backgroundColor: "#fff",
    color: "#000",
    fontWeight: "bold",
  },
});

export default CustomOtpInputs;

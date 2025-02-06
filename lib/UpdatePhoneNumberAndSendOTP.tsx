import { Alert } from "react-native";

interface Form {
  phone: string;
}

// Function to update phone number and send OTP
export const UpdatePhoneNumberAndSendOTP = async (
  form: Form
): Promise<void> => {
  const API_URL = "https://api.authentica.sa/api/sdk/v1/sendOTP";
  const AUTH_KEY =
    "$2y$10$c57cHaWGuddWl/V/9MzDGOoguNMw.FR5A5cVi7kzysgWGGgPQgXv2";

  try {
    if (!form?.phone) {
      throw new Error("Phone number is required.");
    }

    const body = {
      phone: `+966${form.phone}`,
      method: "sms",
      template_id: "20",
      otp_format: "numeric",
      number_of_digits: "4",
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Authorization": AUTH_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to send OTP:", data);
      throw new Error(data.message || "Failed to send OTP.");
    }

    console.log("OTP sent successfully:", data);
  } catch (error: any) {
    console.error("Error sending OTP:", error.message);
    Alert.alert(
      "Error",
      `Failed to update phone number or send OTP: ${error.message}`
    );
  }
};

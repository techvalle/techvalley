import { chadCities } from "@/constants";

/**
 * Function to get the city name based on the value and locale.
 * @param {string} cityValue - The city value (e.g., "abéché", "n_djamena").
 * @param {string} locale - The locale (e.g., "ar", "en", "fr").
 * @returns {string} - The corresponding city name in the specified locale.
 */
const GetCityName = (
  cityValue: string,
  locale: "ar" | "en" | "fr" = "en"
): string => {
  const city = chadCities.find((c) => c.value === cityValue);

  if (!city || !city.label[locale]) {
    switch (locale) {
      case "ar":
        return "مدينة غير معروفة"; // Unknown city in Arabic
      case "fr":
        return "Ville inconnue"; // Unknown city in French
      default:
        return "Unknown City"; // Unknown city in English
    }
  }

  return city.label[locale];
};

export default GetCityName;

import { formatDistanceToNow, parseISO, isValid } from "date-fns";
import { ar, enUS, fr } from "date-fns/locale";

type Locale = "ar" | "en" | "fr";

/**
 * Calculate how long ago a product was created, in the specified locale.
 * @param createdAt - ISO 8601 date string of the product's creation time.
 * @param locale - The locale to use for formatting (default is "en").
 * @returns A string representing the time ago in the specified locale.
 */
const calculateTimeAgo = (
  createdAt?: string,
  locale: Locale = "en"
): string => {
  if (!createdAt) {
    switch (locale) {
      case "ar":
        return "الوقت غير معروف";
      case "fr":
        return "Temps inconnu";
      default:
        return "Time unknown";
    }
  }

  try {
    const date = parseISO(createdAt); // Parse the ISO 8601 date string
    if (!isValid(date)) throw new Error("Invalid date"); // Check if the parsed date is valid

    // Select the appropriate locale
    const localeMap = { ar, en: enUS, fr };
    const selectedLocale = localeMap[locale];

    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: selectedLocale,
    }); // Format the time difference
  } catch (error) {
    console.error("Error parsing date:", error);
    switch (locale) {
      case "ar":
        return "تاريخ غير صالح";
      case "fr":
        return "Date invalide";
      default:
        return "Invalid date";
    }
  }
};

export default calculateTimeAgo;

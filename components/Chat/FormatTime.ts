type Lang = "ar" | "en" | "fr";

export default function FormatTime(
  timestamp: string,
  lang: Lang = "en"
): string {
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const isPM = hours >= 12;

  // Convert to 12-hour format
  hours = hours % 12 || 12; // If hours is 0, convert to 12 (for midnight/noon)

  // Translations for AM/PM
  const translations: Record<Lang, { am: string; pm: string }> = {
    en: { am: "am", pm: "pm" },
    ar: { am: "ص", pm: "م" },
    fr: { am: "am", pm: "pm" },
  };

  const amPm = isPM ? translations[lang].pm : translations[lang].am;

  // Format the time with am/pm prefix and leading zero for minutes
  const formattedTime = `${hours}:${
    minutes < 10 ? "0" + minutes : minutes
  } ${amPm}`;

  return formattedTime;
}

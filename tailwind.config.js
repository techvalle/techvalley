/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        primary: "#FF6E4E",
        secondary: "#FFFFFF",
        textLight: "#707070",
        textDark: "#000000",
        textDark2: "#010035",
        bgcolor: "#FAFAFA",
      },
      fontFamily: {
        "sans-arabic-bold": ["SansArabic-Bold", "sans-serif"],
        "sans-arabic-extralight": ["SansArabic-ExtraLight", "sans-serif"],
        "sans-arabic-light": ["SansArabic-Light", "sans-serif"],
        "sans-arabic-medium": ["SansArabic-Medium", "sans-serif"],
        "sans-arabic-regular": ["SansArabic-Regular", "sans-serif"],
        "sans-arabic-semibold": ["SansArabic-SemiBold", "sans-serif"],
        "sans-arabic-thin": ["SansArabic-Thin", "sans-serif"],
        "Somar-Bold": ["Somar-Bold", "sans-serif"],
      },
      boxShadow: {
        light: "0 2px 4px rgba(0, 0, 0, 0.05)", // Custom light shadow
        wideLight: "0 4px 12px rgba(0, 0, 0, 0.05)", // Wide and soft shadow
        strong: "0 6px 15px rgba(0, 0, 0, 0.1)", // Stronger shadow for emphasis
      },
    },
  },
  plugins: [],
};

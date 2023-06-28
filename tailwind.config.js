/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "pastel",
      "retro",
      "winter",
      "forest",
      "corporate",
      "business",
      "dracula",
      "lemonade",
      "garden",
    ],
  },
};

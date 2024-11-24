/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", // Include files in the "app" directory
    "./components/**/*.{js,jsx,ts,tsx}" // Include files in the "components" directory
  ],
  presets: [require("nativewind/preset")], // Include the NativeWind preset
  theme: {
    extend: {}, // Extend Tailwind's default theme if needed
  },
  plugins: [], // Add any TailwindCSS plugins if required
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Enable dark mode support
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
  // Only enable core plugins we actually use
  // Post processing config
  corePlugins: {
    // Disable unused core plugins to optimize build size
    preflight: true, // keep base style reset
  },
  // Post processing - custom utilities
  variants: {
    extend: {
      // Enable dark mode variants for specific utilities
      backgroundColor: ['dark'],
      textColor: ['dark'],
      borderColor: ['dark'],
    },
  },
};

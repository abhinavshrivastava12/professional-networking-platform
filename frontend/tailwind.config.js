module.exports = {
  content: ["./src/**/*.{js,jsx}"],

  darkMode: 'class', // Enables dark mode via a class on <html>

  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        fadeInSlow: "fadeIn 1s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },

  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        khmer: ['"Khmer OS Battambang"', "sans-serif"], // custom font class
      },
    },
  },
  plugins: [],
};
// This configuration file sets up Tailwind CSS for a project, extending the default theme with a custom font family for Khmer text.

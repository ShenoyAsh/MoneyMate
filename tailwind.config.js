/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
        // Map 'border' to use your custom CSS variable
        border: "hsl(var(--border))",
        // ... all your other colors like background, foreground, etc.
      },
      // ... other theme extensions
    },
  plugins: [],
};

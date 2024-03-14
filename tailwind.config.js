/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'),
  ],
  // purge: ["./index.html", "./src/**/*.{svelte,js,ts,jsx,tsx}"], // For unused CSS
  variants: {
    extend: {},
  },
  darkMode: 'class', // or 'media' or 'class'
}
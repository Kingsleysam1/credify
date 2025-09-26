/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        zentry: ["Zentry", "sans-serif"],
        general: ["General Sans", "sans-serif"],
        'circular-web' : ["Circular-web", "sans-serif"],
        'robert-medium' : ["Robert-medium", "sans-serif"],
        'robert-regular' : ["Robert-regular", "sans-serif"],

      }
      colors : {
        blue: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
        },
        yellow: {
        300: '#EDFF66',
        400: '#fbbf24',  
       },
       violet: {
        300: '#270B3B',
        400: '#1E0A2D',
        500: '#1B0A2D',

       }

      }
    },
  },
  plugins: [],
};

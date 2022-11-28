const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontSize: {
				"8xl": ["6rem", { lineHeight: "1" }],
			},
			fontFamily: {
				sans: ["var(--font-inter)", ...fontFamily.sans],
			},
			colors: {
				upstash: {
					100: "#CBFDDA",
					200: "#97FCC0",
					300: "#63F8AE",
					400: "#3CF1A9",
					500: "#00E9A3",
					600: "#00C89F",
					700: "#00A796",
					800: "#008786",
					900: "#00656F",
				},
			},
		},
	},
	plugins: [],
};

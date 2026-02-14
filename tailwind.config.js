/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				slideUp: {
					"0%": {
						opacity: "0",
						transform: "translate(-50%, 100%)",
					},
					"100%": {
						opacity: "1",
						transform: "translate(-50%, 0)",
					},
				},
			},
			animation: {
				fadeIn: "fadeIn 0.3s ease-in",
				slideUp: "slideUp 0.3s ease-out",
			},
		},
	},
	plugins: [],
};

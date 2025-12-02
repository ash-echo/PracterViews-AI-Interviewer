/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#09090b",
                foreground: "#ffffff",
                card: "#18181b",
                "card-foreground": "#ffffff",
                primary: "#8b5cf6", // Violet/Purple from design
                "primary-foreground": "#ffffff",
                secondary: "#27272a",
                "secondary-foreground": "#ffffff",
                muted: "#71717a",
                accent: "#a78bfa",
            }
        },
    },
    plugins: [],
}

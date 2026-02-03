import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                redstone: {
                    bg: '#08252b',     // Deep Slate/Charcoal
                    card: '#2e4a51',   // Lighter Slate
                    red: '#ba0024',    // Deep Muted Red
                    text: '#f3f4f6',   // Grey/White
                },
            },
            fontFamily: {
                sans: ['PP Mori', 'Inter', 'sans-serif'], // Fallback included
            },
            borderRadius: {
                DEFAULT: '0px',
                xs: '0px',
                sm: '0px',
                md: '0px',
                lg: '0px',
                xl: '0px',
                '2xl': '0px',
                '3xl': '0px',
                full: '9999px',
            },
        },
    },
    plugins: [],
};
export default config;

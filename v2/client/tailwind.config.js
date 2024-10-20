// /** @type {import('tailwindcss').Config} */
// module.exports = {
//     darkMode: ['class'],
//     content: [
//         './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
//         './src/components/**/*.{js,ts,jsx,tsx,mdx}',
//         './src/app/**/*.{js,ts,jsx,tsx,mdx}',
//         './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
//     ],
//     theme: {
//         extend: {
//             colors: {
//                 black: '#0a0a0a',
//                 'bidder-primary': '#ff4500',
//                 'bidder-secondary': '#A39D9D',
//                 primary: {
//                     DEFAULT: 'hsl(var(--primary))',
//                     foreground: 'hsl(var(--primary-foreground))',
//                 },
//                 background: 'hsl(var(--background))',
//                 foreground: 'hsl(var(--foreground))',
//                 card: {
//                     DEFAULT: 'hsl(var(--card))',
//                     foreground: 'hsl(var(--card-foreground))',
//                 },
//                 popover: {
//                     DEFAULT: 'hsl(var(--popover))',
//                     foreground: 'hsl(var(--popover-foreground))',
//                 },
//                 secondary: {
//                     DEFAULT: 'hsl(var(--secondary))',
//                     foreground: 'hsl(var(--secondary-foreground))',
//                 },
//                 muted: {
//                     DEFAULT: 'hsl(var(--muted))',
//                     foreground: 'hsl(var(--muted-foreground))',
//                 },
//                 accent: {
//                     DEFAULT: 'hsl(var(--accent))',
//                     foreground: 'hsl(var(--accent-foreground))',
//                 },
//                 destructive: {
//                     DEFAULT: 'hsl(var(--destructive))',
//                     foreground: 'hsl(var(--destructive-foreground))',
//                 },
//                 border: 'hsl(var(--border))',
//                 input: 'hsl(var(--input))',
//                 ring: 'hsl(var(--ring))',
//                 chart: {
//                     1: 'hsl(var(--chart-1))',
//                     2: 'hsl(var(--chart-2))',
//                     3: 'hsl(var(--chart-3))',
//                     4: 'hsl(var(--chart-4))',
//                     5: 'hsl(var(--chart-5))',
//                 },
//             },
//             borderRadius: {
//                 lg: 'var(--radius)',
//                 md: 'calc(var(--radius) - 2px)',
//                 sm: 'calc(var(--radius) - 4px)',
//             },
//             keyframes: {
//                 ripple: {
//                     '0%': { transform: 'scale(0.9)', opacity: 0.7 },
//                     '100%': { transform: 'scale(1)', opacity: 1 },
//                 },
//             },
//             animation: {
//                 ripple: 'ripple 0.4s ease-in-out',
//             },
//         },
//     },
//     plugins: [require('tailwindcss-animate'), nextui()],
// }
/** @type {import('tailwindcss').Config} */
const { nextui } = require('@nextui-org/react') // Ensure you have this import at the top

module.exports = {
    darkMode: ['class'],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                black: '#0a0a0a',
                'bidder-primary': '#ff4500',
                'bidder-secondary': '#A39D9D',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    1: 'hsl(var(--chart-1))',
                    2: 'hsl(var(--chart-2))',
                    3: 'hsl(var(--chart-3))',
                    4: 'hsl(var(--chart-4))',
                    5: 'hsl(var(--chart-5))',
                },
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                ripple: {
                    '0%': { transform: 'scale(0.9)', opacity: 0.7 },
                    '100%': { transform: 'scale(1)', opacity: 1 },
                },
            },
            animation: {
                ripple: 'ripple 0.4s ease-in-out',
            },
        },
    },
    plugins: [
        nextui(), // Make sure nextui is imported and used correctly
        require('tailwindcss-animate'),
    ],
}

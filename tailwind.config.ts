import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class", // Changed to class to match ThemeProvider logic using classList
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                current: "currentColor",
                transparent: "transparent",
                white: "#FFFFFF",
                black: "#1C2434",
                "black-2": "#010101",
                body: "#64748B",
                bodydark: "#AEB7C0",
                bodydark1: "#DEE4EE",
                bodydark2: "#8A99AF",
                primary: "#3C50E0",
                secondary: "#80CAEE",
                stroke: "#E2E8F0",
                gray: {
                    2: "#F7F9FC",
                    3: "#FAFAFA",
                },
                whiten: "#F1F5F9",
                whiter: "#F5F7FD",
                boxdark: "#24303F",
                "boxdark-2": "#1A222C",
                strokedark: "#2E3A47",
                "form-strokedark": "#3d4d60",
                "form-input": "#1d2a39",
                meta: {
                    1: "#DC3545",
                    2: "#EFF2F7",
                    3: "#10B981",
                    4: "#313D4A",
                    5: "#259AE6",
                    6: "#FFBA00",
                    7: "#FF6766",
                    8: "#F0950C",
                    9: "#E5E7EB",
                    10: "#0FADCF"
                },
                success: "#219653",
                danger: "#D34053",
                warning: "#FFA70B",
            },
            zIndex: {
                '999': '999',
            },
        },
    },
    plugins: [],
};

export default config;

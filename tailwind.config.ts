import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#f4faff",
        "surface-dim": "#d4dbe0",
        "surface-bright": "#f4faff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eef5fa",
        "surface-container": "#e8eff4",
        "surface-container-high": "#e2e9ee",
        "surface-container-highest": "#dce3e8",
        "on-surface": "#161d20",
        "on-surface-variant": "#3c4947",
        "inverse-surface": "#2a3135",
        "inverse-on-surface": "#ebf2f7",
        outline: "#6c7a77",
        "outline-variant": "#bbcac6",
        "surface-tint": "#006a60",
        primary: "#006a60",
        "on-primary": "#ffffff",
        "primary-container": "#12b5a5",
        "on-primary-container": "#00403a",
        "inverse-primary": "#52dbca",
        secondary: "#4b607a",
        "on-secondary": "#ffffff",
        "secondary-container": "#c9dffd",
        "on-secondary-container": "#4e627c",
        tertiary: "#895100",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#df902e",
        "on-tertiary-container": "#533000",
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        "primary-fixed": "#72f8e6",
        "primary-fixed-dim": "#52dbca",
        "on-primary-fixed": "#00201c",
        "on-primary-fixed-variant": "#005048",
        background: "#f4faff",
        "on-background": "#161d20",
        "surface-variant": "#dce3e8",
        "ink-text": "#1B2A3A",
        "muted-text": "#5C6B7A",
        "border-hairline": "#E3E9EF",
        "ai-marker": "#12B5A5",
        "surface-navy": "#0B2239"
      },
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem"
      },
      spacing: {
        "sidebar-width": "260px",
        "topbar-height": "64px",
        gutter: "1rem",
        "margin-page": "2rem"
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"]
      },
      fontSize: {
        "display-lg": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "title-sm": ["18px", { lineHeight: "24px", fontWeight: "500" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-sm": ["13px", { lineHeight: "18px", fontWeight: "400" }],
        "data-mono": ["13px", { lineHeight: "16px", fontWeight: "500" }],
        "label-caps": ["11px", { lineHeight: "16px", fontWeight: "700" }]
      }
    }
  },
  plugins: []
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#fffaf0",
        "surface-soft": "#faf5e8",
        "surface-card": "#f5f0e0",
        "surface-strong": "#ebe6d6",
        "surface-dark": "#0a1a1a",
        ink: "#0a0a0a",
        "body-strong": "#1a1a1a",
        body: "#3a3a3a",
        muted: "#6a6a6a",
        "muted-soft": "#9a9a9a",
        hairline: "#e5e5e5",
        primary: "#0a0a0a",
        "brand-teal": "#1a3a3a",
        "brand-pink": "#ff4d8b",
        "brand-lavender": "#b8a4ed",
        "brand-peach": "#ffb084",
        "brand-ochre": "#e8b94a",
        "brand-mint": "#a4d4c5",
        "brand-coral": "#ff6b5a",
        success: "#22c55e",
        warning: "#f59e0b",
        error: "#ef4444",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["72px", { lineHeight: "1.0", letterSpacing: "-0.05em", fontWeight: "500" }],
        "display-lg": ["56px", { lineHeight: "1.05", letterSpacing: "-0.04em", fontWeight: "500" }],
        "display-md": ["40px", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "500" }],
        "display-sm": ["32px", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "500" }],
        "title-lg": ["24px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        "title-md": ["18px", { lineHeight: "1.4", letterSpacing: "0", fontWeight: "600" }],
        "title-sm": ["16px", { lineHeight: "1.4", letterSpacing: "0", fontWeight: "600" }],
      },
      borderRadius: {
        xs: "6px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        pill: "9999px",
        full: "9999px",
      },
      spacing: {
        section: "96px",
        18: "72px",
        13: "52px",
      },
      boxShadow: {
        subtle: "0 2px 8px rgba(0,0,0,0.06)",
        card: "0 0 0 1px #e5e5e5",
        "3d-a": "8px 8px 0 0 rgba(0,0,0,0.08)",
        "3d-b": "4px 4px 0 0 rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};

export default config;

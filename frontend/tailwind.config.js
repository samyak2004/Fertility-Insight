/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#071521",
        marine: "#0e2236",
        mist: "#d8edf7",
        ice: "#eef8ff",
        glow: "#7dd3fc",
        aqua: "#38bdf8",
        teal: "#2dd4bf",
        coral: "#f97360",
        leaf: "#34d399",
        sand: "#f7d794",
      },
      boxShadow: {
        panel: "0 32px 90px rgba(4, 14, 27, 0.34)",
        float: "0 18px 45px rgba(56, 189, 248, 0.16)",
      },
      fontFamily: {
        display: ["Aptos Display", "Segoe UI", "Trebuchet MS", "sans-serif"],
        sans: ["Aptos", "Segoe UI", "Trebuchet MS", "sans-serif"],
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at 12% 18%, rgba(125, 211, 252, 0.24), transparent 28%), radial-gradient(circle at 82% 16%, rgba(45, 212, 191, 0.18), transparent 24%), radial-gradient(circle at 78% 82%, rgba(247, 215, 148, 0.14), transparent 20%), linear-gradient(135deg, #071521 0%, #0d2135 48%, #12314c 100%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        rise: "rise 0.8s ease-out both",
        drift: "drift 14s ease-in-out infinite",
        "pulse-slow": "pulseSlow 3.4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        rise: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0px)" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0px, 0px, 0px)" },
          "50%": { transform: "translate3d(0px, -18px, 0px)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.72" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

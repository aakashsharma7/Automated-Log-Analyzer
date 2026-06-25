/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        'display': ['Space Grotesk', 'var(--font-outfit)', 'sans-serif'],
        'outfit': ['var(--font-outfit)', 'sans-serif'],
        'poppins': ['var(--font-poppins)', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Bauhaus Terminal Palette */
        'term': {
          'void':    '#080808',
          'bg':      '#0E0E0E',
          'surface': '#141414',
          'raised':  '#1C1C1C',
          'overlay': '#242424',
          'border':  '#2C2C2C',
          'dim':     '#3A3A3A',
        },
        'bauhaus': {
          'yellow':  '#39FF14',
          'amber':   '#FF8C00',
          'green':   '#39FF14',
          'teal':    '#00FF9C',
          'red':     '#FF3131',
          'rose':    '#FF006E',
          'blue':    '#0057FF',
          'cyan':    '#00C6FF',
          'white':   '#E8E4D0',
          'cream':   '#D4C9A8',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "fade-in-up": {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: 0, transform: "translateX(20px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        "slide-in-left": {
          from: { opacity: 0, transform: "translateX(-20px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: 0, transform: "scale(0.97)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
        "scale-in-bounce": {
          "0%": { opacity: 0, transform: "scale(0.3)" },
          "50%": { opacity: 1, transform: "scale(1.03)" },
          "70%": { transform: "scale(0.97)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        "cursor-blink": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
        "scanline": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "terminal-type": {
          from: { width: "0", opacity: 0 },
          to: { width: "100%", opacity: 1 },
        },
        "bauhaus-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "pulse-yellow": {
          "0%, 100%": { boxShadow: "0 0 4px rgba(57, 255, 20, 0.4)" },
          "50%": { boxShadow: "0 0 16px rgba(57, 255, 20, 0.8), 0 0 32px rgba(57, 255, 20, 0.3)" },
        },
        "pulse-green": {
          "0%, 100%": { boxShadow: "0 0 4px rgba(57, 255, 20, 0.4)" },
          "50%": { boxShadow: "0 0 16px rgba(57, 255, 20, 0.8), 0 0 32px rgba(57, 255, 20, 0.2)" },
        },
        "pulse-red": {
          "0%, 100%": { boxShadow: "0 0 4px rgba(255, 49, 49, 0.4)" },
          "50%": { boxShadow: "0 0 16px rgba(255, 49, 49, 0.8), 0 0 32px rgba(255, 49, 49, 0.2)" },
        },
        "wiggle": {
          "0%, 7%": { transform: "rotateZ(0)" },
          "15%": { transform: "rotateZ(-15deg)" },
          "20%": { transform: "rotateZ(10deg)" },
          "25%": { transform: "rotateZ(-10deg)" },
          "30%": { transform: "rotateZ(6deg)" },
          "35%": { transform: "rotateZ(-4deg)" },
          "40%, 100%": { transform: "rotateZ(0)" },
        },
        "slide-up": {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-right": "slide-in-right 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-left": "slide-in-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in": "scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in-bounce": "scale-in-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "cursor-blink": "cursor-blink 1s step-end infinite",
        "scanline": "scanline 8s linear infinite",
        "terminal-type": "terminal-type 0.6s steps(30) forwards",
        "bauhaus-spin": "bauhaus-spin 20s linear infinite",
        "gradient-shift": "gradient-shift 4s ease infinite",
        "pulse-yellow": "pulse-yellow 2s ease-in-out infinite",
        "pulse-green": "pulse-green 2s ease-in-out infinite",
        "pulse-red": "pulse-red 2s ease-in-out infinite",
        "wiggle": "wiggle 0.5s ease-in-out",
        "slide-up": "slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

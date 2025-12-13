import type {Config} from 'tailwindcss';

const svgToDataUri = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

const foodPatternSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <defs>
    <style>
      .icon {
        stroke: hsl(var(--border));
        stroke-width: 1;
        fill: none;
        opacity: 0.5;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    </style>
  </defs>
  <!-- Wine Bottle at (15, 15) -->
  <path d="M40 10 C40 5, 35 5, 35 10 L35 20 L45 20 L45 10 C45 5, 40 5, 40 10 M35 20 L45 20 M30 22 L50 22 L50 40 C50 45, 30 45, 30 40 Z" class="icon" transform="translate(-20, -5) scale(0.6)"/>
  <!-- Cheese at (80, 20) -->
  <path d="M70 20 L90 20 L70 40 Z M70 25 L85 25 M70 30 L80 30 M70 35 L75 35" class="icon" transform="scale(0.8)"/>
  <!-- Fish at (20, 70) -->
  <path d="M10 70 Q 25 60, 40 70 Q 25 80, 10 70 M38 70 L45 65 M38 70 L45 75 M15 70 A 1 1 0 0 1 15 70.1" class="icon" transform="scale(0.9) translate(5,0)"/>
  <!-- Grapes at (75, 75) -->
  <path d="M80 65 L82 62 M85 70 A 5 5 0 0 1 75 70 A 5 5 0 0 1 85 70 M80 75 A 5 5 0 0 1 70 75 A 5 5 0 0 1 80 75 M90 75 A 5 5 0 0 1 80 75" class="icon"/>
</svg>
`;


export default {
  darkMode: ['class'],
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        'food-pattern': `url("${svgToDataUri(foodPatternSvg)}")`,
      },
      fontFamily: {
        body: ['var(--font-body)', 'sans-serif'],
        headline: ['var(--font-headline)', 'serif'],
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
        status: {
            new: {
                bg: 'hsl(var(--status-new-bg))',
                fg: 'hsl(var(--status-new-fg))',
            },
            ready: {
                bg: 'hsl(var(--status-ready-bg))',
                fg: 'hsl(var(--status-ready-fg))',
            },
            collected: {
                bg: 'hsl(var(--status-collected-bg))',
                fg: 'hsl(var(--status-collected-fg))',
            },
            cancelled: {
                bg: 'hsl(var(--status-cancelled-bg))',
                fg: 'hsl(var(--status-cancelled-fg))',
            },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

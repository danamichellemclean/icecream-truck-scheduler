// ─────────────────────────────────────────────────────────────────────────────
// BRANDING CONFIG — edit this file to white-label the app for any operator.
// Every color, name, emoji, and selectable option lives here.
// ─────────────────────────────────────────────────────────────────────────────

const branding = {
  // ── Identity ───────────────────────────────────────────────────────────────
  businessName: "Hello Sunshine Ice Cream Truck",
  tagline: "Sweet moments, delivered.",

  // Logo: set to a relative or absolute URL string, or null to show logoEmoji
  logo: null,
  logoEmoji: "🍦",

  // ── Colors ─────────────────────────────────────────────────────────────────
  colors: {
    primary:         "#F5B700", // warm golden yellow
    primaryLight:    "#FFE066",
    primaryDark:     "#C68A00",
    secondary:       "#5BB8F5", // sky blue
    secondaryLight:  "#C8E8FF",
    accent:          "#FF8C42", // warm orange
    background:      "#FFFDF5", // creamy off-white
    surface:         "#FFFFFF",
    surfaceAlt:      "#FFF8E7", // very light yellow tint
    text:            "#2C1810", // warm near-black
    textSecondary:   "#7A6155",
    border:          "#EDE0C8",
    danger:          "#D94F3D",
    success:         "#3D9E6B",
  },

  // ── Event form options — update these per operator ─────────────────────────
  trucks: ["OG Truck", "Poppy"],

  packages: [
    "Sunshine Small Party — $100 (15 frozen treats, 30 minutes of service)",
    "Neighborhood Party Package — $200 (30 frozen treats, 1 hour of service)",
    "School & Community Celebration Package — $300 (50 frozen treats, 1.5 hours of service)",
  ],

  // Background image shown at low opacity behind the app shell.
  // Set to null to disable; operators can swap in their own URL here.
  backgroundImageUrl: "https://hosting.renderforestsites.com/33152010/1568876/media/9185a6e04ee88773fa979a19a9f845be.png",

  employees: ["Alex", "Jamie", "Sam", "Taylor", "Morgan"],

  // ── PWA / manifest values ──────────────────────────────────────────────────
  // These must also be kept in sync with public/manifest.json manually
  shortName: "Hello Sunshine",
};

export default branding;

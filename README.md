# UIverse Studio — Premium UI Design Marketplace

> Discover. Customize. Download. Build.

UIverse Studio is a professional, responsive, and interactive marketplace and component laboratory for developers, UI/UX designers, freelancers, and design engineers. Discover 24+ hand-crafted UI designs, customize visual tokens with real-time feedback, save to personalized collections, and download production-ready source code archives as complete ZIP files.

---

## 🚀 Key Features

1. **24+ Distinct Production Designs:**
   - Spatial 3D Hero, Aurora Glass Login Suite, Aether Glass Dashboard, HyperGradient Hero, Veloce Atelier Product Grid, Obsidian Audio PDP, SaaS Pricing Matrix, MetricsStream Console, DevCraft Terminal Portfolio, Monochrome Kinetic Agency, Command Palette Fluid Nav, Workspace Pro Rail, MicroMotion Kinetic Button Suite, Identity Bento Card, Echo Testimonial Spotlight, Inquiry Studio Contact Form, Minimal Pulse Weekly Digest, Masonry Lens Gallery, KPI Telemetry Deck, Nova Stream Messenger, Atmosphere Horizon Weather Station, Ledger Flow FinTech Wealth Tracker, SkillMatrix LMS Course Cards, and SwiftPay Checkout Sheet.

2. **Live Token Customizer & Editor:**
   - Real-time adjustments to primary/secondary colors, canvas backgrounds, font families, font sizes, corner radii, elevation shadows, motion speeds, button styles, light/dark modes, and headline/CTA copy.
   - Live Undo / Redo history stack.
   - Copy CSS variables (`:root`) and Component JSX directly to clipboard.
   - Save customized variant presets to your dashboard.
   - Download customized ZIP packages including custom tokens (`custom-theme.json`).

3. **Isolated Viewport Live Previews:**
   - Responsive preview modes: **Desktop** (1200px), **Tablet** (768px), and **Mobile** (375px).
   - Full-screen view and instant preview reload.
   - Integrated source code inspector (React JSX, semantic HTML5, modern CSS).

4. **Pure Client-Side ZIP Generator (PKZIP Standard):**
   - Implemented with pure TypeScript (`zipGenerator.ts`), computing standard CRC-32 checksums and building authentic ZIP binary blobs.
   - Zero external binary or cloud dependencies; works seamlessly in hermetic browser sandboxes.
   - Extracts cleanly across Windows Explorer, macOS Archive Utility, Linux `unzip`, and 7-Zip.
   - Packages include `index.html`, `style.css`, `script.js`, React `Component.jsx`, `package.json`, `custom-theme.json`, `README.md`, and `LICENSE.txt`.

5. **Personalized User Dashboard & Collections:**
   - Bookmarked saved designs with optimistic UI feedback.
   - Curated & user-created collections (create, rename, delete, add/remove designs).
   - Saved custom variant library with 1-click re-downloading.
   - Complete download history audit trail.
   - Profile management.

6. **Accessible Authentication & Demo Mode:**
   - Accessible Login, Signup, and Password Reset forms with real-time validation and show/hide password toggles.
   - Built-in one-click **Demo Creator Account** for immediate functional evaluation of protected dashboard routes.
   - Clean decoupled architecture ready for production Firebase Auth or Supabase Auth.

---

## 🛠️ Frontend Syllabus Implementation

- **Unit I (Core Web Foundations):**
  - Semantic HTML5 elements (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`).
  - Accessible form inputs, explicit `<label>` tags, and keyboard focus states (`focus-visible`).
  - Mobile-first responsive layouts with CSS Grid and Flexbox across phone, tablet, and desktop viewports.
  - Zero-pill metadata styling with typographic separators (`·`, `/`).

- **Unit II (JavaScript & Dynamic UI Development):**
  - Event-driven state updates, client-side validation, and search debouncing (250ms).
  - Dynamic multi-criteria filtering (Category, Technology, License, Animation System, Screen Size, Theme).
  - Multi-option sorting (Most Popular, Most Downloaded, Recently Added, Name A-Z).
  - Web Share API integration with automatic fallback to clipboard copy.
  - Asynchronous catalog loading simulation with loading skeletons, empty states, and error resilience.

- **Unit III (Modern Frontend Development):**
  - Reusable React components (`Navbar`, `Footer`, `DesignCard`, `DesignGrid`, `CategorySidebar`, `SearchBar`, `LiveDesignRenderer`, `DesignCustomizer`, `LivePreviewModal`, `DesignDetailsModal`, `AuthModal`, `UserDashboard`).
  - Custom React hooks & state encapsulation (`useToast`, `useMemo`, `useState`, `useEffect`).
  - Deep design system integration with dark-mode aesthetic styling.

---

## 💻 Development & Build Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local development server (Port 3000)
npm run dev

# 3. Type-check & lint codebase
npm run lint

# 4. Compile production build
npm run build

# 5. Preview production build
npm run preview
```

---

## 🔐 Environment Variables

Define the following in your deployment environment or `.env`:

```bash
# GEMINI_API_KEY: Optional runtime API key for AI Studio environment
GEMINI_API_KEY=""

# APP_URL: The base URL where UIverse Studio is deployed
APP_URL="https://your-domain.app"

# Optional: Supabase / Firebase production credentials
# VITE_SUPABASE_URL=""
# VITE_SUPABASE_ANON_KEY=""
# VITE_FIREBASE_API_KEY=""
# VITE_FIREBASE_PROJECT_ID=""
```

*Note: For testing and evaluation, UIverse Studio runs out-of-the-box with local browser persistence and a designated Demo Creator Account.*

---

## 📦 ZIP Package Anatomy

When downloading any design, the generated archive structure is:

```
[design-slug]-uiverse.zip
├── index.html            # Standalone semantic HTML5 preview
├── style.css             # Theme tokens and responsive CSS
├── script.js             # Interactive client-side JavaScript
├── custom-theme.json     # JSON design tokens (colors, font, radius)
├── README.md             # Documentation, peer dependencies & usage
├── LICENSE.txt           # Permissive MIT or UIverse Commercial terms
└── react/
    ├── Component.jsx     # Production React component
    ├── styles.css        # Scoped stylesheet
    └── package.json      # Dependencies specification
```

---

## 🚢 Deployment Instructions

Deployable instantly to modern static frontend hosting platforms:
- **Vercel:** Import repository, framework preset: `Vite`, build command: `npm run build`, output directory: `dist`.
- **Netlify:** Build command: `npm run build`, publish directory: `dist`.
- **Cloud Run / Docker:** Run with static file serving (`vite preview` or Nginx).

---

## 📄 License

- Free designs: Licensed under **MIT License**.
- Pro designs: Licensed under **UIverse Studio Commercial License**.

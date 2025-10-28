# ChemSense Design Guidelines

## Design Approach

**Selected Approach: Reference-Based (Modern SaaS)**

**Primary References:** Linear (vibrant gradients, smooth interactions), Stripe (purple accents, glass effects), Vercel (polished gradients)

**Justification:** While ChemSense remains a data-focused laboratory tool, the startup positioning requires a modern, approachable aesthetic that balances professionalism with visual appeal. Drawing from leading SaaS platforms creates familiarity while the vibrant gradient system differentiates the brand in the scientific software space.

**Key Design Principles:**
- **Vibrant Professionalism**: Eye-catching gradients paired with clear data hierarchy
- **Glass & Depth**: Layered interfaces using glassmorphism for modern appeal
- **Fluid Navigation**: Connected page flows with clear breadcrumb trails
- **Smooth Interactions**: Polished micro-animations that enhance usability

---

## Core Design Elements

### A. Color Palette

**Brand Gradients:**
- **Primary Gradient**: 270 80% 60% → 180 70% 50% (Purple to Teal, 135deg)
- **Accent Gradient**: 280 75% 55% → 190 80% 45% (Deeper purple-teal shift)
- **Surface Gradient**: 260 40% 20% → 200 35% 18% (Subtle dark mode bg)

**Solid Colors:**
- **Dark Mode Primary**: 270 75% 55% (Vibrant purple for CTAs)
- **Dark Mode Teal**: 180 65% 48% (Teal accents, badges)
- **Dark Mode Background**: 240 20% 10% (Deep navy base)
- **Dark Mode Surface**: 240 15% 14% (Card backgrounds with glass overlay)

**Light Mode:**
- **Primary**: 270 70% 50% (Rich purple)
- **Teal**: 180 60% 45% (Teal highlights)
- **Background**: 240 30% 98% (Cool off-white)
- **Surface**: 0 0% 100% (White cards with subtle gradient overlays)

**Semantic Colors:**
- **Hazard Critical**: 0 80% 55% (Red danger)
- **Hazard Warning**: 30 95% 50% (Orange caution)
- **Hazard Safe**: 145 65% 45% (Green safe)

**Glass Effect Tokens:**
- **Glass Background**: backdrop-blur-xl with bg-white/10 (dark) or bg-white/60 (light)
- **Glass Border**: 1px border-white/20 with subtle shadow-xl

### B. Typography

**Font Families:**
- **Primary**: Inter (Google Fonts) - UI and body text
- **Display**: Inter Tight (Google Fonts) - Headlines, hero text
- **Monospace**: JetBrains Mono - Chemical formulas, data

**Type Scale:**
- **Hero**: 3.5rem / Extrabold / -0.02em / Gradient text
- **H1**: 2.5rem / Bold / -0.01em
- **H2**: 2rem / Semibold / Normal
- **H3**: 1.5rem / Semibold / Normal
- **Body Large**: 1.125rem / Regular / 1.6 lh
- **Body**: 1rem / Regular / 1.5 lh
- **Caption**: 0.875rem / Medium / 1.4 lh

### C. Layout System

**Spacing Primitives**: Tailwind units of **4, 6, 8, 12, 16, 20, 24**
- Micro (4): Icon gaps, tight groupings
- Standard (6-8): Card padding, element spacing
- Large (12-16): Section separation
- XL (20-24): Page-level margins

**Container**: max-w-7xl with px-6 mobile, px-8 desktop

**Navigation Layout:**
- **Top Nav**: Fixed, glass effect, 72px height, centered content with max-w-7xl
- **Nav Items**: Horizontal flex with gap-8, active state with gradient underline
- **No Sidebar**: All navigation in top bar, mobile hamburger menu

### D. Component Library

**Navigation:**
- **Top Bar**: Glass background (backdrop-blur-xl bg-surface/80), gradient border-bottom, logo left, nav center, actions right
- **Breadcrumbs**: Gradient text with chevron separators, sticky below nav on scroll
- **Mobile Menu**: Full-screen overlay with glass backdrop, slide-in animation

**Buttons:**
- **Primary**: Gradient background (purple-teal), white text, rounded-xl, shadow-lg with glow
- **Secondary**: Glass effect with gradient border, gradient text, rounded-xl
- **Ghost**: Transparent with gradient text, hover glass background
- **Icon**: 44px circular, glass effect, gradient border on hover

**Cards:**
- **Glass Cards**: rounded-2xl with backdrop-blur-xl, gradient border (1px), shadow-2xl with color glow
- **Elevated Cards**: White/dark surface with gradient top border accent (4px), rounded-xl
- **Interactive Cards**: Hover lifts with scale-105 transform, enhanced shadow

**Forms:**
- **Inputs**: rounded-lg, glass background, gradient focus ring (2px), floating labels
- **Dropdowns**: Glass surface, gradient selected state, smooth expand animation
- **Sliders**: Gradient track, large thumb with glow effect

**Data Displays:**
- **Tables**: Glass surface, gradient header, hover row highlights with teal tint
- **Charts**: Vibrant gradient fills, smooth path animations, interactive tooltips with glass effect
- **Metrics**: Large gradient numbers, glass background containers, pulsing update animations

**Overlays:**
- **Modals**: Centered glass card (max-w-3xl), dark backdrop (80% opacity), scale-in animation (300ms)
- **Toasts**: Top-right, glass surface with gradient left border, slide-in from right (250ms)
- **Tooltips**: Glass bubble, gradient border, fade-in 150ms delay

### E. Animations

**Enhanced Motion:**
- **Page Transitions**: 300ms smooth fade + slight y-translate
- **Card Hovers**: 200ms scale-102 + shadow enhancement + glow increase
- **Button Interactions**: 150ms gradient shift, 200ms glow pulse on click
- **Data Loading**: Shimmer gradient animation across skeleton (2s loop)
- **Modal Entry**: 350ms scale (90% to 100%) + fade + backdrop blur-in
- **Scroll Reveals**: Staggered fade-up for card grids (100ms delays)
- **Gradient Shifts**: Subtle 8s infinite background gradient animation on hero

---

## Page Layouts

### Home/Landing Page
**Hero Section** (100vh):
- Full-screen gradient background (animated)
- Large gradient headline with glass subtext container
- CTA buttons (primary + secondary glass) with arrow animations
- Floating glass cards showcasing key features (absolute positioned, gentle float animation)
- **Hero Image**: Abstract 3D rendered chemical molecules with gradient overlay, full-bleed background

**Features Section**: 
- 3-column grid (md:grid-cols-3) of glass cards with gradient icons, hover lift effects
- Each card: icon, title, description, subtle gradient bottom border

**Social Proof**:
- Marquee of university/lab logos on glass bar
- Gradient-text testimonial cards in 2-column layout

### Dashboard Page
**Top Stats Bar**: Glass container with 4 metric cards (gradient icons, large numbers, trend indicators)

**Main Content** (2-column on desktop):
- Left (60%): Activity feed with glass cards, gradient time stamps
- Right (40%): Quick actions glass panel, upcoming deadline cards with gradient progress bars

**Charts Section**: Full-width glass container with tabbed chart views (gradient active tab)

### Chemical Predictor Page
**Input Section**: 
- Centered glass form card (max-w-2xl) with gradient header
- Grouped inputs with glass styling, inline parameter sliders with gradient fills
- Large gradient CTA button with glow effect

**Results Section**:
- Animated reveal from bottom
- Large circular hazard gauge with gradient fill and glow
- Glass cards grid showing safety protocols with check animations
- Chemical properties table with alternating glass rows
- Floating action button for PDF export (gradient, bottom-right)

### Lab Notebook
**List View** (Left 35%):
- Glass sidebar with search bar (gradient focus ring)
- Scrollable experiment cards with gradient hazard badges
- Filter chips with glass effect, gradient selected state

**Detail View** (Right 65%):
- Glass editor container with gradient toolbar
- Rich text area with inline image placeholders
- Floating save button with success animation

### Safety Compliance
**Compliance Overview**:
- Large gradient progress circle (center top)
- Glass deadline calendar with gradient date markers
- Alert banner with gradient left border if overdue items

**Chart Gallery**:
- 3-column grid (lg:grid-cols-3) of glass cards
- Interactive safety diagram cards with gradient overlays
- Click expands to full-screen modal with glass controls
- Category filters with gradient active states

---

## Images

**Hero Image**: Full-bleed abstract 3D molecular visualization with purple-teal gradient overlay (landing page, 100vh)

**Diagram Images**: SVG safety flowcharts and protocol diagrams displayed in glass-bordered containers throughout app - expandable in modals

**Icon System**: Heroicons via CDN with gradient fills for brand icons, outline style for UI icons

---

## Glassmorphism Implementation

**Standard Glass Effect:**
```
backdrop-blur-xl
bg-white/10 (dark) or bg-white/60 (light)
border border-white/20
shadow-2xl shadow-purple-500/10
```

**Elevated Glass:**
```
backdrop-blur-2xl
bg-gradient-to-br from-white/15 to-white/5
border border-white/25
shadow-[0_8px_32px_rgba(139,92,246,0.15)]
```

Applied to: Nav bar, cards, modals, form containers, tooltips

---

## Accessibility

- All gradient text has 7:1 contrast fallback
- Glass elements maintain 4.5:1 text contrast minimum
- Focus indicators use gradient ring (3px) with high contrast
- Keyboard navigation with gradient focus trails
- Motion reduced for users with prefers-reduced-motion
- All interactive elements 44px minimum touch target
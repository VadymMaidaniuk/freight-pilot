---
name: FreightPilot Design System
colors:
  surface: '#f4faff'
  surface-dim: '#d4dbe0'
  surface-bright: '#f4faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef5fa'
  surface-container: '#e8eff4'
  surface-container-high: '#e2e9ee'
  surface-container-highest: '#dce3e8'
  on-surface: '#161d20'
  on-surface-variant: '#3c4947'
  inverse-surface: '#2a3135'
  inverse-on-surface: '#ebf2f7'
  outline: '#6c7a77'
  outline-variant: '#bbcac6'
  surface-tint: '#006a60'
  primary: '#006a60'
  on-primary: '#ffffff'
  primary-container: '#12b5a5'
  on-primary-container: '#00403a'
  inverse-primary: '#52dbca'
  secondary: '#4b607a'
  on-secondary: '#ffffff'
  secondary-container: '#c9dffd'
  on-secondary-container: '#4e627c'
  tertiary: '#895100'
  on-tertiary: '#ffffff'
  tertiary-container: '#df902e'
  on-tertiary-container: '#533000'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#72f8e6'
  primary-fixed-dim: '#52dbca'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005048'
  secondary-fixed: '#d2e4ff'
  secondary-fixed-dim: '#b3c8e6'
  on-secondary-fixed: '#051d33'
  on-secondary-fixed-variant: '#344861'
  tertiary-fixed: '#ffdcbc'
  tertiary-fixed-dim: '#ffb86b'
  on-tertiary-fixed: '#2c1700'
  on-tertiary-fixed-variant: '#683d00'
  background: '#f4faff'
  on-background: '#161d20'
  surface-variant: '#dce3e8'
  ink-text: '#1B2A3A'
  muted-text: '#5C6B7A'
  border-hairline: '#E3E9EF'
  ai-marker: '#12B5A5'
  surface-navy: '#0B2239'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  sidebar-width: 260px
  topbar-height: 64px
  gutter: 1rem
  margin-page: 2rem
  stack-compact: 0.5rem
  stack-default: 1rem
---

## Brand & Style
The design system is engineered for the high-stakes environment of logistics and freight forwarding. It positions itself as a **Premium B2B Command Surface**: a tool that prioritizes utility, speed, and precision over decorative flair. The aesthetic is "Technical Elegance"—merging the reliability of enterprise software with the modern clarity of AI-native tools.

The visual direction follows a **Corporate / Modern** style with a focus on high information density. It avoids "soft" consumer trends in favor of a rigid, trustworthy interface that feels like a professional instrument. The key emotional response should be one of "controlled efficiency"—the user feels empowered by the AI without losing oversight of the underlying data.

## Colors
The palette is architectural, using **Navy (#0B2239)** as the structural "chrome" to provide a sense of grounded authority. This is contrasted against a **Cool Grey Background (#EAF1F6)** to reduce eye strain during long working sessions.

**Teal (#12B5A5)** is used exclusively for primary actions and the "AI Boundary," signaling moments where the model is assisting the user. **Amber (#E0912F)** is reserved for high-priority signals: deadlines, quotes needing manual review, and financial upside.

For semantic states, use 10% opacity tints of the primary and tertiary colors behind text for chips and badges to maintain a clean, professional look without heavy color blocks.

## Typography
This design system utilizes **Inter** for all UI and prose elements to ensure maximum legibility at small sizes. A "Strong Type Scale" approach is used, creating clear contrast between metadata and primary information.

**Key Technical Requirement:** All numeric data, including weights, prices, and container counts, must use **JetBrains Mono** or Inter with `tnum` (tabular numbers) enabled. This ensures that columns of numbers align vertically for easy comparison. Use `label-caps` for secondary table headers and sidebar category titles to create a distinct hierarchy from the content.

## Layout & Spacing
The layout follows a **Fixed Sidebar + Fluid Content** model. The App Chrome (Sidebar and Top Bar) is anchored in **Navy**, creating a "L-shaped" frame for the content canvas.

Content is organized into a modular grid. Tables and data lists should prioritize density, utilizing a 4px baseline grid for internal padding. On desktop, the main content area has a maximum comfortable reading width for documents, but data tables are allowed to stretch to the full width of the viewport to accommodate multiple columns. 

**Breakpoints:**
- **Desktop (1280px+):** Full sidebar visible.
- **Tablet (768px - 1279px):** Sidebar collapses to icons; margins reduce to 1rem.
- **Mobile (<768px):** Sidebar moves to a bottom navigation bar or hidden drawer; content stacks vertically.

## Elevation & Depth
Depth is conveyed primarily through **Tonal Layers** rather than heavy shadows. 

The Navy chrome sits at the lowest elevation (Surface 0). The Background (#EAF1F6) is Surface 1. Content "cards" or modules are Surface 2 (White), using **Hairline Borders (#E3E9EF)** instead of shadows to define their edges. 

Subtle ambient shadows (4px blur, 5% opacity Navy) are reserved exclusively for floating elements like dropdown menus, tooltips, and modal dialogs to make them feel temporarily "above" the command surface. This maintains a flat, "dashboard" feel that doesn't distract from the data.

## Shapes
The design system employs a **Soft (0.25rem)** roundedness. This minimal radius provides a professional, modern feel without the "playfulness" of more rounded consumer apps. 

Buttons and input fields use the base 4px (0.25rem) radius. Status chips and AI badges use a slightly higher radius (0.5rem) to differentiate them from functional inputs, but they should never be fully pill-shaped.

## Components
- **Primary Buttons:** Solid Teal (#12B5A5) with White text. Bold weight.
- **AI Boundary Marker:** A vertical 2px Teal bar or a small Teal "AI" label in JetBrains Mono. Use this to wrap any data field or text block generated by the model.
- **Input Fields:** White background with Hairline Border. Focus state uses a 1px Teal glow. 
- **Status Chips:**
  - *Pending:* Soft Amber background, Dark Amber text.
  - *AI Suggested:* Soft Teal background, Dark Teal text.
- **Data Tables:** No vertical borders. Horizontal hairline borders only. Hover state for rows uses a 2% Navy tint.
- **Command Bar:** A persistent search/action bar at the top of the content canvas for quick quote lookups, styled with a light inner shadow to suggest a "cut-out" in the surface.
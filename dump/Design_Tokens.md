# DashLint UI - Design Tokens & Styles

This document contains the exact CSS definitions, color palettes, sizing tokens, and typography used across the DashLint UI components (extracted directly from `global.css` and `index.css`).

## 1. Global Color Palette

### Base Theme
- **`--rail-bg`**: `#111111` (SLA-Pulse) / `#151515` (Pulse React Dashboard)
- **`--rail-border`**: `#2c2c2a` (SLA-Pulse) / `#252930` (Pulse React Dashboard)
- **`--bg`**: `#F2F4F7`
- **`--surface`**: `#FFFFFF`
- **`--surface-2`**: `#EEF0F4`
- **`--surface-3`**: `#F8FAFC`
- **`--ink`**: `#181C24` (Primary Text)
- **`--muted`**: `#6B7280` (Secondary Text)
- **`--line`**: `#DDE1E9` (Standard Borders)
- **`--line-strong`**: `#BCC2CE` (Strong Borders)

### State & Alert Colors
- **Accent (Grey)**
  - `--accent`: `#4B5563`
  - `--accent-dim`: `rgba(75, 85, 99, 0.10)`
  - `--accent-line`: `rgba(75, 85, 99, 0.30)`
- **Success / OK (Green)**
  - `--ok`: `#1A7A56`
  - `--ok-dim`: `rgba(26, 122, 86, 0.09)`
- **Warning (Amber)**
  - `--warn`: `#B45309`
  - `--warn-dim`: `rgba(180, 83, 9, 0.09)`
- **Error (Red)**
  - `--err`: `#C0392B`
  - `--err-dim`: `rgba(192, 57, 43, 0.06)`

### Chart & Analytics Palette
- **`--chart-blue`**: `#3B82F6` (SLA) / `#181C24` (Pulse)
- **`--chart-indigo`**: `#6366F1`
- **`--chart-purple`**: `#8B5CF6`
- **`--chart-teal`**: `#0D9488`
- **`--chart-cyan`**: `#0891B2`
- **`--chart-green`**: `#10B981`
- **`--chart-amber`**: `#F59E0B`
- **`--chart-orange`**: `#F97316`
- **`--chart-red`**: `#EF4444`

### Map Overview Overlay
- **`--map-canvas`**: `#111111`
- **`--map-land`**: `#151515`
- **`--map-border`**: `#20201f`
- **`--map-surface`**: `#151515`
- **`--map-surface-card`**: `#1b1b1a`
- **`--map-text`**: `#F3F4F6`
- **`--map-text-dim`**: `#9CA3AF`
- **`--map-text-muted`**: `#6B7280`
- **`--map-accent`**: `#38BDF8`
- **`--map-alert`**: `#EF4444`
- **`--map-alert-glow`**: `rgba(239, 68, 68, 0.35)`

---

## 2. Typography

- **Global Base Font Size**: `14px`
- **Sans-serif Font (`--sans`)**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif`
- **Monospace Font (`--mono`)**: `'IBM Plex Mono', 'Cascadia Code', 'Consolas', monospace`
- **Display Font (Optional)**: `'Oswald'` (Used for specific bold headers)

### Font Weights
- **Normal**: `400`
- **Medium**: `500`
- **Semi-Bold**: `600`
- **Bold**: `700`
- **Extra Bold**: `800` (Oswald)

---

## 3. Sizing, Spacing & Layout Tokens

### Layout Containers
- **Main App Shell Layout**: `grid-template-columns: 268px minmax(0, 1fr); gap: 12px;`
- **Rail / Sidebar Padding**: `20px 16px`
- **Rail Logo Container**: `42px x 42px`, `border-radius: 6px`
- **Header Strip Padding**: `14px 18px`
- **Standard Panel / Card Padding**: `16px`
- **Global App Padding**: `12px` (Outer boundary margin)
- **Standard Border Radius**: `8px` (Cards, overlays) and `6px` (Smaller components/buttons)
- **Z-Index Variables**: Modal (`100`), Analytics Overlay (`50`)

### Interactive Elements
- **Standard Button Height**: `36px` (`font-size: 12px`, `border-radius: 4px`)
- **Compact Button / Tool Height**: `32px` (`font-size: 11px`)
- **Action/Compact Icons**: `24px` height
- **Pills (Status Tags)**: `font-size: 10px`, `padding: 2px 7px`, `border-radius: 3px`

### Shadows & Depth
- **Hover Card Depth**: `box-shadow: 0 4px 14px rgba(0,0,0,.06)`
- **Modal Depth**: `box-shadow: 0 24px 64px rgba(0,0,0,.5)`
- **Standard Overlay Transitions**: `0.15s ease` to `0.2s` 

### Form Controls
- **Input / Textarea Borders**: `1px solid var(--line)` (Focus state turns to `var(--accent)`)
- **Dropdown Height**: `30px - 38px`

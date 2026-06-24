# Cabin Crew Duty

Offline-first iPad PWA for business-class cabin crew on the Airbus A220-300.

## Features

- **Seat Map** — A220-300 business layout (rows 1–3, seats A/C left, D/F right, E blocked)
- **Meal & drink orders** — tap a seat to assign hot meals (stock-aware) and beverages via POS-style drink menu
- **Order Tickets** — track orders by status (pending, in progress, completed, on hold)
- **Hot Meal Stocking** — configure 3 daily meals with quantities and live remaining counts
- **Offline PWA** — works without network after first load; add to iPad Home Screen via Safari

## Quick start

```bash
npm install
npm run dev
```

Open the URL shown in the terminal on your iPad (same Wi‑Fi) or run `npm run preview` after `npm run build`.

### Install on iPad

1. Open the app in **Safari**
2. Tap **Share** → **Add to Home Screen**
3. Launch from the home screen for full-screen offline use

## Tech stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · Dexie (IndexedDB) · Zustand · vite-plugin-pwa

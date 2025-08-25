[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/k6kO_4Go)


## The Jobless – News Verification SPA

A Vue 3 single‑page app to browse news, filter Fake/Verified, view details, vote, and read community comments. Mock data is served from `public/data/db.json` so it works the same on Vite and Vercel.

### Group Members
- Name Surname (Student ID)
- Name Surname (Student ID)
- Name Surname (Student ID)

### Tech Stack
- Vue 3 + Vite
- Pinia (state management)
- Vue Router
- Tailwind CSS
- Deployment: Vercel

---

## Getting Started

### Prerequisites
- Node.js LTS ≥ 18
- npm

### Install
```bash
npm install
```

### Generate mock data (60 records: categories, images, content)
```bash
npm run generate-db
```
A file will be created at `public/data/db.json` and fetched via `/data/db.json`.

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview (serve the production build locally)
```bash
npm run preview
```

---

## Available Scripts
- `dev`: start Vite dev server
- `build`: build production assets to `dist/`
- `preview`: preview the `dist/` build
- `generate-db`: generate `public/data/db.json` from `scripts/generate-db.js`

---

## Features
- Filter: All / Fake / Verified + Category selector
- Pagination with page‑size selector and auto scroll‑to‑top
- Loading skeletons
- News details: image, summary, full content, votes with majority percentage, comments (paginated)
- Voting and commenting stored in Pinia (client‑side), combined with mock data
- Stable images with fallback if an image fails to load
- Responsive white theme, readable typography

## Deploy (Vercel)
- Import the repository in Vercel
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- The `public/` folder (including `public/data/db.json`) is copied automatically

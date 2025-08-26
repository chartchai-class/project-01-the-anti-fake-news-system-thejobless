[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/k6kO_4Go)


## The Jobless – News Verification

## Link
  * Deployed site(Vercel) : https://project-01-the-anti-fake-news-system-thejobless-dbxwuwu84.vercel.app
  * Demo video :

### Group Members
- 662115015-Natthaphong Kangkantam (SEC 702)
- 662115026-Nawapon Sriboonreang (SEC 702)
- 662115039-Manapat Kaewlai (SEC 702)

### Tech Stack
- Vue 3 + Vite
- Pinia (state management)
- Vue Router
- Tailwind CSS
- Deployment: Vercel

## Features
- Filter: All / Fake / Verified + Category selector
- Pagination with page‑size selector and auto scroll‑to‑top
- Loading skeletons
- News details: image, summary, full content, votes with majority percentage, comments (paginated)
- Voting and commenting stored in Pinia (client‑side), combined with mock data
- Stable images with fallback if an image fails to load

---
### Project structure
```text
thejobless/
├─ .vercel/                      # Vercel project metadata
├─ node_modules/
├─ public/
│  └─ data/
│     └─ db.json                 # Mock data served at /data/db.json
├─ scripts/
│  └─ generate-db.js             # Generate public/data/db.json
├─ src/
│  ├─ assets/                    # Static assets (if any)
│  ├─ components/
│  │  └─ CommentsList.vue
│  ├─ pages/
│  │  ├─ Home.vue                # List + filters + pagination
│  │  ├─ NewsDetail.vue          # Full detail + votes + comments (paginated)
│  │  └─ VotePage.vue            # Vote + optional evidence URL
│  ├─ router/
│  │  └─ index.js                # Routes: / , /news/:id , /news/:id/vote
│  ├─ store/
│  │  └─ news.js                 # Pinia store (news/votes/comments/filters)
│  ├─ style.css                  # Tailwind entry
│  ├─ App.vue
│  └─ main.js                    # Bootstrap + Pinia + Router + Vercel analytics/insights
├─ index.html                    # Vite entry (mounts #app)
├─ vercel.json                   # SPA rewrite for Vue Router
├─ vite.config.js
├─ tailwind.config.js
├─ postcss.config.js
├─ package.json                  # Scripts & deps
├─ package-lock.json
└─ .gitignore
```
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

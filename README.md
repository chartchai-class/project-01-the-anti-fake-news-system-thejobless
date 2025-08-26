[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/k6kO_4Go)


## The Jobless – News Verification

## Link
  * Deployed site(Vercel) : https://project-01-the-anti-fake-news-syste-puce.vercel.app
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
- **News Management**: 60+ articles with pagination and configurable page sizes
- **Category Filtering**: Filter by Space, Weather, Geology, Environment, Science, Technology  
- **Status Filtering**: Filter by All, Fake News, Verified News based on community voting
- **News Detail Pages**: Full news view with comprehensive content and metadata
- **Community Voting**: Real-time voting system for news authenticity (Fake/Not Fake)
- **Vote Results**: Live percentage display and community consensus indicators
- **Community Comments**: Paginated comment system with evidence sharing
- **Vote Page**: Dedicated page for user voting and evidence submission
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Modern UI**: Clean white theme with excellent typography and readability
- **Interactive Elements**: Hover effects, clickable cards, and smooth transitions
- **Performance**: Lazy loading, caching, and optimized data fetching

---
### Project structure
```text
thejobless/
├── src/                          # Source code
│   ├── components/               # Reusable UI components
│   │   ├── CommentsList.vue        # Paginated comments display
│   │   └── FilterModal.vue         # Advanced filtering modal
│   ├── pages/                   # Page components
│   │   ├── Home.vue                # News listing with filters & pagination
│   │   ├── NewsDetail.vue          # Detailed news view with comments
│   │   └── VotePage.vue            # User voting and commenting
│   ├── store/                   # Pinia state management
│   │   └── news.js                 # News data, filters, votes, comments
│   ├──  router/                  # Vue Router configuration
│   │   └── index.js                # Route definitions
│   ├── assets/                  # Static assets
│   ├── App.vue                     # Root component
│   ├── main.js                     # Application entry point
│   └── style.css                   # Global styles & Tailwind CSS
├── public/                      # Public assets
│   └──  data/                    # Mock data
│       └── db.json                 # 60 news items with comments & votes
├── scripts/                     # Build & data generation
│   └── generate-db.js              # Mock data generator script
├── node_modules/                # Dependencies
├── package.json                     # Project dependencies & scripts
├── package-lock.json               # Locked dependency versions
├── vite.config.js                  # Vite build configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── vercel.json                     # Vercel deployment config
├── .gitignore                      # Git ignore patterns
└── index.html                      # HTML entry point
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

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

นี่คือการตั้งค่าที่ต้องมีสำหรับ deploy ขึ้น Vercel (Vue 3 + Vite + Vue Router + static data)

### 1) ตรวจ package.json
- ต้องมีสคริปต์เหล่านี้แล้ว
```json
<code_block_to_apply_changes_from>
```

### 2) เพิ่ม SPA rewrite (สำคัญมากสำหรับ Vue Router)
สร้างไฟล์ `vercel.json` ที่รากโปรเจกต์
```json:thejobless/vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
- ป้องกัน 404 เวลา refresh ที่เส้นทางเช่น `/news/1`

### 3) ตรวจข้อมูล mock
- ไฟล์ต้องอยู่ที่ `public/data/db.json`
- โค้ด fetch ใช้ `/data/db.json` (ถูกแล้ว) → Vercel จะเสิร์ฟจากโฟลเดอร์ `public` อัตโนมัติ

### 4) ตั้งค่าใน Vercel (UI)
- New Project → เลือก repo
- Framework Preset: Vite
- Root Directory: `./`
- Build & Output:
  - Build Command: `npm run build`
  - Output Directory: `dist`
- Deploy

### 5) (ทางเลือก) ใช้ CLI
```bash
npm i -g vercel
vercel           # ครั้งแรก (preview)
vercel --prod    # deploy production
```

เสร็จแล้ว ลองเปิดลิงก์ production:
- หน้าแรก (Home)
- เส้นทางย่อย `/news/:id` (ทดสอบ refresh ด้วย)  
ถ้าทุกอย่างถูกต้อง จะไม่ขึ้น 404 และ `/data/db.json` โหลดได้จากโดเมน production ทันที.

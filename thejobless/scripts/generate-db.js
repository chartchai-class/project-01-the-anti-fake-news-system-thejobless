// Stable images via images.unsplash.com (no redirect), category‑matched,
// unvoted items start as "unverified"

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const U = (id) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=400&fit=crop&crop=center&auto=format&q=80`;

const CATEGORIES = [
  {
    name: "Politics",
    photos: ["1557804506-669a67965ba0","1560472354-b33ff0c44a43","1507003211169-0a1dd7228f2d"],
    summaries: [
      "New policy proposal aims to reform national healthcare.",
      "Parliament debates stronger climate legislation.",
      "Election results hint at a shift in voter priorities."
    ],
    contents: [
      "Officials unveiled a healthcare plan expanding coverage and aiding rural hospitals.",
      "Lawmakers discussed ambitious carbon targets with clean‑energy incentives.",
      "Analysts note higher youth turnout, reshaping party priorities."
    ]
  },
  {
    name: "Technology",
    photos: ["1518709268805-4e9042af2176","1518186285589-2f7649de83e0","1517077304055-6e89abbf09b0"],
    summaries: [
      "AI breakthrough promises faster medical diagnostics.",
      "New battery design targets double‑day phone usage.",
      "Quantum team reports record coherence stability."
    ],
    contents: [
      "The model flags rare conditions from scans with high precision.",
      "Prototype lithium‑sulfur cells show longer life; scaling underway.",
      "Longer qubit coherence advances practical error correction."
    ]
  },
  {
    name: "Health",
    photos: ["1576091160399-112ba8d25d1f","1559757148-5c350d0d3c56","1581595219315-aacf4d0ef345"],
    summaries: [
      "Trial data shows promising vaccine efficacy.",
      "Mediterranean diet linked to heart health benefits.",
      "Nationwide mental health campaign kicks off."
    ],
    contents: [
      "Phase‑III results show strong protection and mild side effects.",
      "Longitudinal data associates the diet with lower cardiovascular risk.",
      "Hotlines and school programs aim for early support."
    ]
  },
  {
    name: "Entertainment",
    photos: ["1493225457124-a3eb161ffa5f","1514525253161-7a46d19cd819","1501281668745-f76f2b7d4a7d"],
    summaries: [
      "Blockbuster breaks opening‑weekend records.",
      "Beloved series announces its final season.",
      "City festival returns with record attendance."
    ],
    contents: [
      "Audiences praise practical effects and character‑driven story.",
      "Creators promise a conclusive arc and farewells.",
      "Headliners and new artists boost local business."
    ]
  },
  {
    name: "Sports",
    photos: ["1544551763-46a013bb70d5","1571019613454-1cb2f99b2d8b","1517649763962-0c623066013b"],
    summaries: [
      "Underdogs clinch title after dramatic finale.",
      "National record falls in 100‑meter sprint.",
      "New downtown sports complex opens to public."
    ],
    contents: [
      "An overtime goal sealed a historic championship.",
      "Technique changes credited for the record time.",
      "Courts, pools, and classes open for the community."
    ]
  },
  {
    name: "Business",
    photos: ["1554224155-6726b3ff858f","1551288049-bebda4e38f71","1496307042754-b4aa456c4a2d"],
    summaries: [
      "AI startup secures major growth investment.",
      "Markets edge to fresh highs on earnings beat.",
      "Brands adopt greener models to win loyalty."
    ],
    contents: [
      "Funds expand hiring and cloud capacity with privacy audits.",
      "Indexes rose on stronger guidance despite inflation concerns.",
      "Lower waste and better retention after supply‑chain redesigns."
    ]
  },
  {
    name: "Science",
    photos: ["1507413245164-6160d8298b31","1532187863486-abf9dbad1b69","1500530855697-b586d89ba3ee"],
    summaries: [
      "Rover finds mineral clues of ancient water.",
      "Lab boosts solar efficiency with new cells.",
      "Researchers catalog a vibrant rainforest species."
    ],
    contents: [
      "Hydrated minerals hint at past streams and habitable conditions.",
      "Tandem cells convert more sunlight; trials begin.",
      "Genetics confirm a new species, guiding conservation."
    ]
  },
  {
    name: "Education",
    photos: ["1523050854058-8df90110cfe1","1503676260728-1c00da094a0b","1513258496099-48168024aec0"],
    summaries: [
      "Online platform tops one million learners.",
      "Curriculum refresh centers critical thinking.",
      "University wins grant for teaching research."
    ],
    contents: [
      "Modular courses help workers reskill with certificates.",
      "Inquiry‑based projects measure real‑world problem solving.",
      "Longitudinal studies will track engagement and outcomes."
    ]
  }
];

const REPORTERS = [
  "Alice Nguyen","Bob Harris","Carla Gomez","David Lee","Emma Watson",
  "Farah Ali","George Martin","Hana Sato","Ibrahim Khan","Julia Chen"
];

const N = 60;

const news = Array.from({ length: N }).map((_, i) => {
  const cat = CATEGORIES[i % CATEGORIES.length];
  const sIdx = i % cat.summaries.length;
  const cIdx = (i + 1) % cat.contents.length; // เลื่อน index กันซ้ำกับสรุป
  const pIdx = i % cat.photos.length;
  return {
    id: String(i + 1),
    title: `News #${i + 1}`,
    summary: cat.summaries[sIdx],
    content: cat.contents[cIdx],
    status: "unverified",
    category: cat.name,
    reporter: REPORTERS[i % REPORTERS.length],
    reportedAt: new Date(Date.now() - i * 3600_000).toISOString(),
    imageUrl: U(cat.photos[pIdx])
  };
});

// ตัวอย่างโหวตบางรายการ (ที่เหลือ = ไม่มีโหวต → unverified)
const votes = [];
for (let i = 0; i < N; i++) {
  const id = String(i + 1);
  if (i % 5 === 0) votes.push({ newsId: id, fake: 2, notFake: 6 });
  else if (i % 5 === 1) votes.push({ newsId: id, fake: 5, notFake: 1 });
  else if (i % 5 === 2) votes.push({ newsId: id, fake: 2, notFake: 2 });
}

const comments = [
  { id: "c1", newsId: "1", isFake: false, text: "Evidence and sources look strong.", imageUrl: "", at: new Date().toISOString() }
];

const out = { news, comments, votes };
const outPath = path.join(__dirname, "..", "public", "data");
fs.mkdirSync(outPath, { recursive: true });
fs.writeFileSync(path.join(outPath, "db.json"), JSON.stringify(out, null, 2));
console.log(`✅ Wrote ${path.join("public","data","db.json")} with ${news.length} items (stable Unsplash images).`);

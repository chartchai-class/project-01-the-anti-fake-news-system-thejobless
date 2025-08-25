// scripts/generate-db.js
// Generate db.json (60 news items) with categories and proper status

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Categories for news
const CATEGORIES = ["Politics", "Technology", "Health", "Entertainment", "Sports", "Business", "Science", "Education"];

// Reporters
const REPORTERS = [
  "Alice Nguyen", "Bob Harris", "Carla Gomez", "David Lee", "Emma Watson",
  "Farah Ali", "George Martin", "Hana Sato", "Ibrahim Khan", "Julia Chen"
];

// Generate 60 news items with proper categories and status
const news = Array.from({ length: 60 }).map((_, i) => {
  const isFake = i % 3 === 0; // 1 in 3 news is fake
  const category = CATEGORIES[i % CATEGORIES.length];
  const reporter = REPORTERS[i % REPORTERS.length];
  
  return {
    id: String(i + 1),
    title: `News #${i + 1}`,
    summary: `Short summary for this ${category.toLowerCase()} news item.`,
    content: `Full content goes here describing the claim and evidence for this ${category.toLowerCase()} news.`,
    status: isFake ? "fake" : "not_fake",
    category: category,
    reporter: reporter,
    reportedAt: new Date(Date.now() - i * 3600_000).toISOString(),
    imageUrl: `https://picsum.photos/seed/${i+1}/800/400`
  };
});

// Sample comments
const comments = [
  { id: "c1", newsId: "1", isFake: false, text: "This is verified by official sources", imageUrl: "", at: new Date().toISOString() },
  { id: "c2", newsId: "1", isFake: false, text: "Multiple fact-checkers confirm this", imageUrl: "", at: new Date().toISOString() },
  { id: "c3", newsId: "2", isFake: true, text: "No credible sources found", imageUrl: "", at: new Date().toISOString() },
  { id: "c4", newsId: "2", isFake: true, text: "This has been debunked", imageUrl: "", at: new Date().toISOString() },
];

// Sample votes
const votes = [
  { newsId: "1", fake: 3, notFake: 5 },
  { newsId: "2", fake: 4, notFake: 1 },
  { newsId: "3", fake: 2, notFake: 0 },
  { newsId: "4", fake: 0, notFake: 0 },
];

const out = { news, comments, votes };
const outPath = path.join(__dirname, "..", "public", "data");

// Create directory if it doesn't exist
if (!fs.existsSync(outPath)) {
  fs.mkdirSync(outPath, { recursive: true });
}

fs.writeFileSync(path.join(outPath, "db.json"), JSON.stringify(out, null, 2));
console.log("✅ Wrote public/data/db.json with", news.length, "news items");
console.log("📊 Categories:", CATEGORIES.join(", "));
console.log("📈 Fake news ratio: 1 in 3");

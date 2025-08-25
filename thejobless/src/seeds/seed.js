import fs from "fs";
import path from "path";

const news = Array.from({ length: 60 }).map((_, i) => {
  const isFake = i % 3 === 0;
  return {
    id: String(i + 1),
    title: `News #${i + 1}`,
    summary: "Short summary for this news item.",
    content: "Full content goes here describing the claim and evidence.",
    status: isFake ? "fake" : "not_fake",
    reporter: ["Alice","Bob","Carol"][i % 3],
    reportedAt: new Date(Date.now() - i * 3600_000).toISOString(),
    imageUrl: `https://picsum.photos/seed/${i+1}/800/400`
  };
});

// ตัวอย่างคอมเมนต์ตั้งต้น (เพื่อโชว์ว่า list รวม mock+ใหม่ได้)
const comments = [
  { id:"c1", newsId:"1", isFake:true,  text:"Look suspicious", imageUrl:"",   at:new Date().toISOString() },
  { id:"c2", newsId:"1", isFake:false, text:"Officially denied", imageUrl:"", at:new Date().toISOString() },
  { id:"c3", newsId:"2", isFake:true,  text:"No source", imageUrl:"",         at:new Date().toISOString() },
];

const votes = [
  { newsId:"1", fake: 3, notFake: 5 },
  { newsId:"2", fake: 4, notFake: 1 }
];

const out = { news, comments, votes };
const outPath = path.join(process.cwd(), "public", "data");
fs.mkdirSync(outPath, { recursive: true });
fs.writeFileSync(path.join(outPath, "db.json"), JSON.stringify(out, null, 2));
console.log("✅ Wrote public/data/db.json with", news.length, "news");

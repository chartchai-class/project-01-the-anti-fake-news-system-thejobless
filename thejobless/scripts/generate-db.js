// Stable images via images.unsplash.com (no redirect), category‑matched,
// unvoted items start as "unverified"

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const U = (id) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=400&fit=crop&crop=center&auto=format&q=80`;

// Generic, visually appealing images that work for any news category
// Removed all broken images and replaced with working alternatives
const GENERIC_IMAGES = [
  "1557804506-669a67965ba0", // Abstract business/technology
  "1560472354-b33ff0c44a43", // Modern office building
  "1507003211169-0a1dd7228f2d", // City skyline
  "1554224155-6726b3ff858f", // Business/technology
  "1518186285589-2f7649de83e0", // Modern architecture
  "1517077304055-6e89abbf09b0", // Abstract patterns
  "1559757148-5c350d0d3c56", // Modern laboratory (replaced broken one)
  "1493225457124-a3eb161ffa5f", // Entertainment/arts (replaced broken one)
  "1514525253161-7a46d19cd819", // Modern media/technology (replaced broken one)
  "1544551763-46a013bb70d5", // Sports/athletics (replaced broken one)
  "1571019613454-1cb2f99b2d8b", // Modern sports facility
  "1517649763962-0c623066013b", // Abstract movement
  "1551288049-bebda4e38f71", // Modern corporate
  "1496307042754-b4aa456c4a2d", // Abstract business
  "1507413245164-6160d8298b31", // Science/research
  "1532187863486-abf9dbad1b69", // Modern laboratory
  "1500530855697-b586d89ba3ee", // Abstract nature/science
  "1503676260728-1c00da094a0b", // Modern classroom (replaced broken one)
  "1513258496099-48168024aec0"  // Abstract education (replaced broken one)
];

const CATEGORIES = [
  {
    name: "Politics",
    summaries: [
      "New policy proposal aims to reform national healthcare.",
      "Parliament debates stronger climate legislation.",
      "Election results hint at a shift in voter priorities."
    ],
    contents: [
      "Officials unveiled a healthcare plan expanding coverage and aiding rural hospitals. The comprehensive reform package includes provisions for mental health services and prescription drug cost controls, addressing long-standing gaps in the current system.",
      "Lawmakers discussed ambitious carbon targets with clean‑energy incentives. The proposed legislation would set binding emissions reductions while providing tax credits for renewable energy adoption and electric vehicle purchases.",
      "Analysts note higher youth turnout, reshaping party priorities. Exit polls reveal increased engagement among voters under 30, with climate change and education emerging as top concerns that influenced the final results."
    ]
  },
  {
    name: "Technology",
    summaries: [
      "AI breakthrough promises faster medical diagnostics.",
      "New battery design targets double‑day phone usage.",
      "Quantum team reports record coherence stability."
    ],
    contents: [
      "The model flags rare conditions from scans with high precision. Researchers trained the AI on over 100,000 medical images, achieving 95% accuracy in detecting early-stage diseases that human radiologists often miss.",
      "Prototype lithium‑sulfur cells show longer life; scaling underway. The new battery chemistry offers twice the energy density of current lithium-ion batteries while maintaining safety standards and reducing production costs.",
      "Longer qubit coherence advances practical error correction. Scientists achieved a 10-second coherence time, a critical milestone for building reliable quantum computers that can solve complex problems beyond classical computing capabilities."
    ]
  },
  {
    name: "Health",
    summaries: [
      "Trial data shows promising vaccine efficacy.",
      "Mediterranean diet linked to heart health benefits.",
      "Nationwide mental health campaign kicks off."
    ],
    contents: [
      "Phase‑III results show strong protection and mild side effects. The vaccine demonstrated 87% effectiveness against severe illness with only minor reactions like fatigue and soreness reported in less than 15% of participants.",
      "Longitudinal data associates the diet with lower cardiovascular risk. A 10-year study of 25,000 participants found that those following Mediterranean eating patterns had 30% fewer heart attacks and strokes compared to control groups.",
      "Hotlines and school programs aim for early support. The initiative includes 24/7 crisis intervention services, mental health education in schools, and training for teachers to recognize warning signs of depression and anxiety."
    ]
  },
  {
    name: "Entertainment",
    summaries: [
      "Blockbuster breaks opening‑weekend records.",
      "Beloved series announces its final season.",
      "City festival returns with record attendance."
    ],
    contents: [
      "Audiences praise practical effects and character‑driven story. The film grossed $180 million domestically in its first three days, surpassing previous records for the genre while earning critical acclaim for its innovative storytelling approach.",
      "Creators promise a conclusive arc and farewells. After seven successful seasons, the show's writers have crafted a final chapter that ties up all major plotlines while giving fans the emotional closure they've been anticipating.",
      "Headliners and new artists boost local business. The three-day event attracted over 150,000 visitors, generating an estimated $25 million in economic impact for local restaurants, hotels, and retail businesses."
    ]
  },
  {
    name: "Sports",
    summaries: [
      "Underdogs clinch title after dramatic finale.",
      "National record falls in 100‑meter sprint.",
      "New downtown sports complex opens to public."
    ],
    contents: [
      "An overtime goal sealed a historic championship. The underdog team, ranked last in preseason polls, completed their Cinderella run with a last-second score that secured their first title in 45 years, sparking city-wide celebrations.",
      "Technique changes credited for the record time. The sprinter's new training regimen focused on explosive starts and improved running mechanics, resulting in a time that broke the previous national record by 0.12 seconds.",
      "Courts, pools, and classes open for the community. The $15 million facility features Olympic-size swimming pools, indoor basketball courts, fitness centers, and specialized programs for youth development and senior wellness."
    ]
  },
  {
    name: "Business",
    summaries: [
      "AI startup secures major growth investment.",
      "Markets edge to fresh highs on earnings beat.",
      "Brands adopt greener models to win loyalty."
    ],
    contents: [
      "Funds expand hiring and cloud capacity with privacy audits. The Series B round of $50 million will fuel the company's expansion into new markets while maintaining their commitment to ethical AI development and transparent data practices.",
      "Indexes rose on stronger guidance despite inflation concerns. Corporate earnings exceeded analyst expectations by 8% on average, with technology and healthcare sectors leading the gains as investors focused on fundamental business performance.",
      "Lower waste and better retention after supply‑chain redesigns. Companies implementing circular economy principles reported 25% reduction in material costs and 40% improvement in customer satisfaction scores, proving sustainability can drive profitability."
    ]
  },
  {
    name: "Science",
    summaries: [
      "Rover finds mineral clues of ancient water.",
      "Lab boosts solar efficiency with new cells.",
      "Researchers catalog a vibrant rainforest species."
    ],
    contents: [
      "Hydrated minerals hint at past streams and habitable conditions. The discovery of clay minerals and sulfate deposits suggests that Mars once had flowing water for extended periods, potentially supporting microbial life forms billions of years ago.",
      "Tandem cells convert more sunlight; trials begin. The new photovoltaic technology combines multiple semiconductor layers to capture different wavelengths of light, achieving 32% efficiency compared to traditional single-layer cells at 22%.",
      "Genetics confirm a new species, guiding conservation. DNA analysis revealed a previously unknown tree frog species in the Amazon, highlighting the region's biodiversity and the urgent need for habitat protection as deforestation continues."
    ]
  },
  {
    name: "Education",
    summaries: [
      "Online platform tops one million learners.",
      "Curriculum refresh centers critical thinking.",
      "University wins grant for teaching research."
    ],
    contents: [
      "Modular courses help workers reskill with certificates. The platform's success stems from its adaptive learning algorithms and industry partnerships, with 85% of graduates reporting career advancement within six months of completing their programs.",
      "Inquiry‑based projects measure real‑world problem solving. The new curriculum emphasizes collaborative learning and practical applications, preparing students for careers that require creative thinking and adaptability in rapidly changing industries.",
      "Longitudinal studies will track engagement and outcomes. The $2.5 million grant will fund research into effective teaching methodologies, with the goal of improving student retention and academic performance across diverse learning environments."
    ]
  }
];

const REPORTERS = [
  "Alice Nguyen","Bob Harris","Carla Gomez","David Lee","Emma Watson",
  "Farah Ali","George Martin","Hana Sato","Ibrahim Khan","Julia Chen"
];

const N = 60;

// Add this helper function at the top
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateComments() {
  const comments = [];
  const commentTexts = [
    "This looks suspicious, I need more evidence",
    "I've seen this before, seems legitimate",
    "The source is questionable",
    "This is well-documented and verified",
    "I'm not convinced by this claim",
    "This has been fact-checked and confirmed",
    "The images seem manipulated",
    "I trust this source, they're reliable",
    "This needs more investigation",
    "I can confirm this is accurate",
    "The timeline doesn't add up",
    "This matches what I know about the topic",
    "I'm skeptical about these claims",
    "This is consistent with other reports",
    "The evidence is compelling",
    "I've fact-checked this myself",
    "This seems like misinformation",
    "I can verify this from multiple sources",
    "The claims are exaggerated",
    "This is backed by solid research",
    "I'm not buying this story",
    "This has been debunked before",
    "I trust the reporter on this one",
    "The evidence is too weak",
    "This aligns with official statements"
  ];
  
  // Generate comments for 20 selected news items
  const newsWithComments = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; // First 20 news items
  
  newsWithComments.forEach(newsId => {
    const numComments = Math.floor(Math.random() * 3) + 3; // 3-5 comments per selected news
    
    for (let j = 0; j < numComments; j++) {
      const isFake = Math.random() > 0.6; // 40% fake votes
      const hasImage = Math.random() > 0.7; // 30% have evidence images
      
      comments.push({
        id: `c${newsId}_${j}`,
        newsId: String(newsId),
        isFake,
        text: pick(commentTexts),
        imageUrl: hasImage ? `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000000)}?w=400&h=300&fit=crop&auto=format&q=80` : "",
        at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Random time within 30 days
      });
    }
  });
  
  return comments;
}

function generateVotes() {
  const votes = [];
  
  // Generate votes for each news item
  for (let i = 1; i <= 60; i++) {
    const fakeVotes = Math.floor(Math.random() * 50) + 5; // 5-54 fake votes
    const notFakeVotes = Math.floor(Math.random() * 50) + 5; // 5-54 not fake votes
    
    votes.push({
      newsId: String(i),
      fake: fakeVotes,
      notFake: notFakeVotes
    });
  }
  
  return votes;
}

const news = Array.from({ length: N }).map((_, i) => {
  const cat = CATEGORIES[i % CATEGORIES.length];
  const itemIndex = i % cat.summaries.length; // Use same index for summary and content
  const imageIndex = i % GENERIC_IMAGES.length; // Cycle through generic images
  
  return {
    id: String(i + 1),
    title: `News #${i + 1}`,
    summary: cat.summaries[itemIndex],
    content: cat.contents[itemIndex], // Now properly associated with summary
    status: "unverified",
    category: cat.name,
    reporter: REPORTERS[i % REPORTERS.length],
    reportedAt: new Date(Date.now() - i * 3600_000).toISOString(),
    imageUrl: U(GENERIC_IMAGES[imageIndex]) // Use generic images that work for any category
  };
});

// ตัวอย่างโหวตบางรายการ (ที่เหลือ = ไม่มีโหวต → unverified)
const votes = generateVotes();

const comments = generateComments();

const out = { news, comments, votes };
const outPath = path.join(__dirname, "..", "public", "data");
fs.mkdirSync(outPath, { recursive: true });
fs.writeFileSync(path.join(outPath, "db.json"), JSON.stringify(out, null, 2));
console.log(`✅ Wrote ${path.join("public","data","db.json")} with ${news.length} items (stable Unsplash images).`);

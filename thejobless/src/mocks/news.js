export const mockNews = Array.from({ length: 15 }).map((_, i) => ({
    id: String(i + 1),
    title: `News #${i + 1}`,
    summary: "Short summary for this news item.",
    content: "Full content goes here describing the claim and evidence.",
    status: i % 3 === 0 ? "fake" : "not_fake",
    reporter: ["Alice","Bob","Carol"][i % 3],
    reportedAt: new Date(Date.now() - i * 3600_000).toISOString(),
    imageUrl: `https://picsum.photos/seed/${i+1}/800/400`
  }))
  
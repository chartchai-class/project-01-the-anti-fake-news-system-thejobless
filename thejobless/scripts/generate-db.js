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

// Generate 60 news items with p

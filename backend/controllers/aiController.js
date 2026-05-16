import { asyncHandler } from "../utils/asyncHandler.js";
import { ENV } from "../utils/env.js";

const categories = ["water", "electricity", "road", "drainage", "garbage", "streetlight", "other"];

const fallbackInsights = (text = "") => {
  const normalized = text.toLowerCase();
  const category =
    (normalized.match(/water|pipe|tap|tank|leak/) && "water") ||
    (normalized.match(/light|streetlight|lamp/) && "streetlight") ||
    (normalized.match(/power|electric|wire|transformer/) && "electricity") ||
    (normalized.match(/road|pothole|street/) && "road") ||
    (normalized.match(/drain|sewer|overflow/) && "drainage") ||
    (normalized.match(/garbage|waste|trash/) && "garbage") ||
    "other";

  const priority = normalized.match(/danger|urgent|fire|accident|overflow|blocked/) ? "urgent" : "medium";

  return {
    category,
    priority,
    summary: text.slice(0, 160),
    source: "rules",
  };
};

const cleanJson = (content) =>
  String(content)
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

export const predictComplaint = asyncHandler(async (req, res) => {
  const { title = "", description = "" } = req.body;
  const text = `${title}\n${description}`.trim();

  if (!text) {
    return res.status(400).json({ message: "Title or description is required." });
  }

  if (!ENV.GOOGLE_API_KEY) {
    return res.json({ insight: fallbackInsights(text) });
  }

  try {
    const { ChatGoogleGenerativeAI } = await import("@langchain/google-genai");
    const llm = new ChatGoogleGenerativeAI({
      model: ENV.GEMINI_MODEL,
      temperature: 0,
      maxRetries: 2,
    });

    const response = await llm.invoke([
      [
        "system",
        `Return only JSON with category, priority, and summary. Category must be one of: ${categories.join(", ")}. Priority must be low, medium, high, or urgent.`,
      ],
      ["human", text],
    ]);

    const parsed = JSON.parse(cleanJson(response.content));
    const insight = {
      category: categories.includes(parsed.category) ? parsed.category : "other",
      priority: ["low", "medium", "high", "urgent"].includes(parsed.priority) ? parsed.priority : "medium",
      summary: parsed.summary || text.slice(0, 160),
      source: "gemini-langchain",
    };

    res.json({ insight });
  } catch {
    res.json({ insight: fallbackInsights(text) });
  }
});

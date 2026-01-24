import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import Document from "../models/Document.js"; // ✅ REQUIRED

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ FATAL ERROR: GEMINI_API_KEY not found");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-2.5-flash-lite";

/* ================= FLASHCARDS ================= */
export const generateFlashcards = async (text, count = 10) => {
  try {
    if (typeof text !== "string" || text.length < 20) {
      throw new Error("Text too short for flashcards");
    }

    const prompt = `
Generate exactly ${count} educational flashcards.

Format:
Q: Question
A: Answer
D: easy | medium | hard

Separate with ---
Text:
${text.substring(0, 12000)}
`;

    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const output = result.text;
    if (!output) throw new Error("Gemini returned empty flashcards");

    return output
      .split("---")
      .map(c => c.trim())
      .filter(Boolean)
      .map(card => {
        const q = card.match(/^Q:\s*(.*)/m)?.[1];
        const a = card.match(/^A:\s*(.*)/m)?.[1];
        const d = card.match(/^D:\s*(.*)/m)?.[1]?.toLowerCase() || "medium";
        if (!q || !a) return null;
        return { question: q, answer: a, difficulty: d };
      })
      .filter(Boolean)
      .slice(0, count);

  } catch (err) {
    console.error("Gemini Flashcard Error:", err);
    throw new Error("Flashcard generation failed");
  }
};

/* ================= QUIZ ================= */
export const generateQuiz = async (text, numQuestions = 5) => {
  try {
    if (typeof text !== "string" || text.length < 30) {
      throw new Error("Text too short for quiz generation");
    }

    const prompt = `
Generate exactly ${numQuestions} multiple choice questions.

Format:
Q: Question
01: Option 1
02: Option 2
03: Option 3
04: Option 4
C: Correct option number (01-04)
E: Short explanation
D: easy | medium | hard

Separate questions with ---
Text:
${text.substring(0, 12000)}
`;

    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const output = result.text;
    if (!output) throw new Error("Gemini returned empty quiz");

    return output
      .split("---")
      .map(b => b.trim())
      .filter(Boolean)
      .map(block => {
        const question = block.match(/^Q:\s*(.*)/m)?.[1];
        const options = [...block.matchAll(/^0[1-4]:\s*(.*)$/gm)].map(m => m[1]);
        const correctIndex = block.match(/^C:\s*(0[1-4])/m)?.[1];
        const explanation = block.match(/^E:\s*(.*)/m)?.[1];
        const difficulty = block.match(/^D:\s*(.*)/m)?.[1] || "medium";

        if (!question || options.length !== 4 || !correctIndex) return null;

        return {
          question,
          options,
          correctAnswer: options[Number(correctIndex) - 1],
          explanation,
          difficulty,
        };
      })
      .filter(Boolean)
      .slice(0, numQuestions);

  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    throw new Error("Quiz generation failed");
  }
};

/* ================= SUMMARY ================= */
export const generateSummary = async (text) => {
  try {
    if (typeof text !== "string" || text.trim().length < 10) {
      throw new Error("Text is too short to summarize");
    }

    const result = await ai.models.generateContent({
      model: MODEL,
      contents: `Summarize the following content clearly:\n\n${text.substring(0, 15000)}`,
    });

    if (!result.text) throw new Error("Gemini returned empty summary");

    return result.text;

  } catch (err) {
    console.error("Gemini Summary Error:", err);
    throw new Error("Summary generation failed");
  }
};

/* ================= EXPLAIN ================= */
export const explainConcept = async (req, res) => {
  try {
    const { documentId, concept } = req.body || {};

    if (!documentId || !concept) {
      return res.status(400).json({
        success: false,
        error: "documentId and concept are required",
      });
    }

    const doc = await Document.findById(documentId);

    if (!doc || !doc.extractedText) {
      return res.status(404).json({
        success: false,
        error: "Document not found or empty",
      });
    }

    const prompt = `
Explain "${concept}" using ONLY the document below.

Document:
${doc.extractedText.substring(0, 12000)}

Explain simply with examples:
`;

    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    res.json({
      success: true,
      explanation: result.text,
    });

  } catch (error) {
    console.error("EXPLAIN ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ================= CHAT ================= */
export const chatWithContext = async (req, res) => {
  try {
    const { documentId, question } = req.body || {};

    if (!documentId || !question) {
      return res.status(400).json({
        success: false,
        error: "documentId and question are required",
      });
    }

    const doc = await Document.findById(documentId);

    if (!doc || !doc.extractedText) {
      return res.status(404).json({
        success: false,
        error: "Document not found or empty",
      });
    }

    const prompt = `
Answer ONLY using the document below.

Document:
${doc.extractedText.substring(0, 12000)}

Question:
${question}
`;

    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    res.json({
      success: true,
      answer: result.text,
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

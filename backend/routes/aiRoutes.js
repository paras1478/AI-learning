import express from "express";
import {
  generateFlashcards,
  generateQuiz,
  generateSummary,
  chatWithContext,
  explainConcept,
} from "../controllers/aicontroller.js";
import protect from "../middleware/auth.js";

const router = express.Router();

/* Flashcards */
router.post("/generate-flashcards", protect, async (req, res) => {
  try {
    const { text, count } = req.body;
    const data = await generateFlashcards(text, count);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* Quiz */
router.post("/generate-quiz", protect, async (req, res) => {
  try {
    const { text, numQuestions } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: "text is required" });
    }
    const quiz = await generateQuiz(text, numQuestions || 5);
    res.json({ success: true, data: quiz });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* Summary */
router.post("/generate-summary", protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: "text is required" });
    }
    const summary = await generateSummary(text);
    res.json({ success: true, summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ✅ CHAT — controller handles req,res */
router.post("/chat", protect, chatWithContext);

/* ✅ EXPLAIN — controller handles req,res */
router.post("/explain-concept", protect, explainConcept);

export default router;

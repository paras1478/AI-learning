import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

/* ================= GENERATE FLASHCARDS ================= */
const generateFlashcards = async (documentId, options = {}) => {
  const response = await axiosInstance.post(
    API_PATHS.AI.GENERATE_FLASHCARDS,
    { documentId, ...options }
  );
  return response.data;
};

/* ================= GENERATE QUIZ ================= */
const generateQuiz = async (documentId, options = {}) => {
  const response = await axiosInstance.post(
    API_PATHS.AI.GENERATE_QUIZ,
    { documentId, ...options }
  );
  return response.data;
};

/* ================= GENERATE SUMMARY ================= */
const generateSummary = async (documentId) => {
  const response = await axiosInstance.post(
    API_PATHS.AI.GENERATE_SUMMARY,
    { documentId }
  );
  return response.data;
};

/* ================= CHAT ================= */
const chat = async (documentId, message) => {
  const response = await axiosInstance.post(
    API_PATHS.AI.CHAT,
    {
      documentId,
      question: message,
    }
  );
  return response.data;
};

/* ================= CHAT HISTORY ================= */
const getChatHistory = async (documentId) => {
  const response = await axiosInstance.get(
    API_PATHS.AI.CHAT_HISTORY(documentId)
  );
  return response.data;
};

/* ================= EXPLAIN CONCEPT ================= */
const explainConcept = async (documentId, concept) => {
  const response = await axiosInstance.post(
    API_PATHS.AI.EXPLAIN_CONCEPT,
    { documentId, concept }
  );
  return response.data;
};

/* ================= EXPORT ================= */
const aiService = {
   chat,
  getChatHistory,
  generateFlashcards,
  generateQuiz,
  generateSummary,
  explainConcept,
};

export default aiService;

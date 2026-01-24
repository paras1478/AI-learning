import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

/* ================= GENERATE FLASHCARDS ================= */
const generateFlashcards = async (documentId, options = {}) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.AI.GENERATE_FLASHCARDS,
      { documentId, ...options }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to generate flashcards",
      }
    );
  }
};

/* ================= GENERATE QUIZ ================= */
const generateQuiz = async (documentId, options = {}) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.AI.GENERATE_QUIZ,
      { documentId, ...options }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to generate quiz",
      }
    );
  }
};

/* ================= GENERATE SUMMARY ================= */
const generateSummary = async (documentId) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.AI.GENERATE_SUMMARY,
      { documentId }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to generate summary",
      }
    );
  }
};

/* ================= CHAT ================= */
const chat = async (documentId, message) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.AI.CHAT,
      {
        documentId,
        question: message,
      }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Chat request failed",
      }
    );
  }
};

/* ================= EXPLAIN CONCEPT ================= */
const explainConcept = async (documentId, concept) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.AI.EXPLAIN_CONCEPT,
      { documentId, concept }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to explain concept",
      }
    );
  }
};

/* ================= GET CHAT HISTORY ================= */
const getChatHistory = async (documentId) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.AI.GET_CHAT_HISTORY(documentId)
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch chat history",
      }
    );
  }
};

/* ================= EXPORT ================= */
const aiService = {
  generateFlashcards,
  generateQuiz,
  generateSummary,
  chat,
  explainConcept,
  getChatHistory,
};

export default aiService;

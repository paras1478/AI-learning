// ================= BASE =================
export const BASE_URL = "http://localhost:8000";

// ================= API PATHS =================
export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    GET_PROFILE: "/api/auth/profile",
    UPDATE_PROFILE: "/api/auth/profile",
    CHANGE_PASSWORD: "/api/auth/change-password",
  },

  DOCUMENTS: {
    UPLOAD: "/api/documents/upload",
    GET_DOCUMENTS: "/api/documents",
    GET_DOCUMENT_BY_ID: (id) => `/api/documents/${id}`,
    UPDATE_DOCUMENT: (id) => `/api/documents/${id}`,
    DELETE_DOCUMENT: (id) => `/api/documents/${id}`,
  },

  // ---------- AI ----------
  AI: {
    GENERATE_FLASHCARDS: "/api/ai/generate-flashcards",
    GENERATE_QUIZ: "/api/ai/generate-quiz",
    GENERATE_SUMMARY: "/api/ai/generate-summary",

    CHAT: "/api/ai/chat",
    EXPLAIN_CONCEPT: "/api/ai/explain-concept",

    GET_CHAT_HISTORY: (documentId) =>
      `/api/ai/chat-history/${documentId}`,
  },

  // ---------- FLASHCARDS ----------
  FLASHCARDS: {
    GET_ALL_FLASHCARD_SETS: "/api/flashcards",
    GET_FLASHCARDS_FOR_DOC: (documentId) =>
      `/api/flashcards/${documentId}`,

    REVIEW_FLASHCARD: (cardId) =>
      `/api/flashcards/${cardId}/review`,

    TOGGLE_STAR: (cardId) =>
      `/api/flashcards/${cardId}/star`,

    DELETE_FLASHCARD_SET: (id) =>
      `/api/flashcards/${id}`,
  },

  // ---------- QUIZZES ----------
  QUIZZES: {
    // create quiz manually
    CREATE_QUIZ: "/api/quizzes/create",

    // get all quizzes for a document
    GET_QUIZZES_FOR_DOC: (documentId) =>
      `/api/quizzes/${documentId}`,

    // get single quiz
    GET_QUIZ_BY_ID: (quizId) =>
      `/api/quizzes/quiz/${quizId}`,

    // submit quiz answers
    SUBMIT_QUIZ: (quizId) =>
      `/api/quizzes/${quizId}/submit`,

    // get quiz results
    GET_QUIZ_RESULTS: (quizId) =>
      `/api/quizzes/${quizId}/results`,

    // delete quiz
    DELETE_QUIZ: (quizId) =>
      `/api/quizzes/${quizId}`,
  },

  // ---------- PROGRESS ----------
  PROGRESS: {
    GET_DASHBOARD: "/api/progress/dashboard",
  },
};

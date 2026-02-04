export const BASE_URL = "http://localhost:8000";

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
    DELETE_DOCUMENT: (id) => `/api/documents/${id}`,
  },

  AI: {
    GENERATE_FLASHCARDS: "/api/ai/generate-flashcards",
    GENERATE_QUIZ: "/api/ai/generate-quiz",
    GENERATE_SUMMARY: "/api/ai/generate-summary",

    CHAT: "/api/ai/chat",
    EXPLAIN_CONCEPT: "/api/ai/explain-concept",

    GET_CHAT_HISTORY: (documentId) =>
      `/api/ai/chat-history/${documentId}`,
  },

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

  QUIZZES: {
    // AI generate quiz
    GENERATE_QUIZ: "/api/ai/generate-quiz",

    // Save quiz
    CREATE_QUIZ: "/api/quizzes",

    // Get quizzes for document
    GET_QUIZZES_FOR_DOCUMENT: (documentId) =>
      `/api/quizzes/document/${documentId}`,

    // Get quiz by id
    GET_QUIZ_BY_ID: (quizId) =>
      `/api/quizzes/${quizId}`,

    // Submit quiz
    SUBMIT_QUIZ: (quizId) =>
      `/api/quizzes/${quizId}/submit`,

    // Results
    GET_QUIZ_RESULTS: (quizId) =>
      `/api/quizzes/${quizId}/results`,

    // Delete quiz
    DELETE_QUIZ: (quizId) =>
      `/api/quizzes/${quizId}`,
  },

  DASHBOARD: {
    STATS: "/api/dashboard/stats",
  },
};

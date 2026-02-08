export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    GET_PROFILE: "/auth/profile",
    UPDATE_PROFILE: "/auth/profile",
    CHANGE_PASSWORD: "/auth/change-password",
  },

  DOCUMENTS: {
    UPLOAD: "/documents/upload",
    GET_DOCUMENTS: "/documents",
    GET_DOCUMENT_BY_ID: (id) => `/documents/${id}`,
    DELETE_DOCUMENT: (id) => `/documents/${id}`,
  },

  AI: {
    CHAT: "/ai/chat",
    CHAT_HISTORY: (documentId) => `/ai/chat-history/${documentId}`,
    GENERATE_FLASHCARDS: "/ai/generate-flashcards",
    GENERATE_QUIZ: "/ai/generate-quiz",
    GENERATE_SUMMARY: "/ai/generate-summary",
    EXPLAIN_CONCEPT: "/ai/explain-concept",
  },

  FLASHCARDS: {
    GET_ALL_FLASHCARD_SETS: "/flashcards",
    GET_FLASHCARDS_FOR_DOC: (documentId) => `/flashcards/${documentId}`,
    REVIEW_FLASHCARD: (cardId) => `/flashcards/${cardId}/review`,
    TOGGLE_STAR: (cardId) => `/flashcards/${cardId}/star`,
    DELETE_FLASHCARD_SET: (id) => `/flashcards/${id}`,
  },
QUIZZES: {
  CREATE_QUIZ: "/quizzes/create",
  GET_QUIZ_BY_ID: (id) => `/quizzes/quiz/${id}`,
  DELETE_QUIZ: (id) => `/quizzes/${id}`,
  SUBMIT_QUIZ: (id) => `/quizzes/${id}/submit`,
  GET_QUIZ_RESULTS: (id) => `/quizzes/${id}/results`,
  GET_QUIZZES_FOR_DOCUMENT: (documentId) =>
    `/quizzes/document/${documentId}`,
},

  DASHBOARD: {
    STATS: "/dashboard/stats",
  },
};

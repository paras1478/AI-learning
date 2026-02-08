import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const getAllFlashcardSets = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.FLASHCARDS.GET_ALL_FLASHCARD_SETS
    );
    return response.data.data || [];
  } catch (error) {
    throw error.response?.data || {
      message: "Failed to fetch flashcard sets",
    };
  }
};

const getFlashcardsForDocument = async (documentId) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.FLASHCARDS.GET_FLASHCARDS_FOR_DOC(documentId)
    );

    return Array.isArray(response.data.data)
      ? response.data.data
      : [];
  } catch (error) {
    throw error.response?.data || {
      message: "Failed to fetch flashcards",
    };
  }
};
const generateFlashcards = async (documentId, count = 10) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.AI.GENERATE_FLASHCARDS,
      { documentId, count }
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "AI could not generate flashcards"
      );
    }

    return response.data.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: error.message || "Unable to generate flashcards",
      }
    );
  }
};


const toggleStar = async (cardId) => {
  const response = await axiosInstance.put(
    API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId)
  );
  return response.data;
};

const deleteFlashcardSet = async (id) => {
  const response = await axiosInstance.delete(
    API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(id)
  );
  return response.data;
};

export default {
  getAllFlashcardSets,
  getFlashcardsForDocument,
  generateFlashcards,
  toggleStar,
  deleteFlashcardSet,
};

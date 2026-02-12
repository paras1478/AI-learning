import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const getAllFlashcardSets = async () => {
  const res = await axiosInstance.get(
    API_PATHS.FLASHCARDS.GET_ALL_FLASHCARD_SETS
  );
  return res.data.data || [];
};

const getFlashcardsForDocument = async (documentId) => {
  const res = await axiosInstance.get(
    API_PATHS.FLASHCARDS.GET_FLASHCARDS_FOR_DOC(documentId)
  );
  return res.data.data || [];
};

const generateFlashcards = async (documentId, count = 10) => {
  const res = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS, {
    documentId,
    count,
  });
  return res.data.data;
};

const toggleStar = async (cardId) =>
  axiosInstance.put(API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId));

const deleteFlashcardSet = async (id) =>
  axiosInstance.delete(API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(id));

export default {
  getAllFlashcardSets,
  getFlashcardsForDocument,
  generateFlashcards,
  toggleStar,
  deleteFlashcardSet,
};

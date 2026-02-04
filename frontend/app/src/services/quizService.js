import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

/* ================= GET ALL QUIZZES ================= */
const getQuizzesForDocument = async (documentId) => {
  const response = await axiosInstance.get(
    API_PATHS.QUIZZES.GET_QUIZZES_FOR_DOC(documentId)
  );
  return response.data;
};

/* ================= GET SINGLE QUIZ BY ID ================= */
const getQuizById = async (quizId) => {
  const response = await axiosInstance.get(
    API_PATHS.QUIZZES.GET_QUIZ_BY_ID(quizId)
  );
  return response.data;
};

/* ================= GENERATE QUIZ (AI) ================= */
const generateQuiz = async (documentId, numQuestions) => {
  const response = await axiosInstance.post(
    API_PATHS.AI.GENERATE_QUIZ,
    { documentId, numQuestions }
  );
  return response.data;
};

/* ================= CREATE QUIZ ================= */
const createQuiz = async (quizData) => {
  const response = await axiosInstance.post(
    API_PATHS.QUIZZES.CREATE_QUIZ,
    quizData
  );
  return response.data;
};

/* ================= DELETE QUIZ ================= */
const deleteQuiz = async (quizId) => {
  const response = await axiosInstance.delete(
    API_PATHS.QUIZZES.DELETE_QUIZ(quizId)
  );
  return response.data;
};

/* ================= SUBMIT QUIZ ================= */

const submitQuiz = async (quizId, answers) => {
  const response = await axiosInstance.post(
    API_PATHS.QUIZZES.SUBMIT_QUIZ(quizId),
    { answers }
  );
  return response.data;
};
/* ================= QUIZ RESULTS ================= */

const getQuizResults = async (quizId) => {
  const response = await axiosInstance.get(
    API_PATHS.QUIZZES.GET_QUIZ_RESULTS(quizId)
  );
  return response.data;
};


export default {
  getQuizzesForDocument,
  getQuizById,     
  generateQuiz,
  createQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizResults,
};

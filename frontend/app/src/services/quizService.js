import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const getQuizzesForDocument = async (documentId) => {
  const response = await axiosInstance.get(
    API_PATHS.QUIZZES.GET_QUIZZES_FOR_DOCUMENT(documentId)
  );
  return response.data.data;
};

const getQuizById = async (quizId) => {
  const response = await axiosInstance.get(
    API_PATHS.QUIZZES.GET_QUIZ_BY_ID(quizId)
  );
  return response.data.data;
};

const generateQuiz = async (documentId, numQuestions = 5) => {
  const response = await axiosInstance.post(
    API_PATHS.AI.GENERATE_QUIZ,
    { documentId, numQuestions }
  );
  return response.data.data;
};

const createQuiz = async (quizData) => {
  const response = await axiosInstance.post(
    API_PATHS.QUIZZES.CREATE_QUIZ,
    quizData
  );
  return response.data.data;
};

const deleteQuiz = async (quizId) => {
  const response = await axiosInstance.delete(
    API_PATHS.QUIZZES.DELETE_QUIZ(quizId)
  );
  return response.data;
};

const submitQuiz = async (quizId, answers) => {
  const response = await axiosInstance.post(
    API_PATHS.QUIZZES.SUBMIT_QUIZ(quizId),
    { answers }
  );
  return response.data;
};

const getQuizResults = async (quizId) => {
  const url = API_PATHS.QUIZZES.GET_QUIZ_RESULTS(quizId);
  console.log("🔥 RESULT API URL =>", url);

  const response = await axiosInstance.get(url);
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

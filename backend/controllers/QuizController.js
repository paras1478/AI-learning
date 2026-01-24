import Quiz from "../models/Quiz.js";

export const createQuiz = async (req, res) => {
  try {
    const { documentId, questions } = req.body;

    if (!documentId || !questions || !questions.length) {
      return res.status(400).json({
        success: false,
        message: "documentId and questions are required",
      });
    }

    const quiz = await Quiz.create({
      documentId,
      questions,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    console.error("Create Quiz Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get all quizzes for a document
 * @route   GET /api/quizzes/:documentId
 * @access  Private
 */
export const getQuizzes = async (req, res) => {
  try {
    const { documentId } = req.params;

    const quizzes = await Quiz.find({
      documentId,
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    console.error("Get Quizzes Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get single quiz by ID
 * @route   GET /api/quizzes/quiz/:id
 * @access  Private
 */
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    console.error("Get Quiz By ID Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Submit quiz answers
 * @route   POST /api/quizzes/:id/submit
 * @access  Private
 */
export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // array of answers
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    let score = 0;

    quiz.questions.forEach((q, index) => {
      if (answers?.[index] === q.correctAnswer) {
        score += 1;
      }
    });

    quiz.score = score;
    await quiz.save();

    res.json({
      success: true,
      score,
      total: quiz.questions.length,
    });
  } catch (error) {
    console.error("Submit Quiz Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get quiz results
 * @route   GET /api/quizzes/:id/results
 * @access  Private
 */
export const getQuizResults = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.json({
      success: true,
      score: quiz.score,
      total: quiz.questions.length,
      questions: quiz.questions,
    });
  } catch (error) {
    console.error("Get Quiz Results Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Delete a quiz
 * @route   DELETE /api/quizzes/:id
 * @access  Private
 */
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error("Delete Quiz Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

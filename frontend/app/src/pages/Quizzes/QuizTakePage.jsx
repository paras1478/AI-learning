import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import quizService from "../../services/quizService";
import Spinner from "../../components/common/Spinner";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";

const QuizTakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
const [activeTab, setActiveTab] = useState("Quizzes");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await quizService.getQuizById(quizId);
        setQuiz(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (loading) return <Spinner />;

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <div className="text-center mt-10">No quiz found</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress =
    ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleOptionChange = (qid, index) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qid]: index,
    }));
  };

 const handlePreviousQuestion = () => {
  if (currentQuestionIndex > 0) {
    setCurrentQuestionIndex((prev) => prev - 1);
  }
};

const handleNextQuestion = () => {
  if (currentQuestionIndex < quiz.questions.length - 1) {
    setCurrentQuestionIndex((prev) => prev + 1);
  }
};

const handleSubmitQuiz = async () => {
  try {
    setSubmitting(true);

    const formattedAnswers = Object.keys(selectedAnswers).map((questionId) => ({
      questionId,
      selectedOption: selectedAnswers[questionId],
    }));

    await quizService.submitQuiz(quizId, formattedAnswers);

    toast.success("Quiz submitted successfully!");

    navigate(`/quizzes/${quizId}/result`); 
  } catch (error) {
    console.error(error);
    toast.error("Failed to submit quiz");
  } finally {
    setSubmitting(false);
  }
};



  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* Header */}
<PageHeader
  title={`${quiz?.title || "Quiz"} - Quiz`}
  activeTab={activeTab}
  setActiveTab={setActiveTab}
/>
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span>{answeredCount} answered</span>
        </div>

        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border shadow-md p-6">

        <span className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
          ● Question {currentQuestionIndex + 1}
        </span>

        <h2 className="text-lg font-semibold mb-5">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected =
              selectedAnswers[currentQuestion._id] === index;

            return (
              <label
                key={index}
                className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition
                ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={currentQuestion._id}
                    checked={isSelected}
                    onChange={() =>
                      handleOptionChange(currentQuestion._id, index)
                    }
                  />
                  <span>{option}</span>
                </div>

                {isSelected && (
                  <CheckCircle2 className="text-emerald-500" size={18} />
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="secondary"
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
        >
          Previous
        </Button>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <Button onClick={handleSubmitQuiz} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizTakePage;

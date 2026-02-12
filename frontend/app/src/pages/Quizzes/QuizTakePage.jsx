import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import quizService from "../../services/quizService";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";

const QuizTakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await quizService.getQuizById(quizId);
        setQuiz(res);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (loading) return <Spinner />;

  if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    return <div className="text-center mt-10">No quiz found</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress =
    ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleOptionChange = (qid, value) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qid]: value,
    }));
  };

  const handleSubmitQuiz = async () => {
    try {
      setSubmitting(true);

      const answers = quiz.questions.map(
        (q) => selectedAnswers[q._id] ?? null
      );

      await quizService.submitQuiz(quizId, answers);

      toast.success("Quiz submitted successfully!");
      navigate(`/quizzes/${quizId}/results`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-3xl font-bold mb-6">Quiz</h2>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span>{answeredCount} answered</span>
        </div>

        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-md p-6">
        <h2 className="text-lg font-semibold mb-5">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected =
              selectedAnswers[currentQuestion._id] === option;

            return (
              <label
                key={index}
                className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer
                ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={currentQuestion._id}
                    value={option}
                    checked={isSelected}
                    onChange={() =>
                      handleOptionChange(currentQuestion._id, option)
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

      <div className="flex justify-between mt-6">
        <Button
          disabled={currentQuestionIndex === 0}
          onClick={() =>
            setCurrentQuestionIndex((prev) => prev - 1)
          }
        >
          Previous
        </Button>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <Button onClick={handleSubmitQuiz} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        ) : (
          <Button
            onClick={() =>
              setCurrentQuestionIndex((prev) => prev + 1)
            }
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizTakePage;

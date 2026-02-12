import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import quizService from "../../services/quizService";
import Spinner from "../../components/common/Spinner";
import {
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";

const QuizResultPage = () => {
  const { quizId } = useParams();

  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await quizService.getQuizResults(quizId);
        setResultsData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) return <Spinner />;

  const detailedResults = Array.isArray(resultsData?.results)
    ? resultsData.results
    : [];

  const total = detailedResults.length;
  const correct = detailedResults.filter((r) => r.isCorrect).length;
  const incorrect = total - correct;
  const score = resultsData?.quiz?.score ?? 0;

  const getScoreColor = (score) => {
    if (score >= 80) return "from-emerald-500 to-teal-500";
    if (score >= 60) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-red-500";
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return "Outstanding!";
    if (score >= 80) return "Great job!";
    if (score >= 70) return "Good work!";
    if (score >= 60) return "Not bad!";
    return "Keep practicing!";
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-3xl font-bold mb-4">Quiz-Result</h2>

      <div className="bg-white rounded-2xl shadow border p-6 text-center mb-6">
        <div
          className={`mx-auto w-32 h-32 rounded-full bg-gradient-to-r ${getScoreColor(
            score
          )} flex items-center justify-center text-white text-3xl font-bold mb-4`}
        >
          {score}%
        </div>

        <h2 className="text-xl font-semibold mb-2">
          {getScoreMessage(score)}
        </h2>

        <div className="flex justify-center gap-6 mt-4 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="text-emerald-500" size={18} />
            {correct} Correct
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="text-red-500" size={18} />
            {incorrect} Incorrect
          </div>
          <div className="flex items-center gap-1">
            <Trophy size={18} />
            {total} Questions
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {detailedResults.map((item, index) => (
          <div
            key={index}
            className={`p-4 border rounded-xl ${
              item.isCorrect
                ? "border-emerald-400 bg-emerald-50"
                : "border-red-400 bg-red-50"
            }`}
          >
            <h3 className="font-semibold mb-2">
              Q{index + 1}. {item.question}
            </h3>

            <p className="flex items-center gap-2">
              <strong>Your Answer:</strong>
              <span
                className={
                  item.isCorrect ? "text-emerald-700" : "text-red-700"
                }
              >
                {item.selectedAnswer || "Not answered"}
              </span>
            </p>

            {!item.isCorrect && (
              <p className="mt-1">
                <strong>Correct Answer:</strong>{" "}
                <span className="text-emerald-700">
                  {item.correctAnswer}
                </span>
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200"
        >
          <ArrowLeft size={16} />
          Back to document
        </Link>

        <Link
          to={`/quizzes/${quizId}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
        >
          <RotateCcw size={16} />
          Retry Quiz
        </Link>
      </div>
    </div>
  );
};

export default QuizResultPage;

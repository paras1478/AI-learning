import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import quizService from "../../services/quizService";
import Spinner from "../../components/common/Spinner";
import PageHeader from "../../components/common/PageHeader";
import toast from "react-hot-toast";
import {
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";

const QuizResultPage = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await quizService.getQuizResults(quizId);
        setResults(data); // already response.data
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch quiz results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) return <Spinner />;

  if (!results || !results.quiz || !results.results) {
    return <div className="text-center mt-10">Quiz results not found</div>;
  }

  const quiz = results.quiz;
  const detailedResults = results.results;

  const score = quiz.score;
  const total = detailedResults.length;
  const correct = detailedResults.filter((r) => r.isCorrect).length;
  const incorrect = total - correct;

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
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader title={`${quiz.title || "Quiz"} - Results`} />

      {/* Score Card */}
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

      {/* Question Review */}
     
            {/* Question Review Section */}
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


      {/* Actions */}
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

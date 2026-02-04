import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import quizService from "../../services/quizService";
import Spinner from "../common/Spinner";
import Button from "../common/Button";
import QuizCard from "./QuizCard";
import EmptyState from "../common/EmptyState";

const QuizManager = ({ documentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // ================= FETCH QUIZZES =================
  const fetchQuizzes = async () => {
    try {
      const response = await quizService.getQuizzesForDocument(documentId);
      setQuizzes(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [documentId]);

  // ================= GENERATE QUIZ =================
  const handleGenerateQuiz = async () => {
    setGenerating(true);
    try {
      await quizService.generateQuiz(documentId);
      toast.success("Quiz generated successfully");
      fetchQuizzes();
    } catch (error) {
      toast.error("Failed to generate quiz");
    } finally {
      setGenerating(false);
    }
  };

  // ================= DELETE QUIZ =================
  const handleDeleteQuiz = async (quizId) => {
    try {
      await quizService.deleteQuiz(quizId);
      setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
      toast.success("Quiz deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // ================= PLAY QUIZ =================
  const handlePlayQuiz = (quizId) => {
    window.location.href = `/quizzes/${quizId}`;
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quizzes</h2>

        <Button onClick={handleGenerateQuiz} disabled={generating}>
          <Plus size={16} />
          {generating ? "Generating..." : "Generate Quiz"}
        </Button>
      </div>

      {/* Content */}
      {quizzes.length === 0 ? (
        <EmptyState
          title="No Quizzes Found"
          description="Generate a quiz from this document to start practicing."
          actionLabel="Generate Quiz"
          onAction={handleGenerateQuiz}
          loading={generating}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz._id}
              quiz={quiz}
              onDelete={handleDeleteQuiz}
              onPlay={handlePlayQuiz}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizManager;

import React, { useEffect, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import quizService from "../../services/quizService";
import Spinner from "../common/Spinner";
import Button from "../common/Button";
import QuizCard from "./QuizCard";
import EmptyState from "../common/EmptyState";

const QuizManager = ({ documentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await quizService.getQuizzesForDocument(documentId);
      setQuizzes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!documentId) {
      setLoading(false);
      return;
    }
    fetchQuizzes();
  }, [documentId]);

  const handleGenerateQuiz = async () => {
    if (questionCount < 1 || questionCount > 10) {
      toast.error("Please enter a number between 1 and 10");
      return;
    }

    setGenerating(true);
    try {
      const newQuiz = await quizService.generateQuiz(
        documentId,
        questionCount
      );
      setQuizzes((prev) => [newQuiz, ...prev]);
      toast.success("Quiz generated successfully");
    } catch (err) {
      toast.error("Unable to generate quiz");
    } finally {
      setGenerating(false);
    }
  };

  const confirmDeleteQuiz = async () => {
    try {
      await quizService.deleteQuiz(deleteTarget._id);
      setQuizzes((prev) =>
        prev.filter((q) => q._id !== deleteTarget._id)
      );
      toast.success("Quiz deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handlePlayQuiz = (quizId) => {
    window.location.href = `/quizzes/${quizId}`;
  };

  if (loading) return <Spinner />;

  return (
    <>
      <div className="space-y-6">
        <Link to="/documents" className="flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Back to Documents
        </Link>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Quizzes</h2>

          <Button
            className="flex items-center gap-2"
            onClick={() => setShowGenerateModal(true)}
            disabled={generating}
          >
            <Plus />
            Generate Quiz
          </Button>
        </div>

        {quizzes.length === 0 ? (
          <EmptyState
            title="No Quizzes Found"
            description="Generate a quiz from this document to start practicing."
            actionLabel="Generate Quiz"
            onAction={() => setShowGenerateModal(true)}
            loading={generating}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz._id}
                quiz={quiz}
                onPlay={handlePlayQuiz}
                onDelete={() => setDeleteTarget(quiz)}
              />
            ))}
          </div>
        )}
      </div>

      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Generate Quiz</h3>

            <p className="text-sm text-slate-500 mb-4">
              How many questions do you want? (1–10)
            </p>

            <input
              type="number"
              min={1}
              max={10}
              value={questionCount}
              onChange={(e) =>
                setQuestionCount(Number(e.target.value))
              }
              className="w-full border rounded-xl px-4 py-2 mb-5"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 h-10 rounded-xl border"
              >
                Cancel
              </button>

              <button
                disabled={generating}
                onClick={async () => {
                  await handleGenerateQuiz();
                  setShowGenerateModal(false);
                }}
                className="px-4 h-10 rounded-xl bg-emerald-500 text-white"
              >
                {generating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">
              Delete Quiz?
            </h3>

            <p className="text-sm text-slate-500 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 h-10 rounded-xl border"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteQuiz}
                className="px-4 h-10 rounded-xl bg-red-500 text-white"
              >
                Delete Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuizManager;

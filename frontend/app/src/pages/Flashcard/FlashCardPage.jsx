import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import flashcardService from "@/services/flashCardService";

import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import Flashcard from "../../components/Flashcards/Flashcard";

const FlashcardPage = () => {
  const { id: documentId } = useParams();
  const navigate = useNavigate();

  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const sets = await flashcardService.getFlashcardsForDocument(documentId);
      setFlashcards(sets?.[0]?.cards || []);
    } catch {
      toast.error("Failed to fetch flashcards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    try {
      setGenerating(true);
      await flashcardService.generateFlashcards(documentId);
      toast.success("Flashcards generated");
      fetchFlashcards();
    } catch {
      toast.error("Unable to generate flashcards");
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      setFlashcards((prev) =>
        prev.map((c) =>
          c._id === cardId ? { ...c, isStarred: !c.isStarred } : c
        )
      );
    } catch {
      toast.error("Failed to update star");
    }
  };

  const handleDeleteSet = async () => {
    try {
      await flashcardService.deleteFlashcardSet(documentId);
      toast.success("Flashcard set deleted");
      navigate("/documents");
    } catch {
      toast.error("Failed to delete flashcard set");
    }
  };

  if (loading) return <Spinner />;

  if (!flashcards.length) {
    return (
      <EmptyState
        title="No Flashcards Yet"
        description="Generate flashcards from this document."
        actionLabel="Generate Flashcards"
        onAction={handleGenerateFlashcards}
        loading={generating}
      />
    );
  }

  const currentCard = flashcards[currentCardIndex];

  return (
    <>
      <div className="flex justify-center mt-6">
        <Flashcard card={currentCard} onToggleStar={handleToggleStar} />
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={() =>
            setCurrentCardIndex(
              (i) => (i - 1 + flashcards.length) % flashcards.length
            )
          }
        >
          <ChevronLeft />
        </Button>

        <span className="text-sm text-gray-500">
          {currentCardIndex + 1} / {flashcards.length}
        </span>

        <Button
          onClick={() =>
            setCurrentCardIndex((i) => (i + 1) % flashcards.length)
          }
        >
          <ChevronRight />
        </Button>
      </div>

      <div className="flex justify-center mt-6">
        <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
          Delete Set
        </Button>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button
                onClick={handleDeleteSet}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FlashcardPage;

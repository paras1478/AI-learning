import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";

import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import Flashcard from "../../components/Flashcards/Flashcard";

const FlashcardPage = () => {
  const { id: documentId } = useParams();
  const navigate = useNavigate();

  const [flashcardSet, setFlashcardSet] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
console.log("FlashcardPage mounted");
  /* FETCH */
  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const sets = await flashcardService.getFlashcardsForDocument(documentId);

      if (sets.length > 0) {
        setFlashcardSet(sets[0]);
        setFlashcards(sets[0].cards || []);
      } else {
        setFlashcards([]);
      }
    } catch {
      toast.error("Failed to fetch flashcards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      console.log("Document ID:", documentId);

    fetchFlashcards();
  }, [documentId]);

const handleGenerateFlashcards = async () => {
  setGenerating(true);
  try {
    const newSet = await flashcardService.generateFlashcards(documentId);

    console.log("FLASHCARD SET 👉", newSet);

    setFlashcardSets((prev) => [newSet, ...prev]);
    setSelectedSet(newSet); 
    setCurrentCardIndex(0);

    toast.success("Flashcards generated");
  } catch (err) {
    toast.error("Unable to generate flashcards");
    console.error(err);
  } finally {
    setGenerating(false);
  }
};



  const handleNext = () =>
    setCurrentCardIndex((i) => (i + 1) % flashcards.length);

  const handlePrev = () =>
    setCurrentCardIndex((i) => (i - 1 + flashcards.length) % flashcards.length);

  /* STAR */
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



  // ================= BACK =================
  const handleBackToDocument = () => {
    navigate(`/documents/${documentId}`);
  };

  // ================= DELETE SET =================
 const handleDeleteSet = async () => {
  try {
    await flashcardService.deleteFlashcardSet(documentId);
    toast.success("Flashcard set deleted");
    navigate("/documents");
  } catch (error) {
    toast.error("Failed to delete flashcard set");
  }
};


  // ================= NAVIGATION =================
  const handleNextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    setCurrentCardIndex(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length
    );
  };



  // ================= CONTENT =================
  const renderFlashcardContent = () => {
  if (loading) return <Spinner />;

  if (flashcards.length === 0) {
    return (
      <EmptyState
        title="No Flashcards Yet"
        description="Generate flashcards from this document to start learning."
        actionLabel="Generate Flashcards"
        onAction={handleGenerateFlashcards}
        loading={generating}
      />
    );
  }

  const currentCard = flashcards[currentCardIndex];

  return (
    <>
      {/* Flashcard */}
      <div className="flex justify-center mt-6">
        <Flashcard
          card={currentCard}
          onToggleStar={handleToggleStar}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6">
        <Button onClick={handlePrevCard}>
          <ChevronLeft />
        </Button>

        <span className="text-sm text-gray-500">
          {currentCardIndex + 1} / {flashcards.length}
        </span>

        <Button onClick={handleNextCard}>
          <ChevronRight />
        </Button>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl relative">

            {/* Close */}
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            {/* Icon */}
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 mb-4">
              <Trash2 className="text-red-500" />
            </div>

            <h2 className="text-lg font-semibold mb-2">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Delete this flashcard set? This cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteSet}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
 

}

export default FlashcardPage;
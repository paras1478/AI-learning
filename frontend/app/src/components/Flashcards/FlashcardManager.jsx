import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowLeft,
  Sparkles,
  Brain,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Modal from "../common/Modal";
import Flashcard from "./Flashcard";

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  /* FETCH */
  const fetchFlashcardSets = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashcardsForDocument(documentId);
      setFlashcardSets(response.data || []);
    } catch {
      toast.error("Failed to fetch flashcards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchFlashcardSets();
  }, [documentId]);

  /* GENERATE */
  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated!");
      fetchFlashcardSets();
    } catch {
      toast.error("Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  /* NAVIGATION */
  const handleNextCard = () => {
    if (currentCardIndex < selectedSet.cards.length - 1)
      setCurrentCardIndex((prev) => prev + 1);
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0)
      setCurrentCardIndex((prev) => prev - 1);
  };

  /* DELETE */
  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await flashcardService.deleteFlashcardSet(setToDelete._id);
      toast.success("Deleted");
      setSelectedSet(null);
      fetchFlashcardSets();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  /* VIEWER */
  const renderFlashcardViewer = () => {
    const currentCard = selectedSet.cards[currentCardIndex];

    return (
      <div className="p-6 space-y-6">
        <button onClick={() => setSelectedSet(null)} className="flex items-center gap-2">
          <ArrowLeft /> Back to Sets
        </button>

        <Flashcard flashcard={currentCard} />

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePrevCard}
            disabled={currentCardIndex === 0}
            className="px-4 py-2 border rounded-lg disabled:opacity-40"
          >
            <ChevronLeft /> Previous
          </button>

          <span>
            {currentCardIndex + 1} / {selectedSet.cards.length}
          </span>

          <button
            onClick={handleNextCard}
            disabled={currentCardIndex === selectedSet.cards.length - 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-40"
          >
            Next <ChevronRight />
          </button>
        </div>
      </div>
    );
  };

  /* LIST */
 const renderSetList = () => {
  if (loading) return <Spinner />;

  if (generating) {
    return (
      <div className="text-center p-10">
        <Spinner />
        <p className="mt-3 text-gray-600">Generating flashcards...</p>
      </div>
    );
  }

  if (!flashcardSets.length) {
    return (
      <div className="text-center p-10">
        <Brain className="mx-auto mb-3" />
        <button
          onClick={handleGenerateFlashcards}
          disabled={generating}
          className="bg-emerald-500 text-white px-4 py-2 rounded flex items-center gap-2 mx-auto disabled:opacity-50"
        >
          <Sparkles />
          {generating ? "Generating..." : "Generate Flashcards"}
        </button>
      </div>
    )}

    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2>Your Flashcard Sets</h2>
          <button
            onClick={handleGenerateFlashcards}
            className="bg-emerald-500 text-white px-4 py-2 rounded"
          >
            + Generate New Set
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {flashcardSets.map((set) => (
            <div
              key={set._id}
              onClick={() => {
                setSelectedSet(set);
                setCurrentCardIndex(0);
              }}
              className="relative p-5 border rounded-xl cursor-pointer hover:shadow"
            >
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="absolute top-3 right-3 text-red-500"
              >
                <Trash2 size={18} />
              </button>

              <h3 className="font-bold">Flashcard Set</h3>
              <p className="text-sm text-gray-500">
                {moment(set.createdAt).format("MMM D, YYYY")}
              </p>
              <span className="mt-2 inline-block bg-emerald-100 px-3 py-1 rounded">
                {set.cards.length} cards
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl border p-4">
      {selectedSet ? renderFlashcardViewer() : renderSetList()}

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <h2 className="text-xl font-bold">Delete this flashcard set?</h2>
        <p>This action cannot be undone.</p>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
          <button
            onClick={handleConfirmDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default FlashcardManager;

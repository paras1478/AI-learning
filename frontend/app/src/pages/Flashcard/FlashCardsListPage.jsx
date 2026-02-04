import React, { useState, useEffect, useCallback } from "react";
import flashcardService from "../../services/flashcardService";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import FlashcardSetCard from "../../components/Flashcards/FlashcardSetCard";
import toast from "react-hot-toast";

const FlashcardsListPage = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFlashcardSets = useCallback(async () => {
    try {
      const response = await flashcardService.getAllFlashcardSets();
      setFlashcardSets(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      toast.error("Failed to fetch flashcard sets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlashcardSets();
  }, [fetchFlashcardSets]);

  const handleDelete = async (id) => {
    try {
      await flashcardService.deleteFlashcardSet(id);

      setFlashcardSets((prev) =>
        prev.filter((set) => set._id !== id)
      );

      toast.success("Flashcard set deleted successfully");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold">My Flashcards</h2>
        <p className="text-gray-600">Review and manage your flashcard sets</p>
      </div>

      {/* Content */}
      {flashcardSets.length === 0 ? (
        <EmptyState
          title="No Flashcard Sets Found"
          description="You haven't created any flashcards yet."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {flashcardSets.map((set) => (
            <FlashcardSetCard
              key={set._id}
              flashcardSet={set}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashcardsListPage;

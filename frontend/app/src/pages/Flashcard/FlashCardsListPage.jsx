import React, { useState, useEffect, useCallback } from "react";
import flashcardService from "@/services/flashCardService";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import toast from "react-hot-toast";
import Flashcard from "../../components/Flashcards/Flashcard";

const FlashcardsListPage = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFlashcards = useCallback(async () => {
    try {
      setLoading(true);
      const data = await flashcardService.getAllFlashcardSets(); 
      setFlashcards(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch flashcards");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  const handleToggleStar = async (id) => {
    setFlashcards((prev) =>
      prev.map((card) =>
        card._id === id
          ? { ...card, isStarred: !card.isStarred }
          : card
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-1">My Flashcards</h2>
      <p className="text-gray-600 mb-6">
        Review and practice your flashcards
      </p>

      {flashcards.length === 0 ? (
        <EmptyState
          title="No Flashcards Found"
          description="You haven't created any flashcards yet."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {flashcards.map((card) => (
            <Flashcard
              key={card._id}
              flashcard={card}
              onToggleStar={handleToggleStar}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashcardsListPage;

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Brain, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import flashcardService from "@/services/flashCardService";
import Spinner from "../common/Spinner";
import Flashcard from "./Flashcard";

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [cardIndexBySet, setCardIndexBySet] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  const fetchFlashcardSets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await flashcardService.getAllFlashcardSets();
      setFlashcardSets(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to fetch flashcard sets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlashcardSets();
  }, [fetchFlashcardSets]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      const newSet = await flashcardService.generateFlashcards(documentId);
      setFlashcardSets((prev) => [newSet, ...prev]);
      toast.success("Flashcards generated successfully");
    } catch {
      toast.error("Unable to generate flashcards");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-3xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Your Flashcard Sets</h2>
          <p className="text-sm text-slate-500">
            {flashcardSets.length} sets available
          </p>
        </div>

        <button
          onClick={handleGenerateFlashcards}
          disabled={generating}
          className={`flex items-center gap-2 px-5 h-10 rounded-xl text-white ${
            generating
              ? "bg-emerald-400 cursor-not-allowed"
              : "bg-emerald-500 hover:bg-emerald-600"
          }`}
        >
          <Sparkles className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
          {generating ? "Generating..." : "Generate New Set"}
        </button>
      </div>

      <div className="space-y-6">
        {flashcardSets.map((set, index) => (
          <div key={set._id} className="space-y-4">
            <div
              onClick={() => {
                setOpenIndex(openIndex === index ? null : index);
                setCardIndexBySet((p) => ({ ...p, [index]: 0 }));
              }}
              className={`group relative border rounded-2xl p-6 cursor-pointer transition hover:shadow ${
                openIndex === index
                  ? "border-emerald-500 ring-2 ring-emerald-200"
                  : ""
              }`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTarget(set);
                }}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-red-500"
              >
                <Trash2 size={18} />
              </button>

              <Brain className="w-6 h-6 mb-3 text-emerald-500" />
              <p className="text-sm text-slate-500">
                Created {moment(set.createdAt).format("MMM D, YYYY")}
              </p>
              <p className="mt-2 font-semibold">
                {set.cards?.length || 0} cards
              </p>
            </div>

                  {openIndex === index && set.cards?.length > 0 && (
                 <div className="border rounded-3xl p-6">
                    <Flashcard
                    flashcard={set.cards[cardIndexBySet[index] ?? 0]}
                     />

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() =>
                      setCardIndexBySet((p) => ({
                        ...p,
                        [index]:
                          ((p[index] ?? 0) - 1 + set.cards.length) %
                          set.cards.length,
                      }))
                    }
                  >
                    <ChevronLeft />
                  </button>

                  <span className="text-sm">
                    {(cardIndexBySet[index] ?? 0) + 1} / {set.cards.length}
                  </span>

                  <button
                    onClick={() =>
                      setCardIndexBySet((p) => ({
                        ...p,
                        [index]:
                          ((p[index] ?? 0) + 1) % set.cards.length,
                      }))
                    }
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">
              Delete Flashcard Set?
            </h3>

            <p className="text-sm mb-6 text-slate-500">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 h-10 rounded-xl bg-slate-200"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (isDeleting) return;
                  setIsDeleting(true);
                  try {
                    await flashcardService.deleteFlashcardSet(deleteTarget._id);
                    setFlashcardSets((p) =>
                      p.filter((s) => s._id !== deleteTarget._id)
                    );
                    toast.success("Flashcard set deleted");
                  } catch {
                    toast.error("Delete failed");
                  } finally {
                    setIsDeleting(false);
                    setDeleteTarget(null);
                  }
                }}
                disabled={isDeleting}
                className={`px-4 h-10 rounded-xl text-white ${
                  isDeleting
                    ? "bg-red-300"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {isDeleting ? "Deleting..." : "Delete Set"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardManager;

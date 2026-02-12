import { useState } from "react";
import { Star, RotateCcw } from "lucide-react";

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  if (!flashcard) return null;

  return (
    <div className="relative w-full h-72" style={{ perspective: "1000px" }}>
      <div
        className="relative w-full h-full transition-transform duration-500 transform-gpu"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={handleFlip}
      >
        <div
          className="absolute inset-0 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 flex flex-col"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center
                ${
                  flashcard.isStarred
                    ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-white"
                    : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                }`}
            >
              <Star
                className="w-4 h-4"
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center px-4">
            <p className="text-lg font-semibold text-slate-900 text-center">
              {flashcard.question}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <RotateCcw className="w-4 h-4" />
            <span>Click to reveal answer</span>
          </div>
        </div>

        <div
          className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 flex flex-col"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className="w-9 h-9 rounded-xl bg-white/20 text-white hover:bg-white/30 flex items-center justify-center"
            >
              <Star
                className="w-4 h-4"
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center px-4">
            <p className="text-base font-medium text-white text-center">
              {flashcard.answer}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-white/80">
            <RotateCcw className="w-4 h-4" />
            <span>Click to see question</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;

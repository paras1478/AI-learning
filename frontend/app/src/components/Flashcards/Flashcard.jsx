import { useState } from "react";
import { Star, RotateCcw } from "lucide-react";

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flex justify-center">
      <div
        className="relative w-[500px] h-[280px] cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={handleFlip}
      >
        <div
          className="relative w-full h-full transition-transform duration-500 transform-gpu"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* FRONT (Question) */}
          <div
            className="absolute inset-0 bg-emerald-500 text-white rounded-2xl shadow-xl flex flex-col justify-between p-6"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {/* Star */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className="absolute top-4 right-4 bg-white/20 p-2 rounded-full"
            >
              <Star
                className="w-5 h-5"
                fill={flashcard.isStarred ? "yellow" : "none"}
              />
            </button>

            <div className="flex-1 flex items-center justify-center text-center text-lg font-semibold">
              {flashcard.question}
            </div>

            <div className="flex items-center justify-center gap-2 text-sm opacity-80">
              <RotateCcw className="w-4 h-4" />
              Click to see answer
            </div>
          </div>

          {/* BACK (Answer) */}
          <div
            className="absolute inset-0 bg-white border border-emerald-200 text-slate-800 rounded-2xl shadow-xl flex flex-col justify-between p-6"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {/* Star */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className="absolute top-4 right-4 bg-emerald-100 p-2 rounded-full"
            >
              <Star
                className="w-5 h-5 text-emerald-600"
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>

            <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-green-100">
  <p className="text-emerald-700 font-semibold text-lg">
    {flashcard.answer}
  </p>
</div>

            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <RotateCcw className="w-4 h-4" />
              Click to see question
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;

import { Play, Trash2 } from "lucide-react";
import moment from "moment";

const QuizCard = ({ quiz, onPlay, onDelete }) => {
  return (
    <div className="group relative border rounded-2xl p-5 hover:shadow transition">
      <button
        onClick={onDelete}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100
          text-red-500 hover:text-red-600 transition"
      >
        <Trash2 size={18} />
      </button>

      <h3 className="font-semibold mb-1">
        {quiz.title || "Document Quiz"}
      </h3>

      <p className="text-xs text-slate-500 mb-3">
        Created {moment(quiz.createdAt).format("MMM D, YYYY")}
      </p>

      <span className="inline-block text-xs bg-slate-100 px-3 py-1 rounded-full mb-4">
        {quiz.questions?.length || 0} Questions
      </span>

      <button
        onClick={() => onPlay(quiz._id)}
        className="w-full mt-2 flex items-center justify-center gap-2
          h-10 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600"
      >
        <Play size={16} />
        Start Quiz
      </button>
    </div>
  );
};

export default QuizCard;

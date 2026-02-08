import { Trash2, FileText, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(`/documents/${document._id}`);
  };

  return (
    <div
      onClick={goToDetails}
      className="group relative bg-white rounded-2xl border border-slate-200
                 p-5 cursor-pointer transition-all duration-300 ease-out
                 hover:-translate-y-2 hover:shadow-xl"
    >
      {/* Delete button (stop navigation) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); 
          onDelete();
        }}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100
                   text-slate-400 hover:text-red-500 transition"
      >
        <Trash2 size={18} />
      </button>

      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-emerald-500
                      flex items-center justify-center text-white mb-4">
        <FileText size={20} />
      </div>

      <h3 className="text-sm font-semibold text-slate-900 mb-1">
        {document.title}
      </h3>

      <p className="text-xs text-slate-500 mb-4">
        {(document.fileSize / 1024 / 1024).toFixed(1)} MB
      </p>

      <div className="flex gap-2 mb-4">
        <span className="px-2 py-1 text-xs rounded-md bg-purple-100 text-purple-600">
          📘 {document.flashcardsCount || 0} Flashcards
        </span>

        <span className="px-2 py-1 text-xs rounded-md bg-emerald-100 text-emerald-600">
          🧠 {document.quizCount || 0} Quizzes
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Clock size={14} />
        Uploaded {document.createdAt ? "recently" : ""}
      </div>
    </div>
  );
};

export default DocumentCard;

import React from "react";
import { Trash2, Play } from "lucide-react";
import Button from "../common/Button";

const QuizCard = ({ quiz, onDelete, onPlay }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg mb-2">{quiz.title}</h3>
        <p className="text-gray-500 text-sm">
          {quiz.questions?.length || 0} Questions
        </p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <Button onClick={() => onPlay(quiz._id)}>
          <Play size={16} />
        </Button>

        <button
          onClick={() => onDelete(quiz._id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 />
        </button>
      </div>
    </div>
  );
};

export default QuizCard;

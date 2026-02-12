import React from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 p-6 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
        >
          <X size={18} />
        </button>

        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          {title}
        </h3>

        <div className="max-h-[60vh] overflow-y-auto prose prose-slate max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

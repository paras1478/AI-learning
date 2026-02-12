import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, BookOpen, Lightbulb } from "lucide-react";
import toast from "react-hot-toast";

import Modal from "../common/Modal";
import aiService from "../../services/aiService";
import MarkdownRenderer from "../common/MarkdownRenderer";

const AIActions = () => {
  const { id: documentId } = useParams();

  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [concept, setConcept] = useState("");

  const handleGenerateSummary = async () => {
    try {
      setLoadingAction("summary");

      const response = await aiService.generateSummary(documentId);

      setModalTitle("Generated Summary");
      setModalContent(response.summary);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate summary");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplainConcept = async (e) => {
    e.preventDefault();

    if (!concept.trim()) {
      toast.error("Please enter a concept");
      return;
    }

    try {
      setLoadingAction("explain");

      const response = await aiService.explainConcept(documentId, concept);

      setModalTitle(`Explanation of "${concept}"`);
      setModalContent(response.explanation);
      setIsModalOpen(true);
      setConcept("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to explain concept");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl overflow-hidden">

        <div className="flex items-center gap-2 px-6 py-4 border-b bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
          <Sparkles />
          <h3 className="font-semibold">AI Actions</h3>
        </div>

        <div className="p-6 space-y-6">

          <div className="border rounded-xl p-4 shadow-sm bg-slate-50">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="text-blue-600" />
              <h4 className="font-semibold">Generate Summary</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Get a concise summary of the entire document.
            </p>

            <button
              onClick={handleGenerateSummary}
              disabled={loadingAction === "summary"}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {loadingAction === "summary" ? "Generating..." : "Generate Summary"}
            </button>
          </div>

          <div className="border rounded-xl p-4 shadow-sm bg-slate-50">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="text-yellow-500" />
              <h4 className="font-semibold">Explain Concept</h4>
            </div>

            <form onSubmit={handleExplainConcept} className="space-y-3">
              <input
                type="text"
                placeholder="Enter a concept (eg: React Hooks)"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400"
              />

              <button
                type="submit"
                disabled={loadingAction === "explain"}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {loadingAction === "explain" ? "Explaining..." : "Explain"}
              </button>
            </form>
          </div>

        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        <MarkdownRenderer content={modalContent} />
      </Modal>
    </>
  );
};

export default AIActions;

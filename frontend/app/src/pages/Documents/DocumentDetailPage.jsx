import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";

const DocumentDetailPage = () => {
  const { id } = useParams();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");

  // ================= FETCH DOCUMENT =================
   useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);
      } catch (error) {
        toast.error("Failed to fetch document details");
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [id]);


  // ================= PDF URL =================
  const getPdfUrl = () => {
    if (!document?.filePath) return null;

    if (
      document.filePath.startsWith("http://") ||
      document.filePath.startsWith("https://")
    ) {
      return document.filePath;
    }

const baseUrl =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

    return `${baseUrl}${document.filePath.startsWith("/") ? "" : "/"}${document.filePath}`;
  };

  // ================= TAB CONTENT =================
const renderContent = () => {
  if (!document?.filePath) return null;

  return (
    <iframe
      src={`http://localhost:8000${document.filePath}`}
      className="w-full h-[70vh] rounded-lg border"
      title="PDF Viewer"
    />
  );




    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">
            Document Viewer
          </span>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-emerald-600 hover:underline"
          >
            <ExternalLink size={14} />
            Open in new tab
          </a>
        </div>

        <iframe
          src={pdfUrl}
          title="PDF Viewer"
          className="w-full h-[70vh] rounded-lg border"
        />
      </div>
    );
  };

  const renderChat = () => (
    <div className="text-sm text-slate-500">Chat coming soon…</div>
  );

  const renderAIActions = () => (
    <div className="text-sm text-slate-500">AI actions coming soon…</div>
  );

  const renderFlashcards = () => (
    <div className="text-sm text-slate-500">Flashcards coming soon…</div>
  );

  const renderQuizzes = () => (
    <div className="text-sm text-slate-500">Quizzes coming soon…</div>
  );

  const tabs = [
    { name: "Content", render: renderContent },
    { name: "Chat", render: renderChat },
    { name: "AI Actions", render: renderAIActions },
    { name: "Flashcards", render: renderFlashcards },
    { name: "Quizzes", render: renderQuizzes },
  ];

  // ================= STATES =================
  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center py-20 text-slate-500">
        Document not found.
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/documents"
          className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {document.title}
          </h1>
          <p className="text-sm text-slate-500">
            {(document.fileSize / 1024 / 1024).toFixed(1)} MB
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`pb-3 text-sm font-medium ${
              activeTab === tab.name
                ? "border-b-2 border-emerald-600 text-emerald-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {tabs.find((t) => t.name === activeTab)?.render()}
      </div>
    </div>
  );
};

export default DocumentDetailPage;

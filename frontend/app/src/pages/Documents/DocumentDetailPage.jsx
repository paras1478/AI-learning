import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import AIActions from "../../components/Ai/AIAction";
import FlashCardManager from "../../components/Flashcards/FlashcardManager";
import QuizManager from "../../components/quizzes/QuizManager";


import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import PageHeader from "../../components/common/PageHeader";
import ChatInterface from "../../components/chat/ChatInterFace";

const DocumentDetailPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);
      } catch {
        toast.error("Failed to fetch document");
      } finally {
        setLoading(false);
      }
    };
    fetchDocumentDetails();
  }, [id]);

  if (loading) return <Spinner />;
  if (!document) return <p>Document not found</p>;

const pdfUrl = `http://localhost:8000${document.filePath}`;


  const renderContent = () => (
    <iframe
      src={pdfUrl}
      title="PDF Viewer"
      className="w-full h-[70vh] border rounded"
      style={{ colorScheme: "light" }}
    />
  );

  const renderChat = () => {
    return <ChatInterface />;
  };

  const renderAIActions = () => {
     return <AIActions />
  }


  const renderFlashcardsTab = () => {
    return <FlashCardManager documentId={id} />
  }
  const renderQuizzesTab = () => {
      return <QuizManager documentId={id} />;

  }

  const tabs = [
    { name: "Content", content: renderContent() },
    { name: "Chat", content: renderChat() },
    { name: "AI Actions", content: renderAIActions() },
    { name: "Flashcards", content: renderFlashcardsTab() },
    { name: "Quizzes", content: renderQuizzesTab() },
  ];

  const activeTabContent = tabs.find(
    (tab) => tab.name === activeTab
  )?.content;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Link to="/documents" className="flex items-center gap-1 text-sm">
        <ArrowLeft size={16} /> Back to Documents
      </Link>

      <PageHeader
        title={document.title}
        subtitle={`${(document.fileSize / 1024 / 1024).toFixed(1)} MB`}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pdfUrl={pdfUrl}
      />

      {/* TAB CONTENT */}
      {activeTabContent}
    </div>
  );
};

export default DocumentDetailPage;

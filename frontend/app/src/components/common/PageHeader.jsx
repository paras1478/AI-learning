import React from "react";
import { ExternalLink } from "lucide-react";

const PageHeader = ({ title, subtitle, activeTab, setActiveTab, pdfUrl }) => {
  const tabs = ["Content", "Chat", "AI Actions", "Flashcards", "Quizzes"];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="flex gap-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-emerald-600 text-emerald-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Content" && (
        <div className="flex justify-between items-center bg-slate-50 p-3 rounded">
          <span className="text-sm font-medium">Document Viewer</span>

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
      )}
    </div>
  );
};

export default PageHeader;

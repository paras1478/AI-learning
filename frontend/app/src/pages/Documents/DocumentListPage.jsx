import React, { useEffect, useState } from "react";
import { Plus, FileText, Upload, X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import DocumentCard from "../../components/documents/DocumentCard";

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDoc) return;

    try {
      setDeleting(true);
      await documentService.deleteDocument(selectedDoc._id);
      setDocuments((prev) =>
        prev.filter((doc) => doc._id !== selectedDoc._id)
      );
      toast.success("Document deleted");
      setIsDeleteOpen(false);
      setSelectedDoc(null);
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files allowed");
      return;
    }

    setUploadFile(file);
    setUploadTitle(file.name.replace(".pdf", ""));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uploadTitle || !uploadFile) {
      toast.error("Title and PDF file required");
      return;
    }

    const formData = new FormData();
    formData.append("title", uploadTitle);
    formData.append("file", uploadFile);

    try {
      setUploading(true);
      await documentService.uploadDocument(formData);
      toast.success("Document uploaded");
      setIsUploadOpen(false);
      setUploadTitle("");
      setUploadFile(null);
      fetchDocuments();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      );
    }

    if (documents.length === 0) {
      return (
        <div className="text-center py-24">
          <FileText className="w-14 h-14 mx-auto text-slate-400 mb-6" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">
            No Documents Yet
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Upload your first PDF to get started
          </p>
          <Button onClick={() => setIsUploadOpen(true)}>
            <Plus className="w-4 h-4" />
            Upload Document
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <DocumentCard
            key={doc._id}
            document={doc}
            onDelete={() => handleDelete(doc)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              My Documents
            </h1>
            <p className="text-sm text-slate-500">
              Manage and organize your learning materials
            </p>
          </div>

          <Button onClick={() => setIsUploadOpen(true)}>
            <Plus className="w-4 h-4" />
            Upload Document
          </Button>
        </div>

        {renderContent()}
      </div>

      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-xl">
            <button
              onClick={() => setIsUploadOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold text-slate-900">
              Upload New Document
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Add a PDF document to your library
            </p>

            <form onSubmit={handleUpload} className="space-y-5">
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="Document title"
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />

              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer hover:border-emerald-500">
                <input
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={handleFileChange}
                />
                <Upload className="w-6 h-6 text-emerald-600" />
                <p className="text-sm text-emerald-600">
                  Click to upload PDF
                </p>
                {uploadFile && (
                  <p className="text-xs text-slate-600">
                    {uploadFile.name}
                  </p>
                )}
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="flex-1 h-11 rounded-lg border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 h-11 rounded-lg bg-emerald-600 text-white"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-xl">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="absolute right-4 top-4 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>

            <h2 className="text-lg font-semibold mb-2">
              Confirm Deletion
            </h2>

            <p className="text-sm text-slate-600 mb-6">
              Delete{" "}
              <span className="font-semibold">
                {selectedDoc?.title}
              </span>
              ? This cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="flex-1 h-11 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 h-11 rounded-lg bg-red-600 text-white"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentListPage;

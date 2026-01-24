import express from "express";
import multer from "multer";
import path from "path";
import Document from "../models/Document.js";

import {
  uploadDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
} from "../controllers/documentcontroller.js";

import protect from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ dest: "uploads/documents" });

// Upload
router.post("/upload", protect, upload.single("file"), uploadDocument);

// Get all documents
router.get("/", protect, getDocuments);

// Get single document
router.get("/:id", protect, getDocument);

// Update document
router.put("/:id", protect, updateDocument);

// Delete document
router.delete("/:id", protect, deleteDocument);

// ✅ DOWNLOAD DOCUMENT (force download)
router.get("/download/:id", protect, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const filePath = path.join(process.cwd(), document.filePath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment"); // force download
    res.sendFile(filePath);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Download failed" });
  }
});

export default router;

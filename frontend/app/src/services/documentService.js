import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const getDocuments = async () => {
  const res = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENTS);
  return res.data;
};

const uploadDocument = async (formData) => {
  const res = await axiosInstance.post(
    API_PATHS.DOCUMENTS.UPLOAD,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
};

const deleteDocument = async (id) => {
  const res = await axiosInstance.delete(
    API_PATHS.DOCUMENTS.DELETE_DOCUMENT(id)
  );
  return res.data;
};

const getDocumentById = async (id) => {
  const res = await axiosInstance.get(
    API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(id)
  );
  return res.data;
};

export default {
  getDocuments,
  uploadDocument,
  deleteDocument,
  getDocumentById,
};

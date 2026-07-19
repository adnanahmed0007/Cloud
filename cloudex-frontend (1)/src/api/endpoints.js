import api, { SERVER_URL } from "./axios";

/* ---------------------------------------------------------------------- *
 * Every function here maps 1:1 to a route in routes/SignupRoute.js.
 * Nothing on the backend was changed — this file is purely a typed,
 * friendly wrapper around the existing Express endpoints.
 * ---------------------------------------------------------------------- */

// --- Auth ---------------------------------------------------------------
export const signup = (name, email, password) =>
  api.post("/signup", { name, email, password });

export const login = (email, password) =>
  api.post("/login", { email, password });

export const updatePassword = (password, newpassword) =>
  api.patch("/updatepassword", { password, newpassword });

// --- Files ----------------------------------------------------------------
export const uploadFile = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
};

export const getAllFiles = () => api.get("/getall");

export const getFiles = ({ page = 1, limit = 10, sort = "newest" } = {}) =>
  api.get("/files", { params: { page, limit, sort } });

export const getTrashedFiles = () => api.get("/filestrashed");

export const searchFiles = (fileName) =>
  api.get("/search", { params: { fileName } });

export const trashFile = (id) => api.delete(`/delete/${id}`);

export const restoreFile = (id) => api.patch(`/restore/${id}`);

export const permanentlyDeleteFile = (id) => api.delete(`/trash/${id}`);

export const renameFile = (id, originalName) =>
  api.post(`/rename/${id}`, { originalName });

export const shareFile = (id) => api.post(`/share/${id}`);

export const getDashboard = () => api.get("/apidashboard");

// Downloads return a raw file stream, so we ask axios for a blob and let
// the browser save it, instead of trying to parse it as JSON.
export const downloadFile = (id) =>
  api.get(`/download/${id}`, { responseType: "blob" });

// Public share links point at GET /auth/api/sharedonwload/:token and need
// no auth token, so this hits the server directly rather than going
// through the axios instance's Authorization header.
export const publicDownloadUrl = (token) =>
  `${SERVER_URL}/auth/api/sharedonwload/${token}`;

export const triggerBrowserDownload = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "download";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

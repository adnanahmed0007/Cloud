import express from "express";
import SignupController from "../controllers/SignupController.js";
import Login from "../controllers/LoginController.js";
import verifyJwt from "../middleware/Verifyjwt.js";
import upload from "../middleware/UploadFileMiddelware.js";
import UploadFile from "../controllers/UploadFile.js";
import GetAllfile from "../controllers/GetAllfiles.js";
import DeleteFile from "../controllers/DeleteFile.js";
import Downloadfile from "../controllers/Downloadfile.js";
import RenameFile from "../controllers/RenamFile.js";
import SearchFile from "../controllers/SearchFile.js";
import Pagination from "../controllers/Pginationfile.js";
import Trashed from "../controllers/GetTrashedfile.js";
import RestoreFile from "../controllers/RestoreFile.js";
import PermanentDelete from "../controllers/DeletePermanently.js";
import ApiDashboard from "../controllers/ApiDashboard.js";
import rateLimiter from "../middleware/Ratelimiter.js";
import updatePassword from "../controllers/UpdatePassword.js";
import Sharefile from "../controllers/ShareFile.js";
import dowloandlink from "../controllers/DownloadLink.js";
const Route = express.Router();
Route.post("/signup", rateLimiter, SignupController);
Route.post("/login", rateLimiter, Login)
Route.patch("/updatepassword", rateLimiter, updatePassword);
Route.post("/upload", verifyJwt, rateLimiter, upload.single("file"), UploadFile);
Route.get("/getall", verifyJwt, GetAllfile);
Route.get("/delete/:id", verifyJwt, DeleteFile);
Route.get("/download/:id", verifyJwt, Downloadfile)
Route.post("/rename/:id", verifyJwt, RenameFile)
Route.get("/search", verifyJwt, SearchFile)
Route.get("/files", verifyJwt, Pagination)
Route.get("/filestrashed", verifyJwt, Trashed)
Route.patch("/restore/:id", verifyJwt, RestoreFile);
Route.delete("/trash/:id", verifyJwt, PermanentDelete);
Route.get("/apidashboard", verifyJwt, ApiDashboard);
Route.post("/share/:id", verifyJwt, Sharefile);
Route.get("/sharedonwload/:token", dowloandlink);
export default Route;

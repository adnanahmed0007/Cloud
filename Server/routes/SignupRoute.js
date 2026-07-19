import express from "express";
import SignupController from "../controllers/Authentication/SignupController.js";
import Login from "../controllers/Authentication/LoginController.js";
import updatePassword from "../controllers/Authentication/UpdatePassword.js";
import verifyJwt from "../middleware/Verifyjwt.js";
import upload from "../middleware/UploadFileMiddelware.js";
import UploadFile from "../controllers/UserUpload/UploadFile.js";
import GetAllfile from "../controllers/UserUpload/GetAllfiles.js";
import DeleteFile from "../controllers/UserUpload/DeleteFile.js";
import Downloadfile from "../controllers/UserUpload/Downloadfile.js";
import RenameFile from "../controllers/UserUpload/RenamFile.js";
import SearchFile from "../controllers/UserUpload/SearchFile.js";
import Pagination from "../controllers/UserUpload/Pginationfile.js";
import Trashed from "../controllers/UserUpload/GetTrashedfile.js";
import RestoreFile from "../controllers/UserUpload/RestoreFile.js";
import PermanentDelete from "../controllers/UserUpload/DeletePermanently.js";
import ApiDashboard from "../controllers/UserUpload/ApiDashboard.js";
import rateLimiter from "../middleware/Ratelimiter.js";

import Sharefile from "../controllers/UserUpload/ShareFile.js";
import dowloandlink from "../controllers/UserUpload/DownloadLink.js";

const Route = express.Router();
Route.post("/signup", rateLimiter, SignupController);
Route.post("/login", rateLimiter, Login)
Route.patch("/updatepassword", verifyJwt, rateLimiter, updatePassword);
Route.post("/upload", verifyJwt, rateLimiter, upload.single("file"), UploadFile);
Route.get("/getall", verifyJwt, GetAllfile);
Route.delete("/delete/:id", verifyJwt, DeleteFile);
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

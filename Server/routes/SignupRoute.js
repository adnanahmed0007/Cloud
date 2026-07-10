import express from "express";
import SignupController from "../controllers/SignupController.js";
import Login from "../controllers/LoginController.js";
import verifyJwt from "../middleware/Verifyjwt.js";
import upload from "../middleware/UploadFileMiddelware.js";
import UploadFile from "../controllers/UploadFile.js";
import GetAllfile from "../controllers/GetAllfiles.js";
import DeleteFile from "../controllers/DeleteFile.js";
import Downloadfile from "../controllers/Downloadfile.js";

const Route = express.Router();
Route.post("/signup", SignupController);
Route.post("/login", Login)
Route.post("/upload", verifyJwt, upload.single("file"), UploadFile);
Route.get("/getall", verifyJwt, GetAllfile);
Route.delete("/delete/:id", verifyJwt, DeleteFile);
Route.get("/download/:id", verifyJwt, Downloadfile)
export default Route;

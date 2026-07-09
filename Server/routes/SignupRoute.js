import express from "express";
import SignupController from "../controllers/SignupController.js";
import Login from "../controllers/LoginController.js";
import verifyJwt from "../middleware/Verifyjwt.js";
import upload from "../middleware/UploadFileMiddelware.js";
import UploadFile from "../controllers/UploadFile.js";

const Route = express.Router();
Route.post("/signup", SignupController);
Route.post("/login", Login)
Route.post("/upload", verifyJwt, upload.single("file"), UploadFile);
export default Route;

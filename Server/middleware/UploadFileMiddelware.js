import multer from "multer";
import path from "path";
import fs from "fs";


const folders = [
    "uploads/images",
    "uploads/pdfs",
    "uploads/videos",
    "uploads/documents",
    "uploads/others"
];
folders.forEach(folder => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
});

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        let folder = "uploads/others";

        if (file.mimetype.startsWith("image/")) {
            folder = "uploads/images";
        }
        else if (file.mimetype === "application/pdf") {
            folder = "uploads/pdfs";
        }
        else if (file.mimetype.startsWith("video/")) {
            folder = "uploads/videos";
        }
        else if (
            file.mimetype.includes("word") ||
            file.mimetype.includes("document") ||
            file.mimetype === "text/plain"
        ) {
            folder = "uploads/documents";
        }

        cb(null, folder);
    },

    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },

});
console.log(storage)

const upload = multer({
    storage,
});

export default upload;
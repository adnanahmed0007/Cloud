import multer from "multer";
import path from "path";
import fs from "fs";


if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
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
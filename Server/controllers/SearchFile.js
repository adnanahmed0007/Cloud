import UploadFileModel from "../models/UploadModel.js";

const SearchFile = async (req, res) => {
    try {
        const { fileName } = req.query;

        if (!fileName) {
            return res.status(400).json({
                success: false,
                message: "File name is required."
            });
        }

        const searchFiles = await UploadFileModel.find({
            owner: req.user._id,
            originalName: {
                $regex: fileName,
                $options: "i"
            }
        });

        if (searchFiles.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No matching files found."
            });
        }

        return res.status(200).json({
            success: true,
            totalFiles: searchFiles.length,
            files: searchFiles
        });

    } catch (e) {
        console.error(e);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export default SearchFile;
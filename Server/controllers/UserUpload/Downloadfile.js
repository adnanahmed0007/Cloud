import UploadFileModel from "../../models/UploadModel.js";
import fs from "fs";
const Downloadfile = async (req, res) => {
    try {
        const { id } = req.params;
        const findFile = await UploadFileModel.findById(id);

        if (!findFile) {
            return res
                .status(404)
                .json({
                    message: "file not found"
                })
        }
        if (findFile.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to dowload  this file."
            });
        }
        if (!fs.existsSync(findFile.filePath)) {
            return res.status(404).json({
                success: false,
                message: "File not found on server."
            });
        }
        return res.download(
            findFile.filePath,
            findFile.originalName
        );


    }
    catch (e) {
        console.error(e);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
export default Downloadfile;
import UploadFileModel from "../models/UploadModel.js";
import fs from "fs";
const DeleteFile = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
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
                message: "You are not allowed to delete this file."
            });
        }
        if (fs.existsSync(findFile.filePath)) {
            fs.unlinkSync(findFile.filePath);
        }

        await UploadFileModel.findByIdAndDelete(id);
        req.user.storageUsed = Math.max(
            0,
            req.user.storageUsed - findFile.fileSize
        );

        await req.user.save();
        return res.status(200).json({
            success: true,
            message: "File deleted successfully.",
            deletedFile: {
                id: findFile._id,
                name: findFile.originalName
            },
            storage: {
                usedBytes: req.user.storageUsed,
                remainingBytes: req.user.storageLimit - req.user.storageUsed,
                limitBytes: req.user.storageLimit,

                usedMB: (req.user.storageUsed / (1024 * 1024)).toFixed(2),
                remainingMB: (
                    (req.user.storageLimit - req.user.storageUsed) /
                    (1024 * 1024)
                ).toFixed(2),

                usedPercentage: (
                    (req.user.storageUsed /
                        req.user.storageLimit) *
                    100
                ).toFixed(2)
            }
        });

    }
    catch (e) {
        console.error(e);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
export default DeleteFile;
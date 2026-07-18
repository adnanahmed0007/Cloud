import UploadFileModel from "../../models/UploadModel.js";
import redisClient from "../../config/redis.js";

const UploadFile = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a file."
            });
        }


        if (req.user.storageUsed + req.file.size > req.user.storageLimit) {
            return res.status(400).json({
                success: false,
                message: "Storage limit exceeded."
            });
        }


        const file = new UploadFileModel({
            owner: req.user._id,
            originalName: req.file.originalname,
            fileName: req.file.filename,
            filePath: req.file.path,
            mimeType: req.file.mimetype,
            fileSize: req.file.size,
        });



        await file.save();



        req.user.storageUsed += req.file.size;

        await req.user.save();
        await Promise.all([
            redisClient.del(`files:${req.user._id}`),
            redisClient.del(`dashboard:${req.user._id}`)
        ]);

        const remainingStorage =
            req.user.storageLimit - req.user.storageUsed;

        return res.status(201).json({
            success: true,
            message: "File uploaded successfully.",

            file,

            storage: {
                usedBytes: req.user.storageUsed,
                remainingBytes: remainingStorage,
                limitBytes: req.user.storageLimit,

                usedMB: (req.user.storageUsed / (1024 * 1024)).toFixed(2),
                remainingMB: (remainingStorage / (1024 * 1024)).toFixed(2),
                limitMB: (req.user.storageLimit / (1024 * 1024)).toFixed(2),

                usedPercentage: (
                    (req.user.storageUsed / req.user.storageLimit) * 100
                ).toFixed(2) + "%"
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export default UploadFile;
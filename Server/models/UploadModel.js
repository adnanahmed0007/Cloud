import mongoose from "mongoose";

const uploadFileSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserDetaildatabse", // Change this to your actual User model name
            required: true,
        },

        originalName: {
            type: String,
            required: true,
            trim: true,
        },

        fileName: {
            type: String,
            required: true,
            unique: true,
        },

        filePath: {
            type: String,
            required: true,
        },

        mimeType: {
            type: String,
            required: true,
        },

        fileSize: {
            type: Number,
            required: true,
        },

        isPublic: {
            type: Boolean,
            default: false,
        },
        isTrashed: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

const UploadFileModel = mongoose.model("UploadFile", uploadFileSchema);

export default UploadFileModel;
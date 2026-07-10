import UploadFileModel from "../models/UploadModel.js";
const GetAllfile = async (req, res) => {
    try {

        const files = await UploadFileModel.find({
            owner: req.user._id
        });

        return res.status(200).json({
            success: true,
            totalFiles: files.length,
            files
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
}
export default GetAllfile;
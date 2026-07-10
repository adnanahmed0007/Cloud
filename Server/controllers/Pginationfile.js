import UploadFileModel from "../models/UploadModel.js";
const Pagination = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const files = await UploadFileModel.find({
            owner: req.user._id
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const totalFiles = await UploadFileModel.countDocuments({
            owner: req.user._id
        });
        const totalPages = Math.ceil(totalFiles / limit);
        return res
            .status(201)
            .json({
                message: "we got the files",
                page,
                limit,
                totalFiles,
                totalPages,
                files

            })

    }
    catch (e) {
        console.log(e)
        console.log(e)
        return res
            .status(500)
            .json({
                message: "internal server error"
            })
    }
}
export default Pagination
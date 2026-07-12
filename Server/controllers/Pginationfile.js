import UploadFileModel from "../models/UploadModel.js";
const Pagination = async (req, res) => {
    try {

        const { sort } = req.query;
        let sortOption = {};
        if (sort === "newest") {
            sortOption = { createdAt: -1 };
        } else if (sort === "oldest") {
            sortOption = { createdAt: 1 };
        } else if (sort === "largest") {
            sortOption = { fileSize: -1 };
        } else if (sort === "smallest") {
            sortOption = { fileSize: 1 };
        } else if (sort === "name") {
            sortOption = { originalName: 1 };
        } else {

            sortOption = { createdAt: -1 };
        }
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        if (page < 1 || limit < 1) {
            return res.status(400).json({
                success: false,
                message: "Page and limit must be greater than 0."
            });
        }
        const files = await UploadFileModel.find({
            owner: req.user._id
        })
            .sort(sortOption)
            .skip(skip)
            .limit(limit);
        const totalFiles = await UploadFileModel.countDocuments({
            owner: req.user._id
        });
        const totalPages = Math.ceil(totalFiles / limit);
        return res
            .status(200)
            .json({
                success: true,

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
        return res
            .status(500)
            .json({
                message: "internal server error"
            })
    }
}
export default Pagination

import UploadFileModel from "../../models/UploadModel.js";
const dowloandlink = async (req, res) => {
    try {
        const { token } = req.params;
        const file = await UploadFileModel.findOne({
            shareToken: token,
            isPublic: true
        });
        if (!file) {
            return res
                .status(404)
                .json({
                    message: "file not found"
                })
        }

        return res.download(
            file.filePath,
            file.originalName
        );


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
export default dowloandlink;
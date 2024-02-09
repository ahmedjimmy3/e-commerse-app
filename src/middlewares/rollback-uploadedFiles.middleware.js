import cloudinary from "../utils/cloduinary.js"

const rollbackUploadedFiles = async(req,res,next)=>{
    if(req.folder){
        await cloudinary.api.delete_resources_by_prefix(req.folder)
        await cloudinary.api.delete_folder(req.folder)
    }
    next()
}

export default rollbackUploadedFiles
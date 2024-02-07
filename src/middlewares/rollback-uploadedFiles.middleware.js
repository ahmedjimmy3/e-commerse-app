import cloudinary from "../utils/cloduinary.js"

const rollbackUploadedFiles = async(req,res,next)=>{
    const {folderPath} = req.folder
    console.log(folderId)
    await cloudinary.api.delete_resources_by_prefix(folderPath)
    await cloudinary.api.delete_folder(folderPath)        
    next()
}

export default rollbackUploadedFiles
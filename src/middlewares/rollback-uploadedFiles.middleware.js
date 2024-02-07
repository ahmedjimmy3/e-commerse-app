import cloudinary from "../utils/cloduinary.js"

const rollbackUploadedFiles = async(req,res,next)=>{
    if(req.folder){
        const {folderPath} = req.folder
        await cloudinary.api.delete_resources_by_prefix(folderPath)
        await cloudinary.api.delete_folder(folderPath)        
    }
    next()
}

export default rollbackUploadedFiles
import multer from "multer";

const multerMiddleware = ({extension})=>{
    const storage = multer.diskStorage({
        filename: function(req,file,cb){
            cb(null,file.originalname)
        }
    })
    const fileFilter = (req,file,cb)=>{
        if(extension.includes(file.mimetype.split('/')[1])){
            return cb(null,true)
        }
        return cb(new Error('Format is not allowed'), false)
    }
    const file = multer({fileFilter,storage})
    return file
}

export default multerMiddleware
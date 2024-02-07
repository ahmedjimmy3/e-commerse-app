const rollbackCreatedDocuments = async(req,res,next)=>{
    if(req.createdDocument){
        const {model , query} = req.createdDocument
        await model.findByIdAndDelete(query)
    }
    next()
}

export default rollbackCreatedDocuments
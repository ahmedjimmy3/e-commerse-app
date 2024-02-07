const rollbackCreatedDocuments = async(req,res,next)=>{
    const {model , query} = req.createdDocument
    await model.findByIdAndDelete(query)
    next()
}

export default rollbackCreatedDocuments
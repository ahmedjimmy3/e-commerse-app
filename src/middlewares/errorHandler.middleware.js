const errorHandler = (error,req,res,next)=>{
    res.status(error.cause||500).json({message:error.message , stack:error.stack})
    next()
}
export default errorHandler
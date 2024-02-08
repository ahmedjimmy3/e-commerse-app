const errorHandler = (error,req,res,next)=>{
    if(error){
        res.status(error.cause||500).json({message:error.message , stack:error.stack})
        next()
    }
}
export default errorHandler
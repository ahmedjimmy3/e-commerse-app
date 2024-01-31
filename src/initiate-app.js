import dbConnection from "../db/db-connection.js"
import * as Routers from './modules/index.router.js'
import errorHandler from './middlewares/errorHandler.middleware.js'

const initiateApp = (app , express)=>{
    dbConnection()

    app.use(express.json())
    app.use('/auth' , Routers.authRouter)
    app.use('/user',Routers.userRouter)
    app.use('/category',Routers.categoryRouter)
    app.use('/subCategory',Routers.subCategoryRouter)
    app.use('/brand',Routers.brandRouter)

    app.use(errorHandler)

    app.listen(3000, () => console.log(`App listening on port 3000!`))
}

export default initiateApp
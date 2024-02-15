import jwt from 'jsonwebtoken'
import UserModel from '../../db/models/user.model.js'

const auth = (systemRoles) =>{
    return async(req,res,next)=>{
        let {token} = req.headers
        if(!token){
            return next(new Error('You are not authorized please login',{cause:401}))
        }
        if(!token.startsWith(process.env.TOKEN_PREFIX)){
            return next(new Error('Invalid token',{cause:400}))
        }
        token = token.split(process.env.TOKEN_PREFIX)[1]
        const payload = jwt.verify(token , process.env.JWT_SECRET_KEY)
        if(!payload || !payload.id){
            return next(new Error('Invalid credentials',{cause:403}))
        }
        const authUser = await UserModel.findById(payload.id, 'username email role')
        if(!authUser){
            return next(new Error('You should register first please',{cause:404}))
        }
        const validRole = systemRoles?.includes(authUser.role)
        if(!validRole){
            return next(new Error('You are not authorized to access this routes'))
        }
        req.authUser = authUser
        next()
    }
}

export default auth
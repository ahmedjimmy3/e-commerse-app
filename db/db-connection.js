import mongoose from 'mongoose'

const dbConnection = async()=>{
    await mongoose.connect(process.env.CONNECTION_URL_HOST)
    .then(console.log('DB connection done..'))
    .catch((err)=> console.log('Connection failed!!' , err.message))
}

export default dbConnection
import mongoose from 'mongoose'
async function rollbackOperation(operation , data){
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        await operation(data)
        await session.commitTransaction()
        session.endSession()
        return {success:true}
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        console.log('Error during rollback',error)
        return {success:false , error:'Internal server error'}
    }
}

export default rollbackOperation
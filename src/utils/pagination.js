const pagination = ({size = 2 , page = 1})=>{
    if(page < 1){ page = 1 }
    if(size < 1){ size = 2 }
    // 10 products => page = 2
    const limit = +size
    const skip = (+page - 1) * limit
    return { limit , skip }
}

export default pagination
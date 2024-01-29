import { customAlphabet } from "nanoid";

const generateUniqueString = ()=>{
    const nanoid = customAlphabet('123456789' , 6)
    return nanoid()
}

export default generateUniqueString
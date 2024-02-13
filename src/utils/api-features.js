import paginationFunction from './pagination.js'
class APIFeatures {
    constructor(query , mongooseQuery){
        this.query = query,
        this.mongooseQuery = mongooseQuery
    }
    
    pagination({page , size}){
        const {limit,skip} = paginationFunction({page,size})
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit)
        return this
    }

    sort(sortBy){
        if(!sortBy){
            this.mongooseQuery = this.mongooseQuery.sort({createdAt:-1})
            return this
        }
        const formula = sortBy.replace(/desc/g , -1).replace(/asc/g , 1).replace(/ /g , ':')
        const [key,value] = formula.split(':')
        this.mongooseQuery = this.mongooseQuery.sort({[key]: +value})
        return this
    }

    search(search){
        const queryFilters = {}
        if(search.title){queryFilters.title = {$regex: search.title, $options:'i'} }
        if(search.description){queryFilters.description = {$regex: search.description, $options:'i'} }
        if(search.discount){queryFilters.discount = {$ne: 20} }
        if(search.priceFrom && !search.priceTo){queryFilters.appliedPrice = {$gte: search.priceFrom}}
        if(search.priceTo && !search.priceFrom){queryFilters.appliedPrice = {$lte: search.priceTo}}
        if(search.priceTo && search.priceFrom){queryFilters.appliedPrice = {$gte:search.priceFrom,$lte:search.priceTo}}
        this.mongooseQuery = this.mongooseQuery.find(queryFilters)
        return this
    }

    filter(filters){
        const queryFilter = JSON.stringify(filters).replace(/gt|gte|lt|lte|regex|ne/g, (op)=>`$${op}`)
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryFilter))
        return this
    }
}

export default APIFeatures

    /* search , sort , pagination */
    // this => return every thing in class
    // mongooseQuery = model.find()
    // query = req.query conditions
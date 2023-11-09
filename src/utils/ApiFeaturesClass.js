import { paginationFn } from "./pagination.js"


export class apiFeatures{
    constructor(moongoseQuery,queryData){
        this.moongoseQuery=moongoseQuery
        this.queryData=queryData
    }
    //==========pagination=================
    pagination(){
        const {page,size}=this.queryData
        const{limit ,skip}=paginationFn({page,size})
        this.moongoseQuery.limit(limit).skip(skip)
        return this
    }
    //============sort ====================
    sort(){
        this.moongoseQuery.sort(this.queryData.sort.replace(',',' '))
        return this
    }
    //=========select=======
    select(){
        this.moongoseQuery.select(req.query.select.replaceAll(',',' '))
        return this
    }
    //============filters
    filter(){
        const queryData={...this.queryData}
        const excludekeyarr=['page','size','sort','select']
        excludekeyarr.forEach((key)=>delete queryData[key])
const queryString=JSON.parse(JSON.stringify(queryData)
.replace(/gt|gte|lt|lte|in|nin|eq|neq regex/g,(match)=>`$${match}`))
this.moongoseQuery.find(queryString)
return this
    }

}
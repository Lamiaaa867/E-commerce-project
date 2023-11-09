import Joi from "joi";
export const createcateegoryschema={
    body:Joi.object({
        name: Joi.string().min(4).max(10)
    }).required().options({presence:'required'}),
}
export const updatecateegoryschema={
    body:Joi.object({
        name: Joi.string().min(4).max(10).optional()
    }).required()
}

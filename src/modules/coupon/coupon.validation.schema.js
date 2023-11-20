import Joi from 'joi'

export const addCouponSchema = {
  body: Joi.object({
    couponCode: Joi.string().min(5).max(55).required(),
    couponAmount: Joi.number().positive().min(1).max(100).required(),
    startDate: Joi.date().greater(Date.now()-(24 * 60 * 60 *1000)).required(),
    endDate: Joi.date().greater(Joi.ref('startDate')).required(),
    isPrecentage: Joi.boolean().optional(),
    isFixed: Joi.boolean().optional(),
    couponAssignedtoUsers: Joi.array().items().required(),
  }).required(),
  headers: Joi.object({
    test: Joi.string().required(),
  }).options({ allowUnknown: true }),
}

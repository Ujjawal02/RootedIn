const Joi = require("joi");

const postGrowthUpdateSchema = Joi.object({
    imageUrl: Joi.string().uri().required(),
    note: Joi.string().min(5).max(500).required(),
});

module.exports = { postGrowthUpdateSchema };
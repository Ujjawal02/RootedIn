const Joi = require("joi");

const postGrowthUpdateSchema = Joi.object({
    note: Joi.string().min(5).max(500).required(),
});

module.exports = { postGrowthUpdateSchema };
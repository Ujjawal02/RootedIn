const Joi = require("joi");

const CATEGORIES = ["Fruit", "Medicinal", "Timber", "Shade", "Flowering"];

// Multipart requests have no imageUrl field anymore, because the image arrives as a file.

const createTreeSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    species: Joi.string().min(2).max(100).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().valid(...CATEGORIES).required(),
    description: Joi.string().min(10).max(1000).required(),
});

// no .min(1) any more: an update may be image-only, so the controller checks "nothing to update"
const updateTreeSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    species: Joi.string().min(2).max(100),
    price: Joi.number().min(0),
    category: Joi.string().valid(...CATEGORIES),
    description: Joi.string().min(10).max(1000),
})
// .min(1);

module.exports = { createTreeSchema, updateTreeSchema };
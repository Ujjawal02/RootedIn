const Joi = require("joi");

const CATEGORIES = ["Fruit", "Medicinal", "Timber", "Shade", "Flowering"];

const createTreeSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    species: Joi.string().min(2).max(100).required(),
    imageUrl: Joi.string().uri().required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().valid(...CATEGORIES).required(),
    description: Joi.string().min(10).max(1000).required(),
});

const updateTreeSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    species: Joi.string().min(2).max(100),
    imageUrl: Joi.string().uri(),
    price: Joi.number().min(0),
    category: Joi.string().valid(...CATEGORIES),
    description: Joi.string().min(10).max(1000),
}).min(1); // at least one field must be present to update something

module.exports = { createTreeSchema, updateTreeSchema };
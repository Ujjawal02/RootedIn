const Joi = require("joi");

const confirmSponsorshipSchema = Joi.object({
    type: Joi.string().valid("direct", "cart-item", "cart-all").required(),
    treeId: Joi.string().when("type", { is: "direct", then: Joi.required() }),
    cartId: Joi.string().when("type", { is: "cart-item", then: Joi.required() }),
});


const assignFarmerSchema = Joi.object({
    sponsorshipId: Joi.string().required(),
    farmerId: Joi.string().required(),
});

module.exports = { confirmSponsorshipSchema, assignFarmerSchema };
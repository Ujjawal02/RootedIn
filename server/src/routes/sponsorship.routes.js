const express = require("express");
const router = express.Router();

const sponsorshipController = require("../controllers/sponsorship.controller");
const { confirmSponsorshipSchema } = require("../validations/sponsorship.validation");
const validate = require("../middlewares/validate.middleware");
const { userVerification, isUser } = require("../middlewares/auth.middleware");

router.use(userVerification, isUser);

router.get("/checkout/direct/:treeId", sponsorshipController.directCheckout);
router.get("/checkout/cart/:cartId", sponsorshipController.cartItemCheckout);
router.get("/checkout/cart", sponsorshipController.cartCheckout);
router.post("/confirm", validate(confirmSponsorshipSchema), sponsorshipController.confirmSponsorship);

module.exports = router;
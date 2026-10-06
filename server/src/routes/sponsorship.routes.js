const express = require("express");
const router = express.Router();

const sponsorshipController = require("../controllers/sponsorship.controller");
const { confirmSponsorshipSchema } = require("../validations/sponsorship.validation");
const validate = require("../middlewares/validate.middleware");
const { userVerification, isUser } = require("../middlewares/auth.middleware");

router.use(userVerification); // everyone below must simply be logged in

router.get("/checkout/direct/:treeId", isUser, sponsorshipController.directCheckout);
router.get("/checkout/cart/:cartId", isUser, sponsorshipController.cartItemCheckout);
router.get("/checkout/cart", isUser, sponsorshipController.cartCheckout);
router.post("/confirm", isUser, validate(confirmSponsorshipSchema), sponsorshipController.confirmSponsorship);

router.get("/:sponsorshipId/updates", sponsorshipController.getGrowthUpdates); // sponsor OR farmer — checked inside the controller, not via role middleware

router.get("/mine", isUser, sponsorshipController.getMySponsorships);

module.exports = router;
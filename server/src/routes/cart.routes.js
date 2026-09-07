const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cart.controller");
const { userVerification, isUser } = require("../middlewares/auth.middleware");

router.use(userVerification, isUser); // applies to every route below — no repeating it per line

router.get("/", cartController.getCart);
router.post("/add/:treeId", cartController.addToCart);
router.put("/increase/:cartId", cartController.increaseQuantity);
router.put("/decrease/:cartId", cartController.decreaseQuantity);
router.delete("/:cartId", cartController.removeFromCart);

module.exports = router;
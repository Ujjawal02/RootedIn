const express = require("express");
const router = express.Router();

const farmerController = require("../controllers/farmer.controller");
const { postGrowthUpdateSchema } = require("../validations/farmer.validation");
const validate = require("../middlewares/validate.middleware");
const { userVerification, isFarmer } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.use(userVerification, isFarmer);

router.get("/assigned", farmerController.getAssignedTrees);
router.put("/complete/:sponsorshipId", farmerController.markCompleted);
router.post("/updates/:sponsorshipId",upload.single("image"), validate(postGrowthUpdateSchema), farmerController.postGrowthUpdate);

module.exports = router;
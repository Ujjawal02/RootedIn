const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const { assignFarmerSchema } = require("../validations/sponsorship.validation");
const validate = require("../middlewares/validate.middleware");
const { userVerification, isAdmin } = require("../middlewares/auth.middleware");

router.use(userVerification, isAdmin);

router.get("/pending", adminController.getPendingRequests);
router.put("/approve/:sponsorshipId", adminController.approveRequest);
router.put("/reject/:sponsorshipId", adminController.rejectRequest);

router.get("/approved", adminController.getApprovedUnassigned);
router.get("/farmers", adminController.getFarmers);
router.put("/assign", validate(assignFarmerSchema), adminController.assignFarmer);

router.get("/assigned", adminController.getAssignedTrees);

router.get("/deleted-trees", adminController.getDeletedTrees);
router.put("/restore/:treeId", adminController.restoreTree);

module.exports = router;
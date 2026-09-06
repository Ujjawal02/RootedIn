const express = require("express");
const router = express.Router();

const treeController = require("../controllers/tree.controller");
const { createTreeSchema, updateTreeSchema } = require("../validations/tree.validation");
const validate = require("../middlewares/validate.middleware");
const { userVerification, isAdmin } = require("../middlewares/auth.middleware");

router.get("/", treeController.getTrees);
router.get("/:id", treeController.getTreeById);

router.post("/", userVerification, isAdmin, validate(createTreeSchema), treeController.createTree);
router.put("/:id", userVerification, isAdmin, validate(updateTreeSchema), treeController.updateTree);
router.delete("/:id", userVerification, isAdmin, treeController.deleteTree);

module.exports = router;
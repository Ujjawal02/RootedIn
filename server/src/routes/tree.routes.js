const express = require("express");
const router = express.Router();

const treeController = require("../controllers/tree.controller");
const { createTreeSchema, updateTreeSchema } = require("../validations/tree.validation");
const validate = require("../middlewares/validate.middleware");
const { userVerification, isAdmin } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware")
router.get("/", treeController.getTrees);
router.get("/:id", treeController.getTreeById);

router.post("/", userVerification, isAdmin, upload.single("image"),validate(createTreeSchema), treeController.createTree);
router.put("/:id", userVerification, isAdmin, upload.single("image"), validate(updateTreeSchema), treeController.updateTree);
router.delete("/:id", userVerification, isAdmin, treeController.deleteTree);

module.exports = router;
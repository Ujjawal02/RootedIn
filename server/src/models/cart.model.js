const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    treeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tree",
      required: true,
    },
    quantity: { type: Number, default: 1, min: 1 },
  },
  { timestamps: true },
);

// Prevents the same user from having two separate cart rows for the same tree
cartSchema.index({ userId: 1, treeId: 1 }, { unique: true });

module.exports = mongoose.model("Cart", cartSchema);

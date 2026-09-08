const mongoose = require("mongoose");

const sponsorshipSchema = new mongoose.Schema(
  {
    treeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tree",
      required: true,
    },
    sponsorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "assigned", "completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Sponsorship", sponsorshipSchema);

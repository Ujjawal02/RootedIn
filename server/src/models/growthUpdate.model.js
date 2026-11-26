const mongoose = require("mongoose");

const growthUpdateSchema = new mongoose.Schema(
  {
    sponsorshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sponsorship",
      required: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: { 
      url: { type: String, required: true },
      public_id: {type: String, default: null}
   },
    note: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("GrowthUpdate", growthUpdateSchema);

const mongoose = require("mongoose");

const treeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        species: { type: String, required: true, trim: true },
        image: {
            url: { type: String, required: true },
            public_id: { type: String, default: null },
        },
        price: { type: Number, required: true, min: 0 },
        category: {
            type: String,
            enum: ["Fruit", "Medicinal", "Timber", "Shade", "Flowering"],
            required: true,
        },
        description: { type: String, required: true, trim: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Tree", treeSchema);
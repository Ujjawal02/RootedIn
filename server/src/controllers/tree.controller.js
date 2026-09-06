const Tree = require("../models/tree.model");

module.exports.getTrees = async (req, res) => {
    try {
        const trees = await Tree.find({ isDeleted: false }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, trees });
    } catch (error) {
        console.log("Get Trees Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.getTreeById = async (req, res) => {
    try {
        const { id } = req.params;
        const tree = await Tree.findOne({ _id: id, isDeleted: false });

        if (!tree) {
            return res.status(404).json({ success: false, message: "Tree not found" });
        }

        return res.status(200).json({ success: true, tree });
    } catch (error) {
        console.log("Get Tree Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.createTree = async (req, res) => {
    try {
        const { name, species, imageUrl, price, category, description } = req.body;

        const tree = await Tree.create({
            name,
            species,
            price,
            category,
            description,
            image: { url: imageUrl },
        });

        return res.status(201).json({ success: true, message: "Tree created", tree });
    } catch (error) {
        console.log("Create Tree Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.updateTree = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        if (updates.imageUrl) {
            updates.image = { url: updates.imageUrl };
            delete updates.imageUrl;
        }

        const tree = await Tree.findOneAndUpdate(
            { _id: id, isDeleted: false },
            updates,
            { returnDocument: "after", runValidators: true }
            // { new: true, runValidators: true }
        );

        if (!tree) {
            return res.status(404).json({ success: false, message: "Tree not found" });
        }

        return res.status(200).json({ success: true, message: "Tree updated", tree });
    } catch (error) {
        console.log("Update Tree Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.deleteTree = async (req, res) => {
    try {
        const { id } = req.params;

        const tree = await Tree.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { returnDocument: "after", runValidators: true }
            // { new: true }
        );

        if (!tree) {
            return res.status(404).json({ success: false, message: "Tree not found" });
        }

        return res.status(200).json({ success: true, message: "Tree soft-deleted" });
    } catch (error) {
        console.log("Delete Tree Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};
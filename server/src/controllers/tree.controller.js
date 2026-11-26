const Tree = require("../models/tree.model");
const { uploadImage, deleteImage } = require("../services/upload.service");


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
    let uploaded = null;
    try {
        if(!req.file){
            return res.status(400).json({ success: false, message: "Tree image is required" });
        }

        const { name, species, price, category, description } = req.body;

        uploaded = await uploadImage(req.file.buffer, "trees"); //{url, public_id}
        console.log("uploaded::", uploaded);

        const tree = await Tree.create({
            name,
            species,
            price,
            category,
            description,
            image: uploaded
        });

        return res.status(201).json({ success: true, message: "Tree created", tree });
    } catch (error) {

        if(uploaded) {
            // the database write failed after the upload succeeded, so don't leave an orphan in Cloudinary
            await deleteImage(uploaded.public_id).catch(()=>{})
        }
        console.log("Create Tree Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.updateTree = async (req, res) => {
    let uploaded = null;
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        // if (updates.imageUrl) {
        //     updates.image = { url: updates.imageUrl };
        //     delete updates.imageUrl;
        // }

        if(Object.keys(updates).length === 0 && !req.file){
            return res.status(400).json({
                success: false,
                message: "Nothing to update"
            });
        }

        let oldPublicId = null;

        if(req.file){
            const existing = await Tree.findOne({
                _id:id, isDeleted: false
            }).select("image");
            if(!existing){
                return res.status(404).json({ success: false, message: "Tree not found" });
            }
            oldPublicId = existing.image?.public_id;

            uploaded = await uploadImage(req.file.buffer, "trees")
            updates.image = uploaded;
        }

        const tree = await Tree.findOneAndUpdate(
            { _id: id, isDeleted: false },
            updates,
            { returnDocument: "after", runValidators: true }
            // { new: true, runValidators: true }
        );

        if (!tree) {
            if (uploaded) await deleteImage(uploaded.public_id).catch(() => {});
            return res.status(404).json({ success: false, message: "Tree not found" });
        }

        if(uploaded && oldPublicId){
            await deleteImage(oldPublicId).catch((err) => console.log("Old Image cleaned failed:", err))
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
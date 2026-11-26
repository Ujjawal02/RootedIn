const Sponsorship = require("../models/sponsorship.model");
const GrowthUpdate = require("../models/growthUpdate.model");
const { uploadImage, deleteImage } = require("../services/upload.service");

module.exports.getAssignedTrees = async (req, res) => {
    try {
        const assigned = await Sponsorship.find({ farmerId: req.user._id, status: "assigned" })
            .populate("treeId")
            .populate({ path: "sponsorId", select: "name email" });

        return res.status(200).json({ success: true, assigned });
    } catch (error) {
        console.log("Get Assigned Trees Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.markCompleted = async (req, res) => {
    try {
        const { sponsorshipId } = req.params;

        // ownership + status gated in one query, same pattern as admin's approve/assign
        const updated = await Sponsorship.findOneAndUpdate(
            { _id: sponsorshipId, farmerId: req.user._id, status: "assigned" },
            { status: "completed" },
            { returnDocument: "after" }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Assigned tree not found or not yours" });
        }

        return res.status(200).json({ success: true, message: "Marked as completed", sponsorship: updated });
    } catch (error) {
        console.log("Mark Completed Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.postGrowthUpdate = async (req, res) => {
    let uploaded = null;
    try {
        const { sponsorshipId } = req.params;
        const { note } = req.body;

        if(!req.file){
            return res.status(400).json({ success: false, message: "A photo is required" });
        }

        // Deliberately NOT filtering by status: "assigned" here — a farmer should still be able to
        // log one final update on a tree they just marked completed, without losing access to it.
        const sponsorship = await Sponsorship.findOne({ _id: sponsorshipId, farmerId: req.user._id });
        if (!sponsorship) {
            return res.status(404).json({ success: false, message: "Sponsored tree not found or not assigned to you" });
        }
        uploaded = await uploadImage(req.file.buffer, "growth-updates")

        const update = await GrowthUpdate.create({
            sponsorshipId,
            farmerId: req.user._id,
            image: uploaded,
            note,
        });

        return res.status(201).json({ success: true, message: "Update posted", update });
    } catch (error) {
        console.log("Post Growth Update Error:", error);
        console.log("Cloudinary Error Details:", error.http_code, error.message);
        return res.status(500).json({ success: false, message: "Internal Server error..." });
    }
};
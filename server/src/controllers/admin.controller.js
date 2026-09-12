const Sponsorship = require("../models/sponsorship.model");
const User = require("../models/user.model");
const Tree = require("../models/tree.model");

module.exports.getPendingRequests = async (req, res) => {
    try {
        const requests = await Sponsorship.find({ status: "pending" })
            .populate("treeId")
            .populate({ path: "sponsorId", select: "name email phone" });

        return res.status(200).json({ success: true, requests });
    } catch (error) {
        console.log("Get Pending Requests Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.approveRequest = async (req, res) => {
    try {
        const { sponsorshipId } = req.params;

        // only a currently-pending request can be approved — blocks re-approving an already-rejected one, etc.
        const updated = await Sponsorship.findOneAndUpdate(
            { _id: sponsorshipId, status: "pending" },
            { status: "approved" },
            { returnDocument: "after" }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Pending request not found" });
        }

        return res.status(200).json({ success: true, message: "Request approved", sponsorship: updated });
    } catch (error) {
        console.log("Approve Request Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.rejectRequest = async (req, res) => {
    try {
        const { sponsorshipId } = req.params;

        const updated = await Sponsorship.findOneAndUpdate(
            { _id: sponsorshipId, status: "pending" },
            { status: "rejected" },
            { returnDocument: "after" }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Pending request not found" });
        }

        return res.status(200).json({ success: true, message: "Request rejected", sponsorship: updated });
    } catch (error) {
        console.log("Reject Request Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.getApprovedUnassigned = async (req, res) => {
    try {
        const requests = await Sponsorship.find({ status: "approved" })
            .populate("treeId")
            .populate({ path: "sponsorId", select: "name email phone" });

        return res.status(200).json({ success: true, requests });
    } catch (error) {
        console.log("Get Approved Unassigned Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.getFarmers = async (req, res) => {
    try {
        const farmers = await User.find({ role: "farmer" }).select("name email");
        return res.status(200).json({ success: true, farmers });
    } catch (error) {
        console.log("Get Farmers Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.assignFarmer = async (req, res) => {
    try {
        const { sponsorshipId, farmerId } = req.body;

        const farmer = await User.findOne({ _id: farmerId, role: "farmer" });
        if (!farmer) {
            return res.status(404).json({ success: false, message: "Farmer not found" });
        }

        // only an approved request can move to assigned — blocks jumping straight from pending
        const updated = await Sponsorship.findOneAndUpdate(
            { _id: sponsorshipId, status: "approved" },
            { status: "assigned", farmerId },
            { returnDocument: "after" }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Approved request not found" });
        }

        return res.status(200).json({ success: true, message: "Farmer assigned", sponsorship: updated });
    } catch (error) {
        console.log("Assign Farmer Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.getAssignedTrees = async (req, res) => {
    try {
        const requests = await Sponsorship.find({ status: "assigned" })
            .populate("treeId")
            .populate({ path: "sponsorId", select: "name email" })
            .populate({ path: "farmerId", select: "name email" });

        return res.status(200).json({ success: true, requests });
    } catch (error) {
        console.log("Get Assigned Trees Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.getDeletedTrees = async (req, res) => {
    try {
        const trees = await Tree.find({ isDeleted: true });
        return res.status(200).json({ success: true, trees });
    } catch (error) {
        console.log("Get Deleted Trees Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.restoreTree = async (req, res) => {
    try {
        const { treeId } = req.params;

        const tree = await Tree.findOne({ _id: treeId, isDeleted: true });
        if (!tree) {
            return res.status(404).json({ success: false, message: "Deleted tree not found" });
        }

        tree.isDeleted = false;
        await tree.save();

        return res.status(200).json({ success: true, message: "Tree restored", tree });
    } catch (error) {
        console.log("Restore Tree Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};
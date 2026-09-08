const Tree = require("../models/tree.model");
const Cart = require("../models/cart.model");
const Sponsorship = require("../models/sponsorship.model");

module.exports.directCheckout = async (req, res) => {
    try {
        const { treeId } = req.params;
        const tree = await Tree.findOne({ _id: treeId, isDeleted: false });

        if (!tree) {
            return res.status(404).json({ success: false, message: "Tree not found" });
        }

        return res.status(200).json({
            success: true,
            item: { treeId: tree._id, name: tree.name, price: tree.price, quantity: 1, total: tree.price },
        });
    } catch (error) {
        console.log("Direct Checkout Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.cartItemCheckout = async (req, res) => {
    try {
        const { cartId } = req.params;
        const cartItem = await Cart.findOne({ _id: cartId, userId: req.user._id }).populate({
            path: "treeId",
            match: { isDeleted: false },
        });

        if (!cartItem || !cartItem.treeId) {
            return res.status(404).json({ success: false, message: "Cart item not found or tree unavailable" });
        }

        return res.status(200).json({
            success: true,
            item: {
                cartId: cartItem._id,
                treeId: cartItem.treeId._id,
                name: cartItem.treeId.name,
                price: cartItem.treeId.price,
                quantity: cartItem.quantity,
                total: cartItem.treeId.price * cartItem.quantity,
            },
        });
    } catch (error) {
        console.log("Cart Item Checkout Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.cartCheckout = async (req, res) => {
    try {
        const cartItems = await Cart.find({ userId: req.user._id }).populate({
            path: "treeId",
            match: { isDeleted: false },
        });
        const validItems = cartItems.filter((c) => c.treeId);

        const items = validItems.map((c) => ({
            cartId: c._id,
            treeId: c.treeId._id,
            name: c.treeId.name,
            price: c.treeId.price,
            quantity: c.quantity,
            total: c.treeId.price * c.quantity,
        }));

        const totalAmount = items.reduce((sum, i) => sum + i.total, 0);

        return res.status(200).json({ success: true, items, totalAmount });
    } catch (error) {
        console.log("Cart Checkout Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.confirmSponsorship = async (req, res) => {
    try {
        const { type, treeId, cartId } = req.body;

        if (type === "direct") {
            const tree = await Tree.findOne({ _id: treeId, isDeleted: false });
            if (!tree) return res.status(404).json({ success: false, message: "Tree not found" });

            const sponsorship = await Sponsorship.create({
                treeId: tree._id,
                sponsorId: req.user._id,
                amount: tree.price,
            });

            return res.status(201).json({ success: true, message: "Sponsorship request submitted", sponsorship });
        }

        if (type === "cart-item") {
            const cartItem = await Cart.findOne({ _id: cartId, userId: req.user._id }).populate({
                path: "treeId",
                match: { isDeleted: false },
            });
            if (!cartItem || !cartItem.treeId) {
                return res.status(404).json({ success: false, message: "Cart item not found or tree unavailable" });
            }

            const sponsorship = await Sponsorship.create({
                treeId: cartItem.treeId._id,
                sponsorId: req.user._id,
                amount: cartItem.treeId.price * cartItem.quantity,
            });

            await cartItem.deleteOne(); // remove only this item, not the whole cart

            return res.status(201).json({ success: true, message: "Sponsorship request submitted", sponsorship });
        }

        if (type === "cart-all") {
            const cartItems = await Cart.find({ userId: req.user._id }).populate({
                path: "treeId",
                match: { isDeleted: false },
            });
            const validItems = cartItems.filter((c) => c.treeId);

            if (validItems.length === 0) {
                return res.status(400).json({ success: false, message: "Cart is empty" });
            }

            const sponsorships = await Sponsorship.insertMany(
                validItems.map((c) => ({
                    treeId: c.treeId._id,
                    sponsorId: req.user._id,
                    amount: c.treeId.price * c.quantity,
                }))
            );

            await Cart.deleteMany({ userId: req.user._id, _id: { $in: validItems.map((c) => c._id) } });

            return res.status(201).json({ success: true, message: "Sponsorship requests submitted", sponsorships });
        }

        return res.status(400).json({ success: false, message: "Invalid sponsorship type" });
    } catch (error) {
        console.log("Confirm Sponsorship Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};
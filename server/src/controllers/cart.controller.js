const Cart = require("../models/cart.model");
const Tree = require("../models/tree.model");

module.exports.getCart = async (req, res) => {
    try {
        const cartItems = await Cart.find({ userId: req.user._id }).populate({
            path: "treeId",
            match: { isDeleted: false }, // soft-deleted trees won't populate — comes back null
        });

        return res.status(200).json({ success: true, cartItems });
    } catch (error) {
        console.log("Get Cart Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.addToCart = async (req, res) => {
    try {
        const { treeId } = req.params;

        const tree = await Tree.findOne({ _id: treeId, isDeleted: false });
        if (!tree) {
            return res.status(404).json({ success: false, message: "Tree not found" });
        }

        // If it's already in the cart, bump quantity instead of erroring on the unique index
        let cartItem = await Cart.findOne({ userId: req.user._id, treeId });

        if (cartItem) {
            cartItem.quantity += 1;
            await cartItem.save();
        } else {
            cartItem = await Cart.create({ userId: req.user._id, treeId, quantity: 1 });
        }

        return res.status(200).json({ success: true, message: "Added to cart", cartItem });
    } catch (error) {
        console.log("Add To Cart Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.increaseQuantity = async (req, res) => {
    try {
        const { cartId } = req.params;

        const item = await Cart.findOneAndUpdate(
            { _id: cartId, userId: req.user._id }, // ownership check baked into the query
            { $inc: { quantity: 1 } },
            { returnDocument: "after" }
        );

        if (!item) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }

        return res.status(200).json({ success: true, item });
    } catch (error) {
        console.log("Increase Quantity Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.decreaseQuantity = async (req, res) => {
    try {
        const { cartId } = req.params;

        const item = await Cart.findOne({ _id: cartId, userId: req.user._id });
        if (!item) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }

        if (item.quantity <= 1) {
            // Quantity would drop to 0 — remove the item entirely instead of leaving a 0-quantity row
            await item.deleteOne();
            return res.status(200).json({ success: true, message: "Item removed from cart", removed: true });
        }

        item.quantity -= 1;
        await item.save();

        return res.status(200).json({ success: true, item });
    } catch (error) {
        console.log("Decrease Quantity Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.removeFromCart = async (req, res) => {
    try {
        const { cartId } = req.params;

        const item = await Cart.findOneAndDelete({ _id: cartId, userId: req.user._id });
        if (!item) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }

        return res.status(200).json({ success: true, message: "Item removed from cart" });
    } catch (error) {
        console.log("Remove From Cart Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};
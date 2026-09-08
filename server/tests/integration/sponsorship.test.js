const request = require("supertest");
const app = require("../../src/app");
const db = require("../setup");
const User = require("../../src/models/user.model");
const Tree = require("../../src/models/tree.model");
const Cart = require("../../src/models/cart.model");
const Sponsorship = require("../../src/models/sponsorship.model");

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

const createAndLoginAs = async (role, emailSuffix = "") => {
    const user = await User.create({
        name: { firstname: "Test", lastname: role },
        email: `${role}${emailSuffix}@example.com`,
        phone: "9876543210",
        password: "password123",
        role,
    });
    const res = await request(app).post("/auth/login").send({ email: user.email, password: "password123" });
    return { cookie: res.headers["set-cookie"], user };
};

const createTree = async (price = 300) =>
    Tree.create({
        name: "Mango", species: "Mangifera indica", image: { url: "https://example.com/mango.jpg" },
        price, category: "Fruit", description: "A fruit-bearing tree.",
    });

describe("Sponsorship - direct flow", () => {
    it("should confirm a direct sponsorship and create a pending record", async () => {
        const { cookie, user } = await createAndLoginAs("user");
        const tree = await createTree(500);

        const res = await request(app)
            .post("/sponsorship/confirm")
            .set("Cookie", cookie)
            .send({ type: "direct", treeId: tree._id.toString() });

        expect(res.statusCode).toBe(201);
        expect(res.body.sponsorship.status).toBe("pending");
        expect(res.body.sponsorship.amount).toBe(500);

        const inDb = await Sponsorship.findOne({ sponsorId: user._id });
        expect(inDb).not.toBeNull();
    });

    it("should reject confirm with type=direct but no treeId (validation)", async () => {
        const { cookie } = await createAndLoginAs("user");
        const res = await request(app).post("/sponsorship/confirm").set("Cookie", cookie).send({ type: "direct" });
        expect(res.statusCode).toBe(400);
    });
});

describe("Sponsorship - cart-item flow", () => {
    it("should confirm one cart item and remove ONLY that item from cart", async () => {
        const { cookie, user } = await createAndLoginAs("user");
        const treeA = await createTree(200);
        const treeB = await createTree(400);

        const cartA = await Cart.create({ userId: user._id, treeId: treeA._id, quantity: 1 });
        await Cart.create({ userId: user._id, treeId: treeB._id, quantity: 1 }); // should survive

        const res = await request(app)
            .post("/sponsorship/confirm")
            .set("Cookie", cookie)
            .send({ type: "cart-item", cartId: cartA._id.toString() });

        expect(res.statusCode).toBe(201);

        const remainingCart = await Cart.find({ userId: user._id });
        expect(remainingCart.length).toBe(1); // treeB's cart row untouched
    });
});

describe("Sponsorship - cart-all flow", () => {
    it("should confirm the whole cart, create multiple sponsorships, and empty the cart", async () => {
        const { cookie, user } = await createAndLoginAs("user");
        const treeA = await createTree(200);
        const treeB = await createTree(400);

        await Cart.create({ userId: user._id, treeId: treeA._id, quantity: 2 }); // 400 total
        await Cart.create({ userId: user._id, treeId: treeB._id, quantity: 1 }); // 400 total

        const res = await request(app)
            .post("/sponsorship/confirm")
            .set("Cookie", cookie)
            .send({ type: "cart-all" });

        expect(res.statusCode).toBe(201);
        expect(res.body.sponsorships.length).toBe(2);

        const totalCreated = res.body.sponsorships.reduce((sum, s) => sum + s.amount, 0);
        expect(totalCreated).toBe(800);

        const remainingCart = await Cart.find({ userId: user._id });
        expect(remainingCart.length).toBe(0);
    });

    it("should reject cart-all confirm when cart is empty", async () => {
        const { cookie } = await createAndLoginAs("user");
        const res = await request(app).post("/sponsorship/confirm").set("Cookie", cookie).send({ type: "cart-all" });
        expect(res.statusCode).toBe(400);
    });
});
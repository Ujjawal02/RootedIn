const request = require("supertest");
const app = require("../../src/app");
const db = require("../setup");
const User = require("../../src/models/user.model");
const Tree = require("../../src/models/tree.model");

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

    const res = await request(app).post("/auth/login").send({
        email: user.email,
        password: "password123",
    });

    return { cookie: res.headers["set-cookie"], user };
};

const createTree = async () => {
    return Tree.create({
        name: "Mango",
        species: "Mangifera indica",
        image: { url: "https://example.com/mango.jpg" },
        price: 300,
        category: "Fruit",
        description: "A fruit-bearing tree.",
    });
};

describe("Cart routes", () => {
    it("should reject cart access for a farmer (not a 'user' role)", async () => {
        const { cookie } = await createAndLoginAs("farmer");
        const res = await request(app).get("/cart").set("Cookie", cookie);
        expect(res.statusCode).toBe(403);
    });

    it("should add a tree to cart with quantity 1", async () => {
        const { cookie } = await createAndLoginAs("user");
        const tree = await createTree();

        const res = await request(app).post(`/cart/add/${tree._id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(200);
        expect(res.body.cartItem.quantity).toBe(1);
    });

    it("adding the same tree twice should increase quantity, not create a duplicate row", async () => {
        const { cookie } = await createAndLoginAs("user");
        const tree = await createTree();

        await request(app).post(`/cart/add/${tree._id}`).set("Cookie", cookie);
        await request(app).post(`/cart/add/${tree._id}`).set("Cookie", cookie);

        const cartRes = await request(app).get("/cart").set("Cookie", cookie);
        expect(cartRes.body.cartItems.length).toBe(1);
        expect(cartRes.body.cartItems[0].quantity).toBe(2);
    });

    it("decreasing quantity to 0 should remove the item entirely", async () => {
        const { cookie } = await createAndLoginAs("user");
        const tree = await createTree();

        const addRes = await request(app).post(`/cart/add/${tree._id}`).set("Cookie", cookie);
        const cartId = addRes.body.cartItem._id;

        const res = await request(app).put(`/cart/decrease/${cartId}`).set("Cookie", cookie);
        expect(res.body.removed).toBe(true);

        const cartRes = await request(app).get("/cart").set("Cookie", cookie);
        expect(cartRes.body.cartItems.length).toBe(0);
    });

    it("should NOT allow one user to modify another user's cart item", async () => {
        const { cookie: cookieA } = await createAndLoginAs("user", "a");
        const { cookie: cookieB } = await createAndLoginAs("user", "b");
        const tree = await createTree();

        const addRes = await request(app).post(`/cart/add/${tree._id}`).set("Cookie", cookieA);
        const cartId = addRes.body.cartItem._id;

        const res = await request(app).delete(`/cart/${cartId}`).set("Cookie", cookieB);
        expect(res.statusCode).toBe(404); // user B can't even see/target user A's cart item
    });
});
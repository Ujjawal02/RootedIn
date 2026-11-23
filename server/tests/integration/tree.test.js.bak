const request = require("supertest");
const app = require("../../src/app");
const db = require("../setup");
const User = require("../../src/models/user.model");
const Tree = require("../../src/models/tree.model");

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

const validTree = {
    name: "Neem",
    species: "Azadirachta indica",
    imageUrl: "https://example.com/neem.jpg",
    price: 500,
    category: "Medicinal",
    description: "A fast-growing, medicinal tree native to India.",
};

// Helper: creates a user directly with a given role, then logs in to get the auth cookie
const createAndLoginAs = async (role) => {
    const user = await User.create({
        name: { firstname: "Test", lastname: role },
        email: `${role}@example.com`,
        phone: "9876543210",
        password: "password123",
        role, // bypassing signup on purpose here — this is a test helper, not the public API
    });

    const res = await request(app).post("/auth/login").send({
        email: user.email,
        password: "password123",
    });

    return res.headers["set-cookie"];
};

describe("Tree routes", () => {
    it("GET /trees should return an empty list initially", async () => {
        const res = await request(app).get("/trees");
        expect(res.statusCode).toBe(200);
        expect(res.body.trees).toEqual([]);
    });

    it("POST /trees should be rejected for a non-admin user", async () => {
        const cookie = await createAndLoginAs("user");
        const res = await request(app).post("/trees").set("Cookie", cookie).send(validTree);
        expect(res.statusCode).toBe(403);
    });

    it("POST /trees should be rejected if not logged in at all", async () => {
        const res = await request(app).post("/trees").send(validTree);
        expect(res.statusCode).toBe(401);
    });

    it("POST /trees should succeed for an admin", async () => {
        const cookie = await createAndLoginAs("admin");
        const res = await request(app).post("/trees").set("Cookie", cookie).send(validTree);

        expect(res.statusCode).toBe(201);
        expect(res.body.tree.name).toBe("Neem");
    });

    it("DELETE then GET /trees/:id should soft-delete, not remove, the tree", async () => {
        const cookie = await createAndLoginAs("admin");
        const createRes = await request(app).post("/trees").set("Cookie", cookie).send(validTree);
        const treeId = createRes.body.tree._id;

        const deleteRes = await request(app).delete(`/trees/${treeId}`).set("Cookie", cookie);
        expect(deleteRes.statusCode).toBe(200);

        // still exists in the DB, just marked isDeleted — confirm it's hidden from normal fetch
        const getRes = await request(app).get(`/trees/${treeId}`);
        expect(getRes.statusCode).toBe(404);

        const treeInDb = await Tree.findById(treeId);
        expect(treeInDb).not.toBeNull();
        expect(treeInDb.isDeleted).toBe(true);
    });
});
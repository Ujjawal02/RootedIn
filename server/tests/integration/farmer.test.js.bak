const request = require("supertest");
const app = require("../../src/app");
const db = require("../setup");
const User = require("../../src/models/user.model");
const Tree = require("../../src/models/tree.model");
const Sponsorship = require("../../src/models/sponsorship.model");
const GrowthUpdate = require("../../src/models/growthUpdate.model");

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

const createTree = async () =>
    Tree.create({
        name: "Mango", species: "Mangifera indica", image: { url: "https://example.com/mango.jpg" },
        price: 300, category: "Fruit", description: "A fruit-bearing tree.",
    });

describe("Farmer - assigned trees", () => {
    it("should only return trees assigned to THIS farmer, not another farmer's", async () => {
        const { cookie, user: farmerA } = await createAndLoginAs("farmer", "A");
        const { user: farmerB } = await createAndLoginAs("farmer", "B");
        const { user: sponsor } = await createAndLoginAs("user");
        const treeA = await createTree();
        const treeB = await createTree();

        await Sponsorship.create({ treeId: treeA._id, sponsorId: sponsor._id, farmerId: farmerA._id, amount: 300, status: "assigned" });
        await Sponsorship.create({ treeId: treeB._id, sponsorId: sponsor._id, farmerId: farmerB._id, amount: 300, status: "assigned" });

        const res = await request(app).get("/farmer/assigned").set("Cookie", cookie);
        expect(res.statusCode).toBe(200);
        expect(res.body.assigned.length).toBe(1);
    });
});

describe("Farmer - mark completed", () => {
    it("should transition assigned -> completed for the owning farmer", async () => {
        const { cookie, user: farmer } = await createAndLoginAs("farmer");
        const { user: sponsor } = await createAndLoginAs("user");
        const tree = await createTree();
        const sponsorship = await Sponsorship.create({ treeId: tree._id, sponsorId: sponsor._id, farmerId: farmer._id, amount: 300, status: "assigned" });

        const res = await request(app).put(`/farmer/complete/${sponsorship._id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(200);
        expect(res.body.sponsorship.status).toBe("completed");
    });

    it("should NOT allow a different farmer to complete a tree not assigned to them", async () => {
        const { user: farmerA } = await createAndLoginAs("farmer", "A");
        const { cookie: cookieB } = await createAndLoginAs("farmer", "B");
        const { user: sponsor } = await createAndLoginAs("user");
        const tree = await createTree();
        const sponsorship = await Sponsorship.create({ treeId: tree._id, sponsorId: sponsor._id, farmerId: farmerA._id, amount: 300, status: "assigned" });

        const res = await request(app).put(`/farmer/complete/${sponsorship._id}`).set("Cookie", cookieB);
        expect(res.statusCode).toBe(404);
    });
});

describe("Farmer - growth updates", () => {
    it("should post a growth update and let both the sponsor and the farmer read it", async () => {
        const { cookie: farmerCookie, user: farmer } = await createAndLoginAs("farmer");
        const { cookie: sponsorCookie, user: sponsor } = await createAndLoginAs("user");
        const tree = await createTree();
        const sponsorship = await Sponsorship.create({ treeId: tree._id, sponsorId: sponsor._id, farmerId: farmer._id, amount: 300, status: "assigned" });

        const postRes = await request(app)
            .post(`/farmer/updates/${sponsorship._id}`)
            .set("Cookie", farmerCookie)
            .send({ imageUrl: "https://example.com/growth1.jpg", note: "Healthy, grew about 2 inches this month." });

        expect(postRes.statusCode).toBe(201);

        const farmerRead = await request(app).get(`/sponsorship/${sponsorship._id}/updates`).set("Cookie", farmerCookie);
        expect(farmerRead.body.updates.length).toBe(1);

        const sponsorRead = await request(app).get(`/sponsorship/${sponsorship._id}/updates`).set("Cookie", sponsorCookie);
        expect(sponsorRead.body.updates.length).toBe(1);
    });

    it("should NOT let an unrelated user read growth updates for someone else's sponsorship", async () => {
        const { cookie: farmerCookie, user: farmer } = await createAndLoginAs("farmer");
        const { user: sponsor } = await createAndLoginAs("user", "Real");
        const { cookie: strangerCookie } = await createAndLoginAs("user", "Stranger");
        const tree = await createTree();
        const sponsorship = await Sponsorship.create({ treeId: tree._id, sponsorId: sponsor._id, farmerId: farmer._id, amount: 300, status: "assigned" });

        const res = await request(app).get(`/sponsorship/${sponsorship._id}/updates`).set("Cookie", strangerCookie);
        expect(res.statusCode).toBe(404);
    });
});
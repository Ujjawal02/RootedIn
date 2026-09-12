const request = require("supertest");
const app = require("../../src/app");
const db = require("../setup");
const User = require("../../src/models/user.model");
const Tree = require("../../src/models/tree.model");
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

const createTree = async () =>
    Tree.create({
        name: "Mango", species: "Mangifera indica", image: { url: "https://example.com/mango.jpg" },
        price: 300, category: "Fruit", description: "A fruit-bearing tree.",
    });

describe("Admin - approve/reject flow", () => {
    it("should approve a pending request", async () => {
        const { cookie } = await createAndLoginAs("admin");
        const { user: sponsor } = await createAndLoginAs("user");
        const tree = await createTree();
        const sponsorship = await Sponsorship.create({ treeId: tree._id, sponsorId: sponsor._id, amount: 300 });

        const res = await request(app).put(`/admin/approve/${sponsorship._id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(200);
        expect(res.body.sponsorship.status).toBe("approved");
    });

    it("should NOT allow approving an already-rejected request", async () => {
        const { cookie } = await createAndLoginAs("admin");
        const { user: sponsor } = await createAndLoginAs("user");
        const tree = await createTree();
        const sponsorship = await Sponsorship.create({
            treeId: tree._id, sponsorId: sponsor._id, amount: 300, status: "rejected",
        });

        const res = await request(app).put(`/admin/approve/${sponsorship._id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(404); // status-gated query correctly finds nothing to update
    });

    it("should be rejected for a non-admin", async () => {
        const { cookie } = await createAndLoginAs("user");
        const res = await request(app).get("/admin/pending").set("Cookie", cookie);
        expect(res.statusCode).toBe(403);
    });
});

describe("Admin - assign farmer flow", () => {
    it("should assign a farmer to an approved request", async () => {
        const { cookie: adminCookie } = await createAndLoginAs("admin");
        const { user: sponsor } = await createAndLoginAs("user");
        const { user: farmer } = await createAndLoginAs("farmer");
        const tree = await createTree();
        const sponsorship = await Sponsorship.create({
            treeId: tree._id, sponsorId: sponsor._id, amount: 300, status: "approved",
        });

        const res = await request(app)
            .put("/admin/assign")
            .set("Cookie", adminCookie)
            .send({ sponsorshipId: sponsorship._id.toString(), farmerId: farmer._id.toString() });

        expect(res.statusCode).toBe(200);
        expect(res.body.sponsorship.status).toBe("assigned");
        expect(res.body.sponsorship.farmerId).toBe(farmer._id.toString());
    });

    it("should NOT allow assigning a farmer to a still-pending request", async () => {
        const { cookie: adminCookie } = await createAndLoginAs("admin");
        const { user: sponsor } = await createAndLoginAs("user");
        const { user: farmer } = await createAndLoginAs("farmer");
        const tree = await createTree();
        const sponsorship = await Sponsorship.create({
            treeId: tree._id, sponsorId: sponsor._id, amount: 300, status: "pending",
        });

        const res = await request(app)
            .put("/admin/assign")
            .set("Cookie", adminCookie)
            .send({ sponsorshipId: sponsorship._id.toString(), farmerId: farmer._id.toString() });

        expect(res.statusCode).toBe(404); // pending isn't approved yet — assignment correctly blocked
    });
});

describe("Admin - restore tree flow", () => {
    it("should restore only the specified tree, not all deleted trees", async () => {
        const { cookie } = await createAndLoginAs("admin");
        const treeA = await createTree();
        const treeB = await createTree();

        treeA.isDeleted = true; await treeA.save();
        treeB.isDeleted = true; await treeB.save();

        const res = await request(app).put(`/admin/restore/${treeA._id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(200);

        const refreshedA = await Tree.findById(treeA._id);
        const refreshedB = await Tree.findById(treeB._id);

        expect(refreshedA.isDeleted).toBe(false); // restored
        expect(refreshedB.isDeleted).toBe(true);  // untouched — this is the exact bug we caught in the old code
    });
});
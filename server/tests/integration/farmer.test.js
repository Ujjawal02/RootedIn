const request = require("supertest");
const app = require("../../src/app");
const db = require("../setup");
const User = require("../../src/models/user.model");
const Tree = require("../../src/models/tree.model");
const Sponsorship = require("../../src/models/sponsorship.model");

// fake Cloudinary, same idea as in tree.test.js
jest.mock("../../src/services/upload.service", () => ({
    uploadImage: jest.fn(),
    deleteImage: jest.fn(),
}));
const { uploadImage, deleteImage } = require("../../src/services/upload.service");

beforeAll(async () => await db.connect());

beforeEach(() => {
    uploadImage.mockResolvedValue({
        url: "https://res.cloudinary.com/demo/image/upload/growth1.jpg",
        public_id: "rootedin/growth-updates/growth1",
    });
    deleteImage.mockResolvedValue();
});

afterEach(async () => {
    jest.clearAllMocks();
    await db.clearDatabase();
});

afterAll(async () => await db.closeDatabase());

// ---------- helpers ----------

const createAndLoginAs = async (role, emailSuffix = "") => {
    const user = await User.create({
        name: { firstname: "Test", lastname: role },
        email: `${role}${emailSuffix}@example.com`,
        phone: "9876543210",
        password: "password123",
        role,
    });
    const res = await request(app)
        .post("/auth/login")
        .send({ email: user.email, password: "password123" });
    return { cookie: res.headers["set-cookie"], user };
};

const createTree = () =>
    Tree.create({
        name: "Mango",
        species: "Mangifera indica",
        image: { url: "https://example.com/mango.jpg" },
        price: 300,
        category: "Fruit",
        description: "A fruit-bearing tree.",
    });

const createAssignedSponsorship = async (sponsor, farmer) => {
    const tree = await createTree();
    return Sponsorship.create({
        treeId: tree._id,
        sponsorId: sponsor._id,
        farmerId: farmer._id,
        amount: 300,
        status: "assigned",
    });
};

const imageBuffer = Buffer.from("fake-image-bytes");

// ---------- tests ----------

describe("Farmer: assigned trees", () => {
    it("returns only the trees assigned to THIS farmer", async () => {
        const { cookie, user: farmerA } = await createAndLoginAs("farmer", "A");
        const { user: farmerB } = await createAndLoginAs("farmer", "B");
        const { user: sponsor } = await createAndLoginAs("user");

        await createAssignedSponsorship(sponsor, farmerA);
        await createAssignedSponsorship(sponsor, farmerB);

        const res = await request(app).get("/farmer/assigned").set("Cookie", cookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.assigned.length).toBe(1);
    });
});

describe("Farmer: mark completed", () => {
    it("moves assigned to completed for the owning farmer", async () => {
        const { cookie, user: farmer } = await createAndLoginAs("farmer");
        const { user: sponsor } = await createAndLoginAs("user");
        const sponsorship = await createAssignedSponsorship(sponsor, farmer);

        const res = await request(app).put(`/farmer/complete/${sponsorship._id}`).set("Cookie", cookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.sponsorship.status).toBe("completed");
    });

    it("does NOT let a different farmer complete someone else's tree", async () => {
        const { user: farmerA } = await createAndLoginAs("farmer", "A");
        const { cookie: cookieB } = await createAndLoginAs("farmer", "B");
        const { user: sponsor } = await createAndLoginAs("user");
        const sponsorship = await createAssignedSponsorship(sponsor, farmerA);

        const res = await request(app).put(`/farmer/complete/${sponsorship._id}`).set("Cookie", cookieB);

        expect(res.statusCode).toBe(404);
    });
});

describe("Farmer: growth updates", () => {
    it("posts an update with a photo, and both the farmer and the sponsor can read it", async () => {
        const { cookie: farmerCookie, user: farmer } = await createAndLoginAs("farmer");
        const { cookie: sponsorCookie, user: sponsor } = await createAndLoginAs("user");
        const sponsorship = await createAssignedSponsorship(sponsor, farmer);

        const postRes = await request(app)
            .post(`/farmer/updates/${sponsorship._id}`)
            .set("Cookie", farmerCookie)
            .field("note", "Healthy, grew about 2 inches this month.")
            .attach("image", imageBuffer, { filename: "growth1.jpg", contentType: "image/jpeg" });

        expect(postRes.statusCode).toBe(201);
        expect(postRes.body.update.image.public_id).toBe("rootedin/growth-updates/growth1");

        const farmerRead = await request(app)
            .get(`/sponsorship/${sponsorship._id}/updates`)
            .set("Cookie", farmerCookie);
        expect(farmerRead.body.updates.length).toBe(1);

        const sponsorRead = await request(app)
            .get(`/sponsorship/${sponsorship._id}/updates`)
            .set("Cookie", sponsorCookie);
        expect(sponsorRead.body.updates.length).toBe(1);
    });

    it("rejects an update with no photo (400)", async () => {
        const { cookie, user: farmer } = await createAndLoginAs("farmer");
        const { user: sponsor } = await createAndLoginAs("user");
        const sponsorship = await createAssignedSponsorship(sponsor, farmer);

        const res = await request(app)
            .post(`/farmer/updates/${sponsorship._id}`)
            .set("Cookie", cookie)
            .field("note", "A note without a photo.");

        expect(res.statusCode).toBe(400);
        expect(uploadImage).not.toHaveBeenCalled();
    });

    it("uploads nothing when the farmer does not own the sponsorship", async () => {
        const { user: farmerA } = await createAndLoginAs("farmer", "A");
        const { cookie: cookieB } = await createAndLoginAs("farmer", "B");
        const { user: sponsor } = await createAndLoginAs("user");
        const sponsorship = await createAssignedSponsorship(sponsor, farmerA);

        const res = await request(app)
            .post(`/farmer/updates/${sponsorship._id}`)
            .set("Cookie", cookieB)
            .field("note", "Trying to post on someone else's tree")
            .attach("image", imageBuffer, { filename: "x.jpg", contentType: "image/jpeg" });

        expect(res.statusCode).toBe(404);
        expect(uploadImage).not.toHaveBeenCalled(); // ownership is checked before the upload
    });

    it("does NOT let an unrelated user read someone else's growth updates", async () => {
        const { user: farmer } = await createAndLoginAs("farmer");
        const { user: sponsor } = await createAndLoginAs("user", "Real");
        const { cookie: strangerCookie } = await createAndLoginAs("user", "Stranger");
        const sponsorship = await createAssignedSponsorship(sponsor, farmer);

        const res = await request(app)
            .get(`/sponsorship/${sponsorship._id}/updates`)
            .set("Cookie", strangerCookie);

        expect(res.statusCode).toBe(404);
    });
});
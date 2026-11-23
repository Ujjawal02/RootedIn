const request = require("supertest");
const app = require("../../src/app");
const db = require("../setup");
const User = require("../../src/models/user.model");
const Tree = require("../../src/models/tree.model");

// The real upload service talks to Cloudinary over the internet.
// We swap it for fake functions so tests are fast and never touch the network.
jest.mock("../../src/services/upload.service", () => ({
    uploadImage: jest.fn(),
    deleteImage: jest.fn(),
}));
const { uploadImage, deleteImage } = require("../../src/services/upload.service");

beforeAll(async () => await db.connect());

beforeEach(() => {
    // what the fake upload "returns" every time it is called
    uploadImage.mockResolvedValue({
        url: "https://res.cloudinary.com/demo/image/upload/neem.jpg",
        public_id: "rootedin/trees/neem",
    });
    deleteImage.mockResolvedValue();
});

afterEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    await db.clearDatabase();
});

afterAll(async () => await db.closeDatabase());

// ---------- helpers ----------

const treeFields = {
    name: "Neem",
    species: "Azadirachta indica",
    price: "500",
    category: "Medicinal",
    description: "A fast-growing, medicinal tree native to India.",
};
const imageBuffer = Buffer.from("fake-image-bytes");

// creates a user with the given role directly in the database, logs in, returns the cookie
const createAndLoginAs = async (role) => {
    const user = await User.create({
        name: { firstname: "Test", lastname: role },
        email: `${role}@example.com`,
        phone: "9876543210",
        password: "password123",
        role,
    });
    const res = await request(app)
        .post("/auth/login")
        .send({ email: user.email, password: "password123" });
    return res.headers["set-cookie"];
};

// sends the same multipart form the browser sends: text fields + an image file
const postTree = (cookie, { withImage = true, contentType = "image/jpeg" } = {}) => {
    const req = request(app).post("/trees").set("Cookie", cookie).field(treeFields);
    return withImage
        ? req.attach("image", imageBuffer, { filename: "neem.jpg", contentType })
        : req;
};

// ---------- tests ----------

describe("Reading trees", () => {
    it("GET /trees returns an empty list when there are no trees", async () => {
        const res = await request(app).get("/trees");

        expect(res.statusCode).toBe(200);
        expect(res.body.trees).toEqual([]);
    });
});

describe("Who may create trees", () => {
    it("rejects a visitor who is not logged in (401)", async () => {
        const res = await request(app).post("/trees").send(treeFields);

        expect(res.statusCode).toBe(401);
        expect(uploadImage).not.toHaveBeenCalled(); // login is checked before any upload
    });

    it("rejects a logged-in normal user (403)", async () => {
        const cookie = await createAndLoginAs("user");
        const res = await request(app).post("/trees").set("Cookie", cookie).send(treeFields);

        expect(res.statusCode).toBe(403);
        expect(uploadImage).not.toHaveBeenCalled();
    });
});

describe("Creating a tree with an image", () => {
    it("uploads the image and stores its url and public_id", async () => {
        const cookie = await createAndLoginAs("admin");
        const res = await postTree(cookie);

        expect(res.statusCode).toBe(201);
        expect(res.body.tree.image).toEqual({
            url: "https://res.cloudinary.com/demo/image/upload/neem.jpg",
            public_id: "rootedin/trees/neem",
        });
        expect(uploadImage).toHaveBeenCalledTimes(1);
    });

    it("rejects a request with no image (400)", async () => {
        const cookie = await createAndLoginAs("admin");
        const res = await postTree(cookie, { withImage: false });

        expect(res.statusCode).toBe(400);
        expect(uploadImage).not.toHaveBeenCalled();
    });

    it("rejects a file that is not an image (400)", async () => {
        const cookie = await createAndLoginAs("admin");
        const res = await postTree(cookie, { contentType: "text/plain" });

        expect(res.statusCode).toBe(400);
        expect(uploadImage).not.toHaveBeenCalled();
    });

    it("deletes the uploaded image if saving the tree fails", async () => {
        const cookie = await createAndLoginAs("admin");
        // make the database save fail once, on purpose
        jest.spyOn(Tree, "create").mockRejectedValueOnce(new Error("db down"));

        const res = await postTree(cookie);

        expect(res.statusCode).toBe(500);
        expect(deleteImage).toHaveBeenCalledWith("rootedin/trees/neem"); // no orphan left in Cloudinary
    });
});

describe("Updating a tree", () => {
    const createOldTree = () =>
        Tree.create({
            name: "Mango",
            species: "Mangifera indica",
            price: 300,
            category: "Fruit",
            description: "A fruit-bearing tree.",
            image: {
                url: "https://res.cloudinary.com/demo/image/upload/old.jpg",
                public_id: "rootedin/trees/old",
            },
        });

    it("with a new image: saves the new one and deletes the old one", async () => {
        const cookie = await createAndLoginAs("admin");
        const tree = await createOldTree();

        const res = await request(app)
            .put(`/trees/${tree._id}`)
            .set("Cookie", cookie)
            .field("price", "650")
            .attach("image", imageBuffer, { filename: "new.jpg", contentType: "image/jpeg" });

        expect(res.statusCode).toBe(200);
        expect(res.body.tree.image.public_id).toBe("rootedin/trees/neem");
        expect(deleteImage).toHaveBeenCalledWith("rootedin/trees/old");
    });

    it("with text fields only: does not touch Cloudinary at all", async () => {
        const cookie = await createAndLoginAs("admin");
        const tree = await createOldTree();

        const res = await request(app)
            .put(`/trees/${tree._id}`)
            .set("Cookie", cookie)
            .send({ price: 650 });

        expect(res.statusCode).toBe(200);
        expect(res.body.tree.price).toBe(650);
        expect(uploadImage).not.toHaveBeenCalled();
        expect(deleteImage).not.toHaveBeenCalled();
    });
});

describe("Deleting a tree", () => {
    it("is a soft delete: hidden from the public, still in the database, image kept", async () => {
        const cookie = await createAndLoginAs("admin");
        const created = await postTree(cookie);
        const treeId = created.body.tree._id;

        const deleteRes = await request(app).delete(`/trees/${treeId}`).set("Cookie", cookie);
        expect(deleteRes.statusCode).toBe(200);

        const getRes = await request(app).get(`/trees/${treeId}`);
        expect(getRes.statusCode).toBe(404); // the public can no longer see it

        const inDb = await Tree.findById(treeId);
        expect(inDb.isDeleted).toBe(true); // but the record still exists, so it can be restored
        expect(deleteImage).not.toHaveBeenCalled(); // the image stays, because restore needs it
    });
});
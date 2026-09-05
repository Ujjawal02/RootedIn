const request = require("supertest");
const app = require("../../src/app");
const db = require("../setup");
const User = require("../../src/models/user.model");

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

const validSignupData = {
    name: { firstname: "Test", lastname: "User" },
    email: "testuser@example.com",
    phone: "9876543210",
    password: "password123",
};

describe("POST /auth/signup", () => {
    it("should create a new user with default role 'user'", async () => {
        const res = await request(app).post("/auth/signup").send(validSignupData);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);

        const userInDb = await User.findOne({ email: validSignupData.email });
        expect(userInDb).not.toBeNull();
        expect(userInDb.role).toBe("user"); // this is the actual test of the security fix
    });

    it("should IGNORE a role field sent by the client, never trusting it", async () => {
        const res = await request(app)
            .post("/auth/signup")
            .send({ ...validSignupData, role: "admin" }); // attacker tries to self-promote

        expect(res.statusCode).toBe(201);

        const userInDb = await User.findOne({ email: validSignupData.email });
        expect(userInDb.role).toBe("user"); // must NOT be "admin", no matter what the client sent
    });

    it("should reject signup with an invalid email", async () => {
        const res = await request(app)
            .post("/auth/signup")
            .send({ ...validSignupData, email: "not-an-email" });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it("should reject duplicate email signup", async () => {
        await request(app).post("/auth/signup").send(validSignupData);
        const res = await request(app).post("/auth/signup").send(validSignupData);

        expect(res.statusCode).toBe(409);
    });
});

describe("POST /auth/login", () => {
    beforeEach(async () => {
        await request(app).post("/auth/signup").send(validSignupData);
    });

    it("should log in with correct credentials and set a cookie", async () => {
        const res = await request(app).post("/auth/login").send({
            email: validSignupData.email,
            password: validSignupData.password,
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.headers["set-cookie"]).toBeDefined();
        expect(res.body.user.password).toBeUndefined(); // hash should never be sent back
    });

    it("should reject login with wrong password", async () => {
        const res = await request(app).post("/auth/login").send({
            email: validSignupData.email,
            password: "wrongpassword",
        });

        expect(res.statusCode).toBe(401);
    });

    it("should reject login for a non-existent email", async () => {
        const res = await request(app).post("/auth/login").send({
            email: "nobody@example.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(401);
    });
});
import request from "supertest";
import app from "../../server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

const mongoServer = new MongoMemoryServer()

describe("Auth", () => {
  
  beforeAll(async () => {
    await mongoServer.start();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  const userData = {
    username: "testuser",
    password: "testpassword",
  };

  describe("Auth Register Test", () => {
    it("should register a new user", async () => {
      const registerResponse = await request(app)
        .post("/api/v1/auth/register")
        .send(userData);
      expect(registerResponse.status).toBe(201);
    });
  });

  describe("Auth Login Test", () => {
    it("should login a registered user", async () => {
      const loginResponse = await request(app)
        .post("/api/v1/auth/login")
        .send(userData);
      expect(loginResponse.status).toBe(200);
    });
  });
});

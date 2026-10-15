import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";

declare global {
  var signin: () => string[];
}

// jest.mock("../nats-wrapper.ts");

jest.unstable_mockModule("../nats-wrapper.js", () => ({
  natsWrapper: {
    client: {
      publish: jest.fn((subject: string, data: string, callback: () => void) =>
        callback(),
      ),
    },
  },
}));

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
  jest.clearAllMocks();
});

beforeEach(async () => {
  const collections = await mongoose.connection.db?.collections();

  for (const collection of collections ?? []) {
    await collection.deleteMany({});
  }
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongoose.connection.close(); // close the connection first
  await mongo.stop(); // then stop the server
}, 10000);

global.signin = () => {
  // Build a JWT payload.  { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};

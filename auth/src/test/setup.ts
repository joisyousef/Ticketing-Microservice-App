import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app.js";
import { beforeEach } from "node:test";

let mongo: any;

beforeAll(async () => {
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlparser: true,
    useUnifiedToopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db?.collection();

  for (let collections of collections) {
    await collections.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
function beforeAll(arg0: () => Promise<void>) {
    throw new Error("Function not implemented.");
}


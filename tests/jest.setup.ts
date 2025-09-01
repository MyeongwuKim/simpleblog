import { MongoMemoryReplSet } from "mongodb-memory-server";
import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";
import { startMemoryMongo } from "./utils/memoryMongo";

let prisma: PrismaClient;
let myReplset: MongoMemoryReplSet;

beforeAll(async () => {
  console.log("[setup] start");

  const { replset, uri } = await startMemoryMongo();
  myReplset = replset;
  execSync("npx prisma db push", { stdio: "inherit" });
  prisma = new PrismaClient();
  await prisma.$connect();
});

afterAll(async () => {
  if (prisma) await prisma.$disconnect();
  if (myReplset) await myReplset.stop();
});

export { prisma };

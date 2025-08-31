import { MongoMemoryReplSet } from "mongodb-memory-server";

export async function startMemoryMongo(): Promise<{
  replset: MongoMemoryReplSet;
  uri: string;
}> {
  const replset = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: "wiredTiger" },
  });
  const uri = replset.getUri("testdb");
  process.env.DATABASE_URL = uri;

  return { replset, uri };
}

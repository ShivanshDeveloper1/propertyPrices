require("dotenv").config();
const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function seedCollection(db, fileName, collectionName) {
  const collection = db.collection(collectionName);

  const filePath = path.join(process.cwd(), "src", "lib", fileName);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  console.log(`📄 Loaded ${data.length} records from ${fileName}`);

  const operations = data.map((item) => {
    delete item._id; // 🔥 Important

    return {
      updateOne: {
        filter: { slug: item.slug },
        update: { $setOnInsert: item },
        upsert: true, // 👈 insert only if NOT exists
      },
    };
  });

  const result = await collection.bulkWrite(operations);

  console.log(`\n📊 Result:`);
  console.log(`   ✅ Inserted: ${result.upsertedCount}`);
  console.log(
    `   ⏭️ Skipped (duplicates): ${data.length - result.upsertedCount}`
  );
}

async function runSeed() {
  try {
    await client.connect();
    console.log("🚀 MongoDB Connected");

    const db = client.db("propertyDB");

    await seedCollection(db, "localities.json", "localities");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await client.close();
    console.log("🔚 MongoDB connection closed");
  }
}

runSeed();

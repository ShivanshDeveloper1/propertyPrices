const path = require("path");
const fs = require("fs");

// 1. FIX THE PATH: Force dotenv to look in the root folder
const envPath = path.resolve(process.cwd(), ".env.local");
require("dotenv").config({ path: envPath });

const mongoose = require("mongoose");

async function run() {
  try {
    const uri = process.env.MONGODB_URI;

    // DEBUG CHECK:
    if (!uri) {
      console.error("❌ ERROR: MONGODB_URI is undefined!");
      console.log("Looked for .env.local at:", envPath);
      console.log("Does the file exist?", fs.existsSync(envPath));
      process.exit(1);
    }

    console.log("🚀 Connecting to MongoDB...");
    await mongoose.connect(uri, {
      dbName: "propertyDB",
    });
    console.log("✅ Connected to propertyDB");

    // ... rest of your code remains the same ...
    const filePath = path.join(process.cwd(), "blogs", "saharanpur-web-devloper.json");
    
    // Define Schema & Model inside or outside run() - outside is usually better
    // (Using the schema code you provided earlier)
    const blogSchema = new mongoose.Schema({
        post: {
            metadata: {
                slug: { type: String, required: true, index: true },
                title: { type: String, required: true },
            }
        }
    }, { strict: false });
    const BlogModel = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at: ${filePath}`);
    }

    const blogData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const slug = blogData.post.metadata.slug;

    const existing = await BlogModel.findOne({ "post.metadata.slug": slug });

    if (existing) {
      console.log(`⚠️ Blog with slug "${slug}" already exists. Skipping.`);
    } else {
      await BlogModel.create(blogData);
      console.log(`🚀 Successfully uploaded: ${slug}`);
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔚 Connection closed.");
    process.exit();
  }
}

run();
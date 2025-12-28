import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const MONGO_URI = process.env.MONGODB_URI

async function testDB() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("✅ MongoDB Atlas connected")
    process.exit(0)
  } catch (err) {
    console.error("❌ Connection failed:", err)
    process.exit(1)
  }
}

testDB()

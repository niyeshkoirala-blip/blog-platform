import { MongoClient, type Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MONGODB_URI to the Vars section in the sidebar.")
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve the value across module reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, create a new client
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function getDatabase(): Promise<Db> {
  try {
    const client = await clientPromise
    await client.db("admin").command({ ping: 1 })
    console.log("[v0] MongoDB connected successfully and verified")
    return client.db("devlog")
  } catch (error) {
    console.error("[v0] MongoDB connection error:", error)
    throw new Error("DATABASE_CONNECTION_FAILED")
  }
}

export default clientPromise

import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/get-user"
import type { CreateApproachInput } from "@/lib/models/approach"

// GET - Fetch all published approach items
export async function GET() {
  try {
    const db = await getDatabase()
    const approachCollection = db.collection("approach_items")

    const items = await approachCollection.find({ published: true }).sort({ order: 1 }).toArray()

    return NextResponse.json({ items }, { status: 200 })
  } catch (error) {
    console.error("[v0] Fetch approach items error:", error)
    return NextResponse.json({ error: "Failed to fetch approach items" }, { status: 500 })
  }
}

// POST - Create a new approach item (requires authentication)
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body: CreateApproachInput = await request.json()

    // Validate required fields
    if (!body.title || !body.description || body.order === undefined) {
      return NextResponse.json({ error: "Title, description, and order are required" }, { status: 400 })
    }

    const db = await getDatabase()
    const approachCollection = db.collection("approach_items")

    const newItem = {
      title: body.title,
      description: body.description,
      order: body.order,
      icon: body.icon || null,
      published: body.published ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await approachCollection.insertOne(newItem)

    return NextResponse.json(
      {
        message: "Approach item created successfully",
        id: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Create approach item error:", error)
    return NextResponse.json({ error: "Failed to create approach item" }, { status: 500 })
  }
}

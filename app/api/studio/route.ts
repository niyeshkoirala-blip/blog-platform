import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/get-user"
import type { CreateStudioPostInput } from "@/lib/models/studio-post"

// GET - Fetch all published studio posts
export async function GET() {
  try {
    const db = await getDatabase()
    const studioCollection = db.collection("studio_posts")

    const posts = await studioCollection.find({ published: true }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ posts }, { status: 200 })
  } catch (error) {
    console.error("[v0] Fetch studio posts error:", error)
    return NextResponse.json({ error: "Failed to fetch studio posts" }, { status: 500 })
  }
}

// POST - Create a new studio post (requires authentication)
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body: CreateStudioPostInput = await request.json()

    // Validate required fields
    if (!body.title || !body.description || !body.category) {
      return NextResponse.json({ error: "Title, description, and category are required" }, { status: 400 })
    }

    const db = await getDatabase()
    const studioCollection = db.collection("studio_posts")

    const newPost = {
      title: body.title,
      description: body.description,
      imageUrl: body.imageUrl || null,
      category: body.category,
      tags: body.tags || [],
      authorId: user._id.toString(),
      authorName: user.name || user.email,
      published: body.published ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await studioCollection.insertOne(newPost)

    return NextResponse.json(
      {
        message: "Studio post created successfully",
        id: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Create studio post error:", error)
    return NextResponse.json({ error: "Failed to create studio post" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/get-user"
import type { CreatePostInput } from "@/lib/models/post"

export const dynamic = "force-dynamic" // Force dynamic rendering - disable Next.js caching

// GET - Fetch all published posts from all users
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const authorId = searchParams.get("authorId")
    const category = searchParams.get("category")

    const db = await getDatabase()
    const postsCollection = db.collection("posts")

    // Build query filter
    const filter: any = { published: true }
    if (authorId) {
      filter.authorId = authorId
    }
    if (category && category !== "All") {
      filter.category = category
    }

    console.log("[v0] Fetching posts with filter:", filter)
    const posts = await postsCollection.find(filter).sort({ createdAt: -1 }).limit(50).toArray()
    console.log("[v0] Found posts count:", posts.length)

    const response = NextResponse.json({ posts }, { status: 200 })
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    return response
  } catch (error) {
    console.error("[v0] Fetch posts error:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

// POST - Create a new post (requires authentication)
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body: CreatePostInput = await request.json()

    // Validate required fields
    if (!body.title || !body.slug || !body.excerpt || !body.content || !body.category) {
      return NextResponse.json({ error: "Title, slug, excerpt, content, and category are required" }, { status: 400 })
    }

    const db = await getDatabase()
    const postsCollection = db.collection("posts")

    // Check if slug already exists
    const existingPost = await postsCollection.findOne({ slug: body.slug })
    if (existingPost) {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 })
    }

    const newPost = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category,
      imageUrl: body.imageUrl || "/placeholder.svg?height=400&width=600",
      authorId: user._id,
      authorName: user.name || user.email,
      authorEmail: user.email,
      published: body.published ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await postsCollection.insertOne(newPost)

    return NextResponse.json(
      {
        message: "Post created successfully",
        id: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Create post error:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/get-user"

/**
 * DELETE /api/posts/[postId]
 *
 * Deletes a blog post.
 * Only the post author can delete their own posts.
 * Returns 404 if post not found or 403 if user is not the author.
 */
export async function DELETE(request: Request, { params }: { params: { postId: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Authentication required. Please log in to delete posts." }, { status: 401 })
    }

    if (!ObjectId.isValid(params.postId)) {
      return NextResponse.json({ error: "Invalid post ID format" }, { status: 400 })
    }

    const db = await getDatabase()
    const postsCollection = db.collection("posts")

    const post = await postsCollection.findOne({
      _id: new ObjectId(params.postId),
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const postAuthorId =
      typeof post.authorId === "string" ? post.authorId : (post.authorId as any)?.$oid || String(post.authorId)

    const currentUserId =
      typeof currentUser._id === "string" ? currentUser._id : (currentUser._id as any)?.$oid || String(currentUser._id)

    if (postAuthorId !== currentUserId) {
      return NextResponse.json({ error: "You can only delete your own posts" }, { status: 403 })
    }

    const result = await postsCollection.deleteOne({
      _id: new ObjectId(params.postId),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
    }

    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("[v0] Delete post error:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}

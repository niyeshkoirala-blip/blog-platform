"use client"

import { BlogCard } from "@/components/blog-card"
import { useState, useEffect } from "react"
import { RefreshCw } from "lucide-react"

interface Post {
  _id: string
  title: string
  slug: string
  excerpt: string
  category: string
  imageUrl: string
  authorId: string
  authorName: string
  createdAt: string
}

export default function JournalPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshPosts = async () => {
    try {
      setLoading(true)
      const url = selectedCategory === "All" ? "/api/posts" : `/api/posts?category=${selectedCategory}`
      const urlWithTimestamp = `${url}?t=${Date.now()}`
      const response = await fetch(urlWithTimestamp, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
      const data = await response.json()
      setPosts(data.posts || [])
      console.log("[v0] Posts refreshed, count:", data.posts?.length || 0)
    } catch (error) {
      console.error("[v0] Failed to fetch posts:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshPosts()
  }, [selectedCategory])

  const handlePostDeleted = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => {
        const safePostId = typeof post._id === "string" ? post._id : post._id?.toString()
        return safePostId !== postId
      }),
    )
  }

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    await refreshPosts()
    setIsRefreshing(false)
  }

  return (
    <div className="container mx-auto px-6 py-20 md:py-32">
      <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-xl">
          <h1 className="mb-4 text-4xl font-bold tracking-tighter md:text-6xl">Journal</h1>
          <p className="text-lg text-muted-foreground">
            A collection of thoughts, tutorials, and deep dives into the technologies we use and the philosophies we
            follow.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", "Engineering", "Design", "Performance", "Culture"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing || loading}
            className="rounded-full border border-border px-4 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-50"
            title="Refresh posts from database"
          >
            <RefreshCw size={14} className={`inline-block mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-muted-foreground">Loading posts...</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">No posts found.</p>
            <p className="mt-2 text-sm text-muted-foreground">Be the first to create a post!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-2">
          {posts.map((post) => (
            <BlogCard
              key={post._id}
              title={post.title}
              description={post.excerpt}
              date={new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              category={post.category}
              image={post.imageUrl}
              slug={post.slug}
              postId={post._id}
              authorName={post.authorName}
              authorId={post.authorId}
              onPostDeleted={handlePostDeleted}
            />
          ))}
        </div>
      )}
    </div>
  )
}

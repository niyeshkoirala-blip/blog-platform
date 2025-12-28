"use client"

import { BlogCard } from "@/components/blog-card"
import { useState, useEffect } from "react"

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

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        const url = selectedCategory === "All" ? "/api/posts" : `/api/posts?category=${selectedCategory}`
        const response = await fetch(url)
        const data = await response.json()
        setPosts(data.posts || [])
      } catch (error) {
        console.error("[v0] Failed to fetch posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [selectedCategory])

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
              authorName={post.authorName}
              authorId={post.authorId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

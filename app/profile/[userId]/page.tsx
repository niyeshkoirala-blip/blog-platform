"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { BlogCard } from "@/components/blog-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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

interface User {
  _id: string
  name: string
  email: string
  bio?: string
  createdAt: string
}

export default function UserProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const resolvedParams = use(params)
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserAndPosts() {
      try {
        setLoading(true)

        // Fetch user profile
        const userResponse = await fetch(`/api/users/${resolvedParams.userId}`)
        const userData = await userResponse.json()

        if (userResponse.ok) {
          setUser(userData.user)
        }

        // Fetch user's posts
        const postsResponse = await fetch(`/api/posts?authorId=${resolvedParams.userId}`)
        const postsData = await postsResponse.json()

        if (postsResponse.ok) {
          setPosts(postsData.posts || [])
        }
      } catch (error) {
        console.error("[v0] Failed to fetch user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndPosts()
  }, [resolvedParams.userId])

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-muted-foreground">Loading profile...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">User not found</h1>
          <Link href="/journal">
            <Button>Back to Journal</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-20 md:py-32">
      {/* Profile Header */}
      <div className="mb-16 flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-center md:gap-8">
        <div className="flex size-24 items-center justify-center rounded-full bg-muted text-4xl font-bold">
          {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="mb-2 text-4xl font-bold tracking-tight">{user.name || user.email}</h1>
          {user.bio && <p className="text-lg text-muted-foreground">{user.bio}</p>}
          <p className="mt-2 text-sm text-muted-foreground">
            Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">
          Posts by {user.name || user.email} ({posts.length})
        </h2>
      </div>

      {posts.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed border-border">
          <p className="text-muted-foreground">No posts yet</p>
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

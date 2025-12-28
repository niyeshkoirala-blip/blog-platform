"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import { LogoutButton } from "@/components/logout-button"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { BlogCard } from "@/components/blog-card"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useUser()
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [postsLoading, setPostsLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user?._id) return

    const fetchUserPosts = async () => {
      try {
        setPostsLoading(true)
        const userId = typeof user._id === "string" ? user._id : (user._id as any)?.$oid || String(user._id)
        const response = await fetch(`/api/posts?authorId=${userId}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
        })
        const data = await response.json()
        setUserPosts(data.posts || [])
      } catch (error) {
        console.error("Failed to fetch user posts:", error)
        setUserPosts([])
      } finally {
        setPostsLoading(false)
      }
    }

    fetchUserPosts()
  }, [user?._id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const userId = typeof user._id === "string" ? user._id : (user._id as any)?.$oid || String(user._id)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
              <p className="mt-2 text-muted-foreground">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`/profile/${userId}`}>
                <Button variant="outline" size="sm">
                  View Public Profile
                </Button>
              </Link>
              <LogoutButton />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold text-lg">Profile</h3>
              <div className="mt-4 space-y-2 text-sm">
                <p className="text-muted-foreground">Name: {user.name}</p>
                <p className="text-muted-foreground">Email: {user.email}</p>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold text-lg">Stats</h3>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>Posts: {userPosts.length}</p>
                <p>Total words: {userPosts.reduce((sum, post) => sum + (post.content?.split(" ").length || 0), 0)}</p>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold text-lg">Quick Actions</h3>
              <div className="mt-4 flex flex-col gap-2">
                <Link href="/journal/create" className="text-sm text-primary hover:underline">
                  Create new post
                </Link>
                <Link href="/journal" className="text-sm text-muted-foreground hover:underline">
                  Browse Global Feed
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Your Recent Posts</h2>
            {postsLoading ? (
              <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
                <p>Loading your posts...</p>
              </div>
            ) : userPosts.length === 0 ? (
              <div className="rounded-lg border bg-card p-12 text-center text-muted-foreground">
                <p>You haven't written any posts yet.</p>
                <Link href="/journal/create">
                  <Button variant="link" className="mt-2">
                    Write your first post
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {userPosts.map((post) => (
                  <BlogCard
                    key={post._id}
                    title={post.title}
                    excerpt={post.excerpt}
                    category={post.category}
                    authorName={post.authorName}
                    imageUrl={post.imageUrl}
                    createdAt={post.createdAt}
                    authorId={post.authorId}
                    postId={post._id}
                    onPostDeleted={() => {
                      setUserPosts(userPosts.filter((p) => p._id !== post._id))
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

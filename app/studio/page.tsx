import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/get-user"

async function getStudioPosts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/studio`, {
      cache: "no-store",
    })
    if (!response.ok) return { posts: [] }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("[v0] Failed to fetch studio posts:", error)
    return { posts: [] }
  }
}

export default async function StudioPage() {
  const user = await getCurrentUser()
  const { posts } = await getStudioPosts()

  return (
    <div className="container mx-auto px-6 py-20 md:py-32">
      <div className="mb-16 flex items-end justify-between">
        <div>
          <h1 className="mb-4 text-5xl font-bold tracking-tighter md:text-7xl">Studio</h1>
          <p className="text-lg text-muted-foreground">Our latest work and creative explorations</p>
        </div>
        {user && (
          <Link href="/studio/create">
            <Button>Create Post</Button>
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-border">
          <div className="text-center">
            <h3 className="mb-2 text-xl font-bold">No studio posts yet</h3>
            <p className="text-muted-foreground">
              {user ? "Create your first studio post to get started." : "Check back soon for new content."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <article
              key={post._id}
              className="group overflow-hidden rounded-2xl border border-border bg-muted/30 transition-all hover:border-foreground/20"
            >
              {post.imageUrl && (
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={post.imageUrl || "/placeholder.svg"}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-foreground/10 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>
                <h2 className="mb-3 text-2xl font-bold tracking-tight">{post.title}</h2>
                <p className="mb-4 line-clamp-3 text-muted-foreground">{post.description}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string, index: number) => (
                      <span key={index} className="text-xs text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

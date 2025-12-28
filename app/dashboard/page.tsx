import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/get-user"
import { LogoutButton } from "@/components/logout-button"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

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
                <p>Posts: 0</p>
                <p>Views: 0</p>
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
            <h2 className="text-2xl font-bold">Your Recent Activity</h2>
            <div className="rounded-lg border bg-card p-12 text-center text-muted-foreground">
              <p>Your recent posts and activity will appear here.</p>
              <Link href="/journal/create">
                <Button variant="link" className="mt-2">
                  Write your first post
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/get-user"

async function getApproachItems() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/approach`, {
      cache: "no-store",
    })
    if (!response.ok) return { items: [] }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("[v0] Failed to fetch approach items:", error)
    return { items: [] }
  }
}

export default async function ApproachPage() {
  const user = await getCurrentUser()
  const { items } = await getApproachItems()

  return (
    <div className="container mx-auto px-6 py-20 md:py-32">
      <div className="mb-16 flex items-end justify-between">
        <div className="max-w-2xl">
          <h1 className="mb-4 text-5xl font-bold tracking-tighter md:text-7xl">Our Approach</h1>
          <p className="text-lg text-muted-foreground">
            How we transform complex challenges into elegant solutions through systematic thinking and creative problem
            solving.
          </p>
        </div>
        {user && (
          <Link href="/approach/create">
            <Button>Add Item</Button>
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-border">
          <div className="text-center">
            <h3 className="mb-2 text-xl font-bold">No approach items yet</h3>
            <p className="text-muted-foreground">
              {user ? "Add your first approach item to define your methodology." : "Check back soon for new content."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {items.map((item: any, index: number) => (
            <div
              key={item._id}
              className="group rounded-2xl border border-border bg-muted/30 p-8 transition-all hover:border-foreground/20 md:p-12"
            >
              <div className="flex items-start gap-6">
                {item.icon && <div className="text-4xl">{item.icon}</div>}
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-4">
                    <span className="text-sm font-bold text-muted-foreground">Step {item.order}</span>
                  </div>
                  <h2 className="mb-4 text-3xl font-bold tracking-tight">{item.title}</h2>
                  <p className="text-lg leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

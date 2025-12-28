import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/get-user"
import { CreateApproachItem } from "@/components/create-approach-item"

export default async function CreateApproachItemPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?callbackUrl=/approach/create")
  }

  return (
    <div className="container mx-auto max-w-2xl px-6 py-20 md:py-32">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tighter md:text-5xl">Add Approach Item</h1>
        <p className="text-muted-foreground">Define your methodology and systematic thinking process</p>
      </div>
      <div className="rounded-2xl border border-border bg-muted/30 p-8 md:p-12">
        <CreateApproachItem />
      </div>
    </div>
  )
}

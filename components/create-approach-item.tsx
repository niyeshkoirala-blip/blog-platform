"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function CreateApproachItem() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      order: Number.parseInt(formData.get("order") as string),
      icon: formData.get("icon") as string,
      published: formData.get("published") === "on",
    }

    try {
      const response = await fetch("/api/approach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create approach item")
      }

      router.push("/approach")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-600 text-sm">{error}</div>
      )}
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-xs font-bold uppercase tracking-widest">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className="h-12 rounded-lg border border-border bg-transparent px-4 outline-none transition-colors focus:border-foreground"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="order" className="text-xs font-bold uppercase tracking-widest">
          Order
        </label>
        <input
          id="order"
          name="order"
          type="number"
          min="1"
          className="h-12 rounded-lg border border-border bg-transparent px-4 outline-none transition-colors focus:border-foreground"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="icon" className="text-xs font-bold uppercase tracking-widest">
          Icon (optional emoji or symbol)
        </label>
        <input
          id="icon"
          name="icon"
          type="text"
          maxLength={2}
          className="h-12 rounded-lg border border-border bg-transparent px-4 outline-none transition-colors focus:border-foreground"
          disabled={isSubmitting}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-xs font-bold uppercase tracking-widest">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="resize-none rounded-lg border border-border bg-transparent p-4 outline-none transition-colors focus:border-foreground"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="flex items-center gap-3">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked
          className="h-5 w-5 rounded border-border"
          disabled={isSubmitting}
        />
        <label htmlFor="published" className="text-sm">
          Publish immediately
        </label>
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating..." : "Create Approach Item"}
      </Button>
    </form>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function CreateStudioPost() {
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
      category: formData.get("category") as string,
      imageUrl: formData.get("imageUrl") as string,
      tags: (formData.get("tags") as string).split(",").map((tag) => tag.trim()),
      published: formData.get("published") === "on",
    }

    try {
      const response = await fetch("/api/studio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create post")
      }

      router.push("/studio")
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
        <label htmlFor="category" className="text-xs font-bold uppercase tracking-widest">
          Category
        </label>
        <input
          id="category"
          name="category"
          type="text"
          className="h-12 rounded-lg border border-border bg-transparent px-4 outline-none transition-colors focus:border-foreground"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="imageUrl" className="text-xs font-bold uppercase tracking-widest">
          Image URL (optional)
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          className="h-12 rounded-lg border border-border bg-transparent px-4 outline-none transition-colors focus:border-foreground"
          disabled={isSubmitting}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="tags" className="text-xs font-bold uppercase tracking-widest">
          Tags (comma separated)
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          placeholder="react, nextjs, typescript"
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
          rows={6}
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
        {isSubmitting ? "Creating..." : "Create Studio Post"}
      </Button>
    </form>
  )
}

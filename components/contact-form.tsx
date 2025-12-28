"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function ContactForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message")
      }

      setSuccess(true)
      // Reset form
      e.currentTarget.reset()

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {success && (
        <div className="col-span-full rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-green-600 text-sm">
          Message sent successfully! We'll get back to you soon.
        </div>
      )}
      {error && (
        <div className="col-span-full rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-600 text-sm">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="h-12 border-b border-border bg-transparent outline-none transition-colors focus:border-foreground"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="h-12 border-b border-border bg-transparent outline-none transition-colors focus:border-foreground"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="flex flex-col gap-2 md:col-span-2">
        <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="resize-none border-b border-border bg-transparent py-4 outline-none transition-colors focus:border-foreground"
          required
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 h-14 rounded-full bg-foreground text-sm font-bold text-background transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed md:col-span-2"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  )
}

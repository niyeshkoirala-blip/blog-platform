"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] Global error caught:", error)
  }, [error])

  const isDatabaseError = error.message === "DATABASE_CONNECTION_FAILED"

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 rounded-full bg-destructive/10 p-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
      </div>
      <h2 className="mb-2 text-2xl font-bold tracking-tight">
        {isDatabaseError ? "Database Connection Failed" : "Something went wrong"}
      </h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        {isDatabaseError
          ? "We're having trouble connecting to the database. Please check your MONGODB_URI in the Vars sidebar."
          : "An unexpected error occurred. We've been notified and are looking into it."}
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="rounded-full bg-foreground px-8 py-2 text-sm font-medium text-background transition-transform hover:scale-105"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-full border border-border px-8 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Back Home
        </Link>
      </div>
    </div>
  )
}

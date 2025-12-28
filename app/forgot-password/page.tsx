"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [devToken, setDevToken] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to send reset link")
        setLoading(false)
        return
      }

      setSuccess(true)
      // Store dev token for development
      if (data.devToken) {
        setDevToken(data.devToken)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
            <p className="mt-2 text-muted-foreground">
              If an account exists with {email}, you will receive a password reset link shortly.
            </p>

            {devToken && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-left">
                <p className="text-sm font-medium text-yellow-800 mb-2">Development Mode</p>
                <p className="text-xs text-yellow-700 mb-2">Use this link to reset your password:</p>
                <Link
                  href={`/reset-password?token=${devToken}`}
                  className="text-xs text-blue-600 hover:underline break-all"
                >
                  Reset Password Link
                </Link>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link href="/login" className="text-sm text-foreground hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Forgot password?</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-foreground hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

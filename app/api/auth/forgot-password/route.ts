import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { createToken } from "@/lib/auth"
import type { User } from "@/lib/models/user"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    // Find user by email
    const user = (await usersCollection.findOne({ email })) as User | null
    if (!user) {
      // Return success even if user doesn't exist (security best practice)
      return NextResponse.json(
        {
          message: "If an account with that email exists, a password reset link has been sent.",
        },
        { status: 200 }
      )
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = await createToken({
      userId: user._id?.toString(),
      email: user.email,
      type: "password-reset",
    })

    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Store reset token in database
    await usersCollection.updateOne({ email }, { $set: { resetToken, resetTokenExpiry } })

    // In production, you would send an email here
    // For development, return the token directly
    return NextResponse.json(
      {
        message: "If an account with that email exists, a password reset link has been sent.",
        // Remove this in production - only for development
        devToken: resetToken,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[v0] Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

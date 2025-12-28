import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken, hashPassword } from "@/lib/auth"
import type { User } from "@/lib/models/user"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json({ error: "Token and new password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Verify token
    const payload = await verifyToken(token)
    if (!payload || payload.type !== "password-reset") {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 401 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    // Find user with valid reset token
    const user = (await usersCollection.findOne({
      email: payload.email as string,
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    })) as User | null

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 401 })
    }

    // Hash new password
    const hashedPassword = await hashPassword(password)

    // Update password and clear reset token
    await usersCollection.updateOne(
      { email: user.email },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpiry: "" },
      }
    )

    return NextResponse.json({ message: "Password has been reset successfully" }, { status: 200 })
  } catch (error) {
    console.error("[v0] Reset password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

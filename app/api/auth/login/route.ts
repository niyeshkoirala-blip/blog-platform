import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyPassword, createToken, sanitizeUser } from "@/lib/auth"
import type { User } from "@/lib/models/user"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    // Find user
    const user = (await usersCollection.findOne({ email })) as User | null
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create JWT token
    const token = await createToken(sanitizeUser(user))

    // Set cookie and return user
    const response = NextResponse.json({ user: sanitizeUser(user) }, { status: 200 })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { hashPassword, createToken, sanitizeUser } from "@/lib/auth"
import type { CreateUserInput } from "@/lib/models/user"

export async function POST(request: Request) {
  try {
    const body: CreateUserInput = await request.json()
    const { email, password, name } = body

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const newUser = {
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await usersCollection.insertOne(newUser)
    const userWithId = { ...newUser, _id: result.insertedId }

    // Create JWT token
    const token = await createToken(sanitizeUser(userWithId))

    // Set cookie and return user
    const response = NextResponse.json({ user: sanitizeUser(userWithId) }, { status: 201 })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("[v0] Signup error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Check if the error is related to missing env vars
    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      return NextResponse.json(
        { error: "Database configuration missing. Please check your environment variables." },
        { status: 500 },
      )
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

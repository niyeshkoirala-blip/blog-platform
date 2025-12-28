import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { CreateContactInput } from "@/lib/models/contact"

export async function POST(request: Request) {
  try {
    const body: CreateContactInput = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const db = await getDatabase()
    const contactsCollection = db.collection("contacts")

    const newContact = {
      name: body.name,
      email: body.email,
      message: body.message,
      status: "new" as const,
      createdAt: new Date(),
    }

    const result = await contactsCollection.insertOne(newContact)

    return NextResponse.json(
      {
        message: "Contact message sent successfully",
        id: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Contact submission error:", error)
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 })
  }
}

export async function GET() {
  try {
    const db = await getDatabase()
    const contactsCollection = db.collection("contacts")

    const contacts = await contactsCollection.find({}).sort({ createdAt: -1 }).limit(50).toArray()

    return NextResponse.json({ contacts }, { status: 200 })
  } catch (error) {
    console.error("[v0] Fetch contacts error:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

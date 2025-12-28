import type { ObjectId } from "mongodb"

export interface ContactMessage {
  _id?: ObjectId
  name: string
  email: string
  message: string
  status: "new" | "read" | "replied"
  createdAt: Date
}

export interface CreateContactInput {
  name: string
  email: string
  message: string
}

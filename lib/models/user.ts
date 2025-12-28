import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  password: string
  name?: string
  bio?: string
  avatar?: string
  createdAt: Date
}

export interface CreateUserInput {
  email: string
  password: string
  name: string
}

export interface UserProfile {
  _id: ObjectId
  name: string
  email: string
  bio?: string
  avatar?: string
  createdAt: Date
}

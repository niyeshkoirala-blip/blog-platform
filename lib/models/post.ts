import type { ObjectId } from "mongodb"

export interface Post {
  _id?: ObjectId
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  imageUrl: string
  authorId: ObjectId
  authorName: string
  authorEmail?: string
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreatePostInput {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  imageUrl?: string
  published?: boolean
}

export interface StudioItem {
  _id?: ObjectId
  title: string
  description: string
  imageUrl: string
  category: string
  createdAt: Date
}

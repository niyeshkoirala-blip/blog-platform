import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_for_development_only"
const key = new TextEncoder().encode(JWT_SECRET)

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash)
}

export async function createToken(payload: any) {
  return await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    return null
  }
}

export function sanitizeUser(user: any) {
  if (!user) return null

  // Create a deep copy and remove sensitive fields
  const safeUser = { ...user }
  delete safeUser.password

  // Ensure _id is a string, handling MongoDB ObjectId or serialized version
  if (safeUser._id) {
    if (typeof safeUser._id === "object" && safeUser._id.toString) {
      safeUser._id = safeUser._id.toString()
    } else if (typeof safeUser._id !== "string") {
      // Fallback for cases like {$oid: ...}
      safeUser._id = String(safeUser._id)
    }
  }

  // Final pass through JSON to ensure it's a plain object (removes MongoDB hidden methods)
  return JSON.parse(JSON.stringify(safeUser))
}

import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    return null
  }

  return await verifyToken(token)
}

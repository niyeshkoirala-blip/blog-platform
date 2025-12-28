"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/use-user"

export function LogoutButton() {
  const router = useRouter()
  const { mutate } = useUser()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      mutate(null)
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  return (
    <Button onClick={handleLogout} variant="outline" size="sm" className="rounded-full text-xs px-4 bg-transparent">
      Logout
    </Button>
  )
}

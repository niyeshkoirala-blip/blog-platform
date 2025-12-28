"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useUser } from "@/hooks/use-user"
import { LogoutButton } from "@/components/logout-button"

const navItems = [
  { name: "Journal", path: "/journal" },
  { name: "Approach", path: "/approach" },
  { name: "Studio", path: "/studio" },
  { name: "Contact", path: "/contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const { user, isLoading } = useUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            DEVLOG
          </Link>
          <div className="hidden space-x-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  pathname === item.path ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:block">
            EST. 2025
          </span>
          <div className="hidden h-4 w-[1px] bg-border md:block" />

          {!isLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/journal/create"
                    className="hidden text-sm font-medium transition-colors hover:text-muted-foreground md:block"
                  >
                    Create
                  </Link>
                  <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-muted-foreground">
                    Dashboard
                  </Link>
                  <LogoutButton className="rounded-full bg-border px-4 py-1.5 text-xs font-medium text-foreground transition-transform hover:scale-105" />
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium transition-colors hover:text-muted-foreground">
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background transition-transform hover:scale-105 active:scale-95"
                  >
                    Join
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

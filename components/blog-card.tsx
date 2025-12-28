"use client"

import Link from "next/link"
import Image from "next/image"

interface BlogCardProps {
  title: string
  description: string
  date: string
  category: string
  image: string
  slug: string
  authorName?: string
  authorId?: string
}

export function BlogCard({ title, description, date, category, image, slug, authorName, authorId }: BlogCardProps) {
  const safeAuthorId = authorId
    ? typeof authorId === "string"
      ? authorId
      : (authorId as any)?.$oid || String(authorId)
    : null

  return (
    <div className="group flex flex-col gap-4">
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="rounded-full bg-background/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
            {category}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{date}</span>
        <h3 className="text-xl font-bold tracking-tight transition-colors group-hover:text-muted-foreground md:text-2xl">
          {title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        {authorName && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
              {authorName.charAt(0).toUpperCase()}
            </div>
            {safeAuthorId ? (
              <Link
                href={`/profile/${safeAuthorId}`}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {authorName}
              </Link>
            ) : (
              <span className="text-xs text-muted-foreground">{authorName}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

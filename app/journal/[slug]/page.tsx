import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // In a real app, this would fetch from a DB or CMS
  const post = {
    title: "Engineering for Longevity",
    date: "December 15, 2025",
    category: "Engineering",
    author: "Alex Rivera",
    image: "/abstract-structural-engineering.jpg",
    content: `
      <p className="text-xl leading-relaxed text-foreground mb-8">
        In an industry that moves at breakneck speed, building software that lasts isn't just a technical challenge—it's a philosophical one.
      </p>
      
      <h2 className="text-2xl font-bold tracking-tight mb-4 mt-12">The Paradox of Choice</h2>
      <p className="mb-6 leading-relaxed">
        The modern developer is bombarded with new frameworks, libraries, and paradigms every single day. The temptation to reach for the "newest" thing is strong, but often, the newest thing is the least tested for longevity. We've found that the secret to longevity isn't choosing the most cutting-edge tech, but choosing the most stable abstractions.
      </p>

      <blockquote className="border-l-4 border-foreground pl-6 py-2 my-10 italic text-lg">
        "The best code is no code. The second best code is code that is easy to delete when it's no longer needed."
      </blockquote>

      <h2 className="text-2xl font-bold tracking-tight mb-4 mt-12">Stability over Velocity</h2>
      <p className="mb-6 leading-relaxed">
        Velocity is often measured in features per sprint. Longevity is measured in how many features still work without modification three years later. By focusing on standard protocols, clean interfaces, and minimal dependencies, we ensure that our systems remain maintainable long after the initial hype of a technology has faded.
      </p>

      <div className="my-12 relative aspect-video overflow-hidden rounded-2xl border border-border">
        <Image 
          src="/minimalist-geometric-design.jpg" 
          alt="Structural integrity illustration" 
          fill 
          className="object-cover"
        />
      </div>

      <h2 className="text-2xl font-bold tracking-tight mb-4 mt-12">Conclusion</h2>
      <p className="mb-6 leading-relaxed">
        Engineering for longevity requires a shift in mindset. It's about being a steward of the codebase, not just a contributor. It's about thinking in decades, not in quarters.
      </p>
    `,
  }

  return (
    <article className="pb-24 pt-12 md:pb-32 md:pt-20">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/journal"
            className="group mb-12 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Journal
          </Link>

          <div className="mb-12 flex flex-col gap-6">
            <span className="w-fit rounded-full bg-muted px-4 py-1 text-[10px] font-bold uppercase tracking-widest">
              {post.category}
            </span>
            <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl">{post.title}</h1>
            <div className="flex items-center gap-4 border-t border-border pt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>By {post.author}</span>
              <div className="h-1 w-1 rounded-full bg-border" />
              <span>{post.date}</span>
              <div className="h-1 w-1 rounded-full bg-border" />
              <span>8 min read</span>
            </div>
          </div>
        </div>

        <div className="mx-auto mb-16 aspect-[21/9] max-w-6xl overflow-hidden rounded-2xl border border-border md:mb-24">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            width={1200}
            height={600}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mx-auto max-w-3xl">
          <div
            className="prose prose-neutral dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:tracking-tight"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-20 flex flex-col gap-8 border-t border-border pt-12">
            <h3 className="text-xs font-bold uppercase tracking-widest">Share this article</h3>
            <div className="flex gap-4">
              {["Twitter", "LinkedIn", "Copy Link"].map((platform) => (
                <button
                  key={platform}
                  className="rounded-full border border-border px-6 py-2 text-xs font-medium transition-colors hover:bg-muted"
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

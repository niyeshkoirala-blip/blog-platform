import Link from "next/link"
import { Newsletter } from "@/components/newsletter"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 md:py-32">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-bold leading-[1.1] tracking-tighter md:text-7xl lg:text-8xl">
            The platform to <br />
            <span className="text-muted-foreground">document the craft.</span>
          </h1>
          <div className="mt-12 flex flex-col items-start gap-8 md:flex-row md:items-center">
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
              Your source for engineering insights, design philosophies, and the pursuit of machine-like craft in the
              digital age.
            </p>
            <div className="flex gap-4">
              <Link
                href="/journal"
                className="rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition-transform hover:scale-105 active:scale-95"
              >
                Read the Journal
              </Link>
              <Link
                href="/approach"
                className="rounded-full border border-border bg-transparent px-8 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                Our Approach
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Stats / Highlights Section */}
      <section className="border-y border-border">
        <div className="grid grid-cols-1 md:grid-cols-4">
          {[
            { label: "Articles Published", value: "124+" },
            { label: "Reader Growth", value: "300%" },
            { label: "Code Quality", value: "99.9%" },
            { label: "Caffeine Consumed", value: "∞" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col border-border p-8 md:border-r last:md:border-r-0">
              <span className="mb-2 text-3xl font-bold tracking-tighter">{stat.value}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  )
}

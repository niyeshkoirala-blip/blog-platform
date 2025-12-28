import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <h2 className="mb-4 text-2xl font-bold tracking-tighter">DEVLOG</h2>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              A few skilled humans doing the work of many. Dedicated to the craft of digital engineering and minimalist
              design.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest">Navigation</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/journal" className="hover:text-foreground">
                  Journal
                </Link>
              </li>
              <li>
                <Link href="/approach" className="hover:text-foreground">
                  Approach
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-foreground">
                  Studio
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest">Connect</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://twitter.com" className="hover:text-foreground">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://github.com" className="hover:text-foreground">
                  GitHub
                </a>
              </li>
              <li>
                <a href="mailto:niyeshkoirala@gmail.com" className="hover:text-foreground">
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between border-t border-border pt-8 md:flex-row">
          <p className="font-mono text-[10px] text-muted-foreground">© 2025 DEVLOG. ALL RIGHTS RESERVED.</p>
          <p className="mt-4 font-mono text-[10px] text-muted-foreground md:mt-0">BUILT WITH PRECISION & CARE.</p>
        </div>
      </div>
    </footer>
  )
}

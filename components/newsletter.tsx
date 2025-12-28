export function Newsletter() {
  return (
    <section className="bg-foreground py-20 text-background md:py-32">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-6 text-4xl font-bold tracking-tighter md:text-6xl">Stay informed.</h2>
          <p className="mb-10 text-lg text-background/70">
            Join 5,000+ engineers and designers receiving our weekly digest on software craft and digital engineering.
          </p>
          <form className="flex flex-col gap-4 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-14 flex-1 rounded-full border border-background/20 bg-background/10 px-6 text-sm outline-none transition-colors focus:border-background/50 focus:bg-background/20"
              required
            />
            <button
              type="submit"
              className="h-14 rounded-full bg-background px-10 text-sm font-bold text-foreground transition-transform hover:scale-105 active:scale-95"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-background/50">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  )
}

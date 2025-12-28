import ContactForm from "./ContactForm"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-6 py-20 md:py-32">
      <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
        <div className="max-w-xl">
          <h1 className="mb-6 text-5xl font-bold tracking-tighter md:text-7xl">Let's talk.</h1>
          <p className="mb-12 text-lg leading-relaxed text-muted-foreground">
            Whether you have a question about our engineering processes, want to collaborate, or just want to say hi,
            we'd love to hear from you.
          </p>
          <div className="space-y-8">
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest">Email</h3>
              <p className="text-2xl font-bold tracking-tight">niyeshkoirala@gmail.com</p>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest">Office</h3>
              <p className="text-2xl font-bold tracking-tight">
                Sindhupalchok,
                <br />
                Nepal
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-muted/30 p-8 md:p-12">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}

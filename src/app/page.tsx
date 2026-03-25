import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden pb-16 pt-10 sm:pb-24 sm:pt-16">
      <div className="hero-orb left-[-4rem] top-20 h-44 w-44 bg-circle-gold/70" />
      <div className="hero-orb right-[-2rem] top-40 h-56 w-56 bg-circle-primary/25" />
      <section className="section-shell">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-7">
            <span className="inline-flex rounded-full border border-circle-border bg-white/70 px-4 py-2 text-sm font-semibold text-circle-accent">
              Built for visual discovery, strong taste, and lively community threads
            </span>
            <div className="space-y-5">
              <h1 className="max-w-4xl font-display text-5xl font-bold leading-[0.95] text-circle-ink text-balance sm:text-6xl lg:text-7xl">
                Reddit meets Pinterest, with circles that actually feel alive.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-circle-accent sm:text-xl">
                PinCircles turns image discovery into a shared experience: scroll striking visuals,
                join niche communities, and vote the best ideas to the top.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-circle-primary px-8 py-4 text-base font-semibold text-white shadow-xl shadow-circle-primary/20 hover:bg-circle-secondary"
              >
                Start Building Your Circles
              </Link>
              <Link
                href="/feed"
                className="inline-flex items-center justify-center rounded-full border border-circle-border bg-white/75 px-8 py-4 text-base font-semibold text-circle-ink hover:bg-white"
              >
                Explore the Feed
              </Link>
            </div>
            <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
              {[
                { value: "Boards + threads", label: "Visual posts with social momentum" },
                { value: "Niche circles", label: "Communities built around taste and topics" },
                { value: "Votes that matter", label: "Signal-rich sorting for what deserves attention" },
              ].map((item) => (
                <div key={item.value} className="glass-panel rounded-3xl p-5">
                  <p className="font-display text-xl font-bold text-circle-ink">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-circle-accent">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="glass-panel relative overflow-hidden rounded-[2rem] p-4 sm:p-6">
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-circle-primary/10 to-transparent" />
              <div className="relative grid gap-4">
                <Link
                  href="/circles/ui-design"
                  className="block rounded-[1.5rem] bg-[#2b2118] p-5 text-white shadow-2xl transition duration-300 hover:-translate-y-1 hover:bg-[#37291f] focus:outline-none focus:ring-2 focus:ring-white/60"
                >
                  <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
                    <span>Hot in Design Systems</span>
                    <span>2.1k upvotes</span>
                  </div>
                  <h2 className="font-display text-3xl font-bold leading-tight">
                    How teams pin references, debate them, and ship sharper work.
                  </h2>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
                    Inspiration boards become active community spaces instead of static collections.
                  </p>
                </Link>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Link
                    href="/circles/cozy-homes"
                    className="block rounded-[1.5rem] bg-[#f4b942] p-5 text-circle-ink transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-circle-secondary/40"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-circle-secondary/70">
                      Trending Circle
                    </p>
                    <p className="mt-3 font-display text-2xl font-bold">Indie Room Makeovers</p>
                    <p className="mt-2 text-sm leading-6 text-circle-ink/75">
                      14k members swapping before-and-after ideas, moodboards, and critiques.
                    </p>
                  </Link>
                  <Link
                    href="/circles/ui-design#discussion"
                    className="block rounded-[1.5rem] bg-white p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-circle-primary/30"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-circle-accent">
                      Fresh Discussion
                    </p>
                    <p className="mt-3 font-display text-2xl font-bold text-circle-ink">
                      Why save-worthy content still needs comments
                    </p>
                    <p className="mt-2 text-sm leading-6 text-circle-accent">
                      PinCircles combines collectability with conversation, so discovery leads somewhere.
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-4 rounded-[2rem] border border-circle-border bg-white/70 p-6 shadow-xl shadow-amber-950/5 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-circle-accent">Why it stands out</p>
            <p className="mt-2 font-display text-2xl font-bold text-circle-ink">A concept that feels native to Pinterest craft.</p>
          </div>
          <p className="text-sm leading-7 text-circle-accent">
            PinCircles treats saved inspiration like the start of a conversation, not the end of one.
          </p>
          <p className="text-sm leading-7 text-circle-accent">
            The result feels more like a living taste community than a static board of disconnected posts.
          </p>
        </div>
      </section>
    </div>
  );
}

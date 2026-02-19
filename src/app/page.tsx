import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-circle-primary mb-4">
          PinCircles
        </h1>
        <p className="text-xl text-circle-accent mb-8">
          Join interest-based communities. Share images. Discover what&apos;s trending.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-3 rounded-full bg-circle-primary text-white font-medium hover:bg-circle-secondary transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/feed"
            className="px-8 py-3 rounded-full border-2 border-circle-primary text-circle-primary font-medium hover:bg-circle-primary hover:text-white transition-colors"
          >
            Explore Feed
          </Link>
        </div>
      </div>
    </div>
  );
}

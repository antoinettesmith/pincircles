"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const navItems = [
    { href: "/feed", label: "Feed", active: pathname === "/feed" },
    { href: "/circles", label: "Circles", active: pathname.startsWith("/circles") },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-3 py-3 sm:px-6">
      <div className="section-shell">
        <div className="glass-panel flex h-16 items-center justify-between rounded-full px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-circle-primary font-display text-lg font-bold text-white shadow-lg shadow-circle-primary/25">
              P
            </span>
            <div className="leading-tight">
              <span className="block font-display text-xl font-bold text-circle-ink">PinCircles</span>
              <span className="hidden text-xs text-circle-accent sm:block">
                Visual communities with opinions
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden rounded-full bg-white/70 p-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    item.active
                      ? "bg-circle-ink text-white"
                      : "text-circle-accent hover:bg-circle-warm hover:text-circle-ink"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {user ? (
              <>
                <Link
                  href="/circles/joined"
                  className="hidden text-sm font-medium text-circle-accent hover:text-circle-primary lg:block"
                >
                  My Circles
                </Link>
                <Link
                  href="/circles/recommendations"
                  className="hidden text-sm font-medium text-circle-accent hover:text-circle-primary lg:block"
                >
                  For You
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 rounded-full border border-circle-border bg-white/80 px-3 py-2 hover:bg-white">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-circle-primary/10 font-display text-sm font-bold text-circle-primary">
                      {user.username.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="hidden text-sm font-semibold text-circle-ink sm:block">
                      {user.username}
                    </span>
                  </button>
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-circle-border bg-white p-2 shadow-xl opacity-0 invisible transition-all group-hover:visible group-hover:opacity-100">
                    <Link
                      href="/circles/create"
                      className="block rounded-xl px-4 py-2 text-sm hover:bg-circle-mist"
                    >
                      Create Circle
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full rounded-xl px-4 py-2 text-left text-sm text-red-600 hover:bg-circle-mist"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden text-sm font-semibold text-circle-accent hover:text-circle-primary sm:block"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-circle-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-circle-primary/20 hover:bg-circle-secondary"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-circle-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-circle-primary">PinCircles</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/feed"
              className={`text-sm font-medium ${
                pathname === "/feed" ? "text-circle-primary" : "text-circle-accent hover:text-circle-primary"
              }`}
            >
              Feed
            </Link>
            <Link
              href="/circles"
              className={`text-sm font-medium ${
                pathname.startsWith("/circles") ? "text-circle-primary" : "text-circle-accent hover:text-circle-primary"
              }`}
            >
              Circles
            </Link>

            {user ? (
              <>
                <Link
                  href="/circles/joined"
                  className="text-sm font-medium text-circle-accent hover:text-circle-primary"
                >
                  My Circles
                </Link>
                <Link
                  href="/circles/recommendations"
                  className="text-sm font-medium text-circle-accent hover:text-circle-primary"
                >
                  For You
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-circle-surface hover:bg-circle-border">
                    <span className="text-sm font-medium">{user.username}</span>
                  </button>
                  <div className="absolute right-0 mt-1 w-48 py-2 bg-white rounded-lg shadow-lg border border-circle-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      href="/circles/create"
                      className="block px-4 py-2 text-sm hover:bg-circle-surface"
                    >
                      Create Circle
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-circle-surface"
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
                  className="text-sm font-medium text-circle-accent hover:text-circle-primary"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-full bg-circle-primary text-white text-sm font-medium hover:bg-circle-secondary transition-colors"
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

"use client";

import Link from "next/link";
import { BookOpen, Library, Compass, MessageSquare, Users } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.15),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(71,85,105,0.25),transparent_50%)]">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-orange-50/80 to-red-50/80 dark:from-slate-950/80 dark:via-slate-900/80 dark:to-slate-800/80" />
      <div className="relative container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-xl mb-10">
          <BookOpen className="h-14 w-14 text-white" />
        </div>

        <p className="text-xs uppercase tracking-[0.3em] text-amber-700/80 dark:text-amber-300/80 font-semibold mb-4">
          Error 404
        </p>
        <h1 className="text-6xl md:text-7xl font-serif font-semibold text-gray-900 dark:text-slate-100 mb-4">
          Page Not Found
        </h1>
        <p className="text-base md:text-xl text-gray-600 dark:text-slate-300 max-w-lg mb-10">
          This page has gone missing from the shelf. It may have been moved or never existed.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-14">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm transition-colors"
          >
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/90 dark:bg-slate-800/90 border border-amber-200/70 dark:border-slate-700 text-gray-700 dark:text-slate-200 font-medium text-sm hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors"
          >
            Go Back
          </button>
        </div>

        <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-3xl border border-amber-200/70 dark:border-slate-700 shadow-xl p-8 w-full max-w-lg">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/80 font-semibold mb-6">
            Popular Pages
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: "/library", label: "Library", Icon: Library },
              { href: "/discover", label: "Discover", Icon: Compass },
              { href: "/chat", label: "AI Chat", Icon: MessageSquare },
              { href: "/forums", label: "Forums", Icon: Users },
            ].map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50/80 dark:bg-slate-700/60 border border-amber-200/60 dark:border-slate-600 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Icon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

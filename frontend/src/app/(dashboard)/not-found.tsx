import Link from "next/link";
import { BookOpen, Library, Compass, MessageSquare, Users, Settings } from "lucide-react";

export default function DashboardNotFound() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.15),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(71,85,105,0.25),transparent_50%)]">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-orange-50/80 to-red-50/80 dark:from-slate-950/80 dark:via-slate-900/80 dark:to-slate-800/80" />
      <div className="relative container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-xl mb-8">
          <BookOpen className="h-12 w-12 text-white" />
        </div>

        <p className="text-xs uppercase tracking-[0.3em] text-amber-700/80 dark:text-amber-300/80 font-semibold mb-4">
          Error 404
        </p>
        <h1 className="text-5xl md:text-6xl font-serif font-semibold text-gray-900 dark:text-slate-100 mb-4">
          Page Not Found
        </h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-slate-300 max-w-md mb-10">
          This shelf is empty. The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm transition-colors mb-12"
        >
          Back to Dashboard
        </Link>

        <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-3xl border border-amber-200/70 dark:border-slate-700 shadow-xl p-8 w-full max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/80 font-semibold mb-6">
            Quick Navigation
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { href: "/library", label: "Library", Icon: Library },
              { href: "/discover", label: "Discover", Icon: Compass },
              { href: "/chat", label: "AI Chat", Icon: MessageSquare },
              { href: "/forums", label: "Forums", Icon: Users },
              { href: "/settings", label: "Settings", Icon: Settings },
              { href: "/profile", label: "Profile", Icon: BookOpen },
            ].map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-700/60 border border-amber-200/60 dark:border-slate-600 hover:bg-amber-100/70 dark:hover:bg-slate-700 transition-colors"
              >
                <Icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-medium text-gray-700 dark:text-slate-200">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

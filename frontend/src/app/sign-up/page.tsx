"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { BookOpen, Sparkles, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
  const error = searchParams?.get("error");

  useEffect(() => {
    if (status === "authenticated" && session) {
      if (session.backendVerified === false) return;
      if (session.isNewUser === true || session.needsPreferences === true) {
        router.push("/onboarding");
      } else {
        router.push(callbackUrl);
      }
    }
  }, [status, session, router, callbackUrl]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="w-full max-w-md animate-pulse px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-amber-200 dark:border-slate-700 p-10 space-y-6">
            <div className="h-8 bg-amber-100 dark:bg-slate-700 rounded-lg w-3/4 mx-auto" />
            <div className="h-4 bg-amber-50 dark:bg-slate-600 rounded w-1/2 mx-auto" />
            <div className="h-14 bg-gray-100 dark:bg-slate-700 rounded-xl mt-8" />
            <div className="space-y-3 mt-4">
              <div className="h-3 bg-amber-50 dark:bg-slate-700 rounded w-3/4" />
              <div className="h-3 bg-amber-50 dark:bg-slate-700 rounded w-2/3" />
              <div className="h-3 bg-amber-50 dark:bg-slate-700 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-300 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300 rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-8 w-fit">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white font-serif">ShelfSpace</h1>
          </Link>
          <p className="text-white/90 text-lg leading-relaxed max-w-md">
            Your AI-powered reading companion. Organise, track, and discover your next great read.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          {[
            { icon: <Sparkles className="w-5 h-5 text-amber-200" />, title: "AI-Powered Insights", desc: "Personalised book recommendations and reading analytics" },
            { icon: <TrendingUp className="w-5 h-5 text-orange-200" />, title: "Track Your Progress", desc: "Monitor reading habits and achieve your goals" },
            { icon: <Users className="w-5 h-5 text-red-200" />, title: "Join Reading Forums", desc: "Connect with fellow readers and share insights" },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg">{f.icon}</div>
              <div>
                <h3 className="text-white font-semibold mb-1">{f.title}</h3>
                <p className="text-white/80 text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10">
          <p className="text-white/70 text-sm">© {new Date().getFullYear()} ShelfSpace. All rights reserved.</p>
        </div>
      </div>

      {/* Right — sign-up form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">ShelfSpace</h1>
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-amber-200 dark:border-slate-700 p-8 md:p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 font-serif">
                Join ShelfSpace
              </h2>
              <p className="text-gray-600 dark:text-slate-400">
                Create your account and start your reading journey
              </p>
            </div>

            {(error || session?.backendVerified === false) && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {error === "backend_verification_failed" || session?.backendVerified === false
                    ? "Unable to connect to the server. Please make sure the backend services are running and try again."
                    : `An error occurred (${error}). Please try again.`}
                </p>
              </div>
            )}

            <button
              onClick={() => signIn("google")}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 font-semibold rounded-xl border-2 border-gray-300 dark:border-slate-600 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-amber-500/20"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-slate-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400">
                  Secure authentication
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600 dark:text-slate-400">
              {[
                { color: "bg-amber-500", text: "Free to use — no credit card needed" },
                { color: "bg-orange-500", text: "Access your personal library anywhere" },
                { color: "bg-red-500", text: "AI-powered book recommendations" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-6">
            Already have an account?{" "}
            <Link href="/sign-up" className="text-amber-600 dark:text-amber-400 hover:underline font-medium">
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-3">
            By continuing, you agree to our{" "}
            <a href="#" className="text-amber-600 dark:text-amber-400 hover:underline">Terms</a>
            {" "}and{" "}
            <a href="#" className="text-amber-600 dark:text-amber-400 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}

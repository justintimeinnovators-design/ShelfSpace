"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, Menu, X, Sun, Moon } from "lucide-react";

// ── Replace with your own video URL or set NEXT_PUBLIC_HERO_VIDEO_URL ─────────
const HERO_VIDEO_URL =
  process.env["NEXT_PUBLIC_HERO_VIDEO_URL"] || "/hero-video.mp4";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const FEATURES = [
  {
    title: "Personal Library",
    description:
      "Organise every book you've read, are reading, or want to read — all in one place with smart lists and tags.",
    gradient: "from-amber-400 to-orange-500",
    delay: 0,
  },
  {
    title: "AI Recommendations",
    description:
      "ShelfAI analyses your reading history and taste to surface books you'll actually love.",
    gradient: "from-violet-400 to-purple-500",
    delay: 0.05,
  },
  {
    title: "Reading Analytics",
    description:
      "Beautiful charts tracking your reading streak, pages per day, favourite genres, and yearly goals.",
    gradient: "from-blue-400 to-indigo-500",
    delay: 0.1,
  },
  {
    title: "Book Forums",
    description:
      "Join genre communities, start threads, and share thoughts with readers who share your taste.",
    gradient: "from-emerald-400 to-teal-500",
    delay: 0.15,
  },
  {
    title: "Reading Goals",
    description:
      "Set yearly book targets and monthly page goals. Watch your progress in real time.",
    gradient: "from-rose-400 to-pink-500",
    delay: 0.2,
  },
  {
    title: "Instant Discovery",
    description:
      "Browse curated carousels by genre, trending titles, and staff picks — updated daily.",
    gradient: "from-yellow-400 to-amber-500",
    delay: 0.25,
  },
];

const STEPS = [
  {
    number: "01",
    title: "Create your account",
    description: "Sign up in seconds with Google. No credit card, no friction.",
  },
  {
    number: "02",
    title: "Build your library",
    description:
      "Add books you've read and set your reading status — completed, reading, or want-to-read.",
  },
  {
    number: "03",
    title: "Track & discover",
    description:
      "Watch your stats grow, hit your goals, and let ShelfAI find your next favourite read.",
  },
];

const STATS = [
  { value: "10,000+", label: "Books in catalogue" },
  { value: "50+", label: "Genre categories" },
  { value: "AI-powered", label: "Recommendations" },
  { value: "Free", label: "To get started" },
];

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  // Initialise theme from localStorage / system preference
  useEffect(() => {
    const stored = localStorage.getItem("shelfspace-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("shelfspace-theme", next ? "dark" : "light");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const heroSection = useInView(0.05);
  const statsSection = useInView();
  const featuresSection = useInView();
  const stepsSection = useInView();
  const ctaSection = useInView();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-x-hidden">
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-amber-100 dark:border-slate-700"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white font-serif">
                ShelfSpace
              </span>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-slate-300">
              {/* <a href="#features" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Features</a> */}
              {/* <a href="#how-it-works" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">How it works</a> */}
            </nav>

            {/* Desktop CTA + theme toggle */}
            <div className="hidden md:flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-slate-700 transition-colors"
              >
                {dark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <Link
                href="/sign-up"
                className="text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors px-3 py-1.5"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="text-sm font-semibold px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl shadow transition-all hover:scale-[1.03] hover:shadow-md"
              >
                Get started free
              </Link>
            </div>

            {/* Mobile controls */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-slate-700 transition-colors"
              >
                {dark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <button
                className="p-2 text-gray-600 dark:text-slate-300"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-amber-100 dark:border-slate-700 px-4 pb-4 pt-2 space-y-3">
            <a
              href="#features"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-gray-700 dark:text-slate-300 font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-gray-700 dark:text-slate-300 font-medium"
            >
              How it works
            </a>
            <Link
              href="/sign-up"
              className="block w-full text-center py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl mt-2"
            >
              Get started free
            </Link>
          </div>
        )}
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
        {/* ── Background video ── */}
        <div className="absolute inset-0 z-0">
          <video
            src={HERO_VIDEO_URL}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Overlay — lighter in dark mode to let video show through */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 via-orange-50/70 to-amber-50/90 dark:from-slate-950/85 dark:via-slate-900/80 dark:to-slate-900/90" />
        </div>

        {/* ── Hero content ── */}
        <div
          ref={heroSection.ref}
          className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center transition-all duration-1000 ${
            heroSection.inView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          {/* Badge — text only */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300 text-sm font-medium mb-8 backdrop-blur-sm">
            AI-powered reading companion
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white font-serif leading-tight mb-6">
            Your books.{" "}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Your story.
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            ShelfSpace is the reading companion that organises your library,
            tracks your progress, surfaces AI-powered recommendations, and
            connects you with readers who share your passion.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.03]"
            >
              Start for free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 font-semibold text-lg rounded-2xl border border-amber-200 dark:border-slate-600 backdrop-blur-sm transition-all hover:scale-[1.02]"
            >
              See features
            </a>
          </div>

          {/* Trust line — text only */}
          <p className="mt-8 text-sm text-gray-500 dark:text-slate-400">
            No credit card required · Free to start · Sign in with Google
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-60">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-amber-500 dark:to-amber-400 animate-pulse" />
          <span className="text-xs text-amber-600 dark:text-amber-400 tracking-widest uppercase">
            scroll
          </span>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────────────────── */}
      <section className="py-12 border-y border-amber-100 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div
          ref={statsSection.ref}
          className={`max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8 transition-all duration-700 ${
            statsSection.inView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white font-serif mb-1">
                {s.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-slate-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            ref={featuresSection.ref}
            className={`text-center mb-16 transition-all duration-700 ${
              featuresSection.inView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300 text-sm font-medium mb-4">
              Everything you need
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white font-serif mb-4">
              Your whole reading life,{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                in one shelf
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
              From tracking the book you finished last night to discovering what
              to read next — ShelfSpace has every part of your reading journey
              covered.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                style={{ transitionDelay: `${feature.delay}s` }}
                className={`group p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-amber-100 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                  featuresSection.inView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                {/* Gradient accent bar instead of icon */}
                <div
                  className={`h-1 w-10 rounded-full bg-gradient-to-r ${feature.gradient} mb-5`}
                />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-serif">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-white/40 dark:bg-slate-900/40"
      >
        <div className="max-w-5xl mx-auto">
          <div
            ref={stepsSection.ref}
            className={`transition-all duration-700 ${
              stepsSection.inView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300 text-sm font-medium mb-4">
                Simple to start
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white font-serif mb-4">
                Up and reading{" "}
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  in minutes
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-slate-300 max-w-xl mx-auto">
                No setup headaches. Just sign in and start building the library
                you always wished existed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector line (desktop) */}
              <div className="hidden md:block absolute top-8 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-0.5 bg-gradient-to-r from-amber-300 via-orange-300 to-amber-300 dark:from-amber-700 dark:via-orange-700 dark:to-amber-700" />

              {STEPS.map((step, i) => (
                <div
                  key={step.number}
                  className="relative flex flex-col items-center text-center"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  {/* Number badge — no icon */}
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg mb-5">
                    <span className="text-2xl font-bold text-white font-serif">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white font-serif mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div
            ref={ctaSection.ref}
            className={`relative rounded-3xl overflow-hidden transition-all duration-700 ${
              ctaSection.inView ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-300/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 text-center p-12 sm:p-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-white font-serif mb-4">
                Start your reading journey today
              </h2>
              <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
                Join ShelfSpace and turn your reading habit into something you
                can see, track, and be proud of.
              </p>
              <Link
                href="/sign-up"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-amber-50 text-orange-600 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-[1.04]"
              >
                Get started — it&apos;s free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="mt-5 text-white/60 text-sm">
                Sign in with Google · No password needed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-amber-100 dark:border-slate-700 py-10 px-4 sm:px-6 lg:px-8 bg-white/30 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white font-serif">
              ShelfSpace
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-slate-400">
            <a
              href="#features"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              How it works
            </a>
            <Link
              href="/sign-up"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              Sign up
            </Link>
          </div>
          <p className="text-sm text-gray-400 dark:text-slate-500">
            © {new Date().getFullYear()} ShelfSpace
          </p>
        </div>
      </footer>
    </div>
  );
}

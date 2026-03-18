import React from "react";

// ---------------------------------------------------------------------------
// Base
// ---------------------------------------------------------------------------

export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse bg-amber-100 dark:bg-slate-700 rounded-lg ${className}`}
  />
);

// ---------------------------------------------------------------------------
// Reusable pieces
// ---------------------------------------------------------------------------

export const BookCardSkeleton = () => (
  <div className="bg-white/90 dark:bg-slate-800/95 rounded-xl border border-amber-200/70 dark:border-slate-700 overflow-hidden">
    <Skeleton className="h-52 w-full rounded-none rounded-t-xl" />
    <div className="p-4 space-y-2.5">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-20" />
    </div>
  </div>
);

export const GroupCardSkeleton = () => (
  <div className="bg-white/90 dark:bg-slate-800/95 rounded-2xl border border-amber-200/70 dark:border-slate-700 p-5">
    <div className="flex items-start gap-4">
      <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2.5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
        <div className="flex gap-3 pt-1">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3.5 w-16" />
        </div>
      </div>
    </div>
  </div>
);

// Legacy aliases kept for backward compatibility
export const CardSkeleton = () => (
  <div className="bg-white/90 dark:bg-slate-800/95 rounded-xl border border-amber-200/70 dark:border-slate-700 p-6 space-y-3">
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
  </div>
);

export const StatsCardSkeleton = () => (
  <div className="bg-white/90 dark:bg-slate-800/95 rounded-xl border border-amber-200/70 dark:border-slate-700 p-5">
    <div className="flex items-center justify-between mb-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
    <Skeleton className="h-8 w-16 mb-1" />
    <Skeleton className="h-3 w-28" />
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="border-b border-amber-100 dark:border-slate-700">
    {[32, 24, 20, 16].map((w, i) => (
      <td key={i} className="px-6 py-4">
        <Skeleton className={`h-4 w-${w}`} />
      </td>
    ))}
  </tr>
);

export const ListItemSkeleton = () => (
  <div className="flex items-center gap-4 p-4 bg-white/90 dark:bg-slate-800/95 rounded-xl border border-amber-200/70 dark:border-slate-700">
    <Skeleton className="h-11 w-11 rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-8 w-20" />
  </div>
);

// ---------------------------------------------------------------------------
// Page Loader (root loading)
// ---------------------------------------------------------------------------

export const PageLoader = ({ message: _message = "Loading..." }: { message?: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
    <div className="w-full max-w-xs animate-pulse px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-amber-200 dark:border-slate-700 p-8 space-y-4">
        <div className="h-12 w-12 bg-gradient-to-br from-amber-200 to-orange-200 dark:from-slate-600 dark:to-slate-700 rounded-2xl mx-auto" />
        <div className="h-4 bg-amber-100 dark:bg-slate-700 rounded w-2/3 mx-auto" />
        <div className="h-3 bg-amber-50 dark:bg-slate-600 rounded w-1/2 mx-auto" />
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Shared shell helpers (not exported)
// ---------------------------------------------------------------------------

const PageBg = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
    {children}
  </div>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/90 dark:bg-slate-800/95 rounded-2xl border border-amber-200/70 dark:border-slate-700 ${className}`}>
    {children}
  </div>
);

const SectionHeader = () => (
  <div className="flex items-center gap-3 mb-5">
    <Skeleton className="h-9 w-9 rounded-lg flex-shrink-0" />
    <Skeleton className="h-5 w-40" />
  </div>
);

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export const DashboardSkeleton = () => (
  <PageBg>
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="h-14 w-14 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          "from-amber-200 to-orange-200 dark:from-amber-900/50 dark:to-orange-900/50",
          "from-green-200 to-emerald-200 dark:from-green-900/50 dark:to-emerald-900/50",
          "from-blue-200 to-indigo-200 dark:from-blue-900/50 dark:to-indigo-900/50",
          "from-purple-200 to-violet-200 dark:from-purple-900/50 dark:to-violet-900/50",
        ].map((g, i) => (
          <div
            key={i}
            className={`animate-pulse bg-gradient-to-br ${g} rounded-xl p-6`}
          >
            <div className="flex justify-between mb-4">
              <div className="h-8 w-8 bg-white/40 dark:bg-white/10 rounded-lg" />
              <div className="h-6 w-6 bg-white/30 dark:bg-white/10 rounded" />
            </div>
            <div className="h-8 w-16 bg-white/50 dark:bg-white/10 rounded-lg mb-2" />
            <div className="h-3.5 w-28 bg-white/40 dark:bg-white/10 rounded" />
          </div>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {/* Currently reading */}
        <Card className="p-6">
          <SectionHeader />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-24 w-16 rounded flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-2 w-full rounded-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Analytics */}
        <Card className="p-6">
          <SectionHeader />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-7 w-14" />
              </div>
            ))}
          </div>
          <Skeleton className="h-36 w-full rounded-xl" />
        </Card>

        {/* Activity + Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <SectionHeader />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <SectionHeader />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-32 w-full rounded-xl" />
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  </PageBg>
);

// ---------------------------------------------------------------------------
// Library  (reading-lists grid — matches LibraryFeature)
// ---------------------------------------------------------------------------

const ReadingListCardSkeleton = () => (
  <div className="bg-white/90 dark:bg-slate-800/95 rounded-3xl border border-amber-200/70 dark:border-slate-700 p-6">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-3 w-12" />
    </div>
    <Skeleton className="h-7 w-3/4 mb-3" />
    <Skeleton className="h-3.5 w-full mb-1.5" />
    <Skeleton className="h-3.5 w-4/5 mb-5" />
    <Skeleton className="h-4 w-24" />
  </div>
);

export const LibrarySkeleton = () => (
  <div className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.15),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(71,85,105,0.25),transparent_50%)]">
    <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-orange-50/80 to-red-50/80 dark:from-slate-950/80 dark:via-slate-900/80 dark:to-slate-800/80" />
    <div className="relative container mx-auto px-4 py-12">
      {/* Header row */}
      <div className="mb-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div className="space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-80 mt-2" />
        </div>
        {/* Create list card */}
        <div className="bg-white/90 dark:bg-slate-800/95 rounded-2xl border border-amber-200/70 dark:border-slate-700 p-4 w-full lg:w-[360px]">
          <Skeleton className="h-3 w-20 mb-3" />
          <div className="flex gap-2">
            <Skeleton className="flex-1 h-9 rounded-lg" />
            <Skeleton className="h-9 w-16 rounded-lg" />
          </div>
        </div>
      </div>

      {/* List cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ReadingListCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Discover
// ---------------------------------------------------------------------------

export const DiscoverSkeleton = () => (
  <PageBg>
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-72 mt-2" />
      </div>

      {/* Carousel placeholder */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-shrink-0 w-32 space-y-2">
              <Skeleton className="h-44 w-full rounded-xl" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
        ))}
      </div>

      {/* Book grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </PageBg>
);

// ---------------------------------------------------------------------------
// Forums
// ---------------------------------------------------------------------------

export const ForumsSkeleton = () => (
  <PageBg>
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-4 w-64 mt-1" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 mb-8">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>

      {/* Forum cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <GroupCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </PageBg>
);

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------

export const ChatSkeleton = () => (
  <PageBg>
    <div className="flex h-screen">
      {/* Sessions sidebar */}
      <div className="hidden md:flex flex-col w-72 border-r border-amber-200/70 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 flex-shrink-0">
        <div className="p-4 border-b border-amber-200/70 dark:border-slate-700 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex-1 p-3 space-y-2 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-3 rounded-xl space-y-1.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-amber-200/70 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70">
          <Skeleton className="h-5 w-52" />
        </div>

        <div className="flex-1 p-4 md:p-6 space-y-6 overflow-hidden">
          {/* Bot */}
          <div className="flex gap-3 max-w-2xl">
            <Skeleton className="h-9 w-9 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          {/* User */}
          <div className="flex gap-3 max-w-lg ml-auto flex-row-reverse">
            <Skeleton className="h-9 w-9 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          {/* Bot */}
          <div className="flex gap-3 max-w-2xl">
            <Skeleton className="h-9 w-9 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-amber-200/70 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  </PageBg>
);

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export const SettingsSkeleton = () => (
  <PageBg>
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-3 w-16 mb-3" />
      <Skeleton className="h-10 w-36 mb-10" />

      {/* Tab bar */}
      <div className="flex border-b border-amber-200/70 dark:border-slate-700 mb-8 gap-1">
        {[80, 96, 100, 72, 80].map((w, i) => (
          <Skeleton key={i} className={`h-10 w-${w} rounded-none rounded-t-lg`} />
        ))}
      </div>

      <Card className="p-6 md:p-8">
        {/* Avatar row */}
        <div className="flex items-center gap-4 pb-8 border-b border-amber-100 dark:border-slate-700 mb-8">
          <Skeleton className="h-14 w-14 rounded-xl flex-shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>

        {/* Form grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={i >= 2 ? "md:col-span-2" : ""}>
              <Skeleton className="h-3 w-24 mb-2 rounded" />
              <Skeleton className={`w-full ${i === 3 ? "h-20" : "h-10"}`} />
            </div>
          ))}
        </div>

        {/* Genres */}
        <div className="py-8 border-t border-amber-100 dark:border-slate-700">
          <Skeleton className="h-3 w-28 mb-5" />
          <div className="flex gap-2 flex-wrap mb-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-9 w-40 rounded-lg" />
        </div>

        {/* Save */}
        <div className="flex justify-end pt-6 border-t border-amber-100 dark:border-slate-700">
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </Card>
    </div>
  </PageBg>
);

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export const ProfileSkeleton = () => (
  <PageBg>
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-8 w-24 rounded-full mb-6" />
      <Skeleton className="h-3 w-24 mb-3" />
      <Skeleton className="h-10 w-72 mb-2" />
      <Skeleton className="h-4 w-96 mb-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar card */}
        <div className="lg:col-span-4">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-5">
              <Skeleton className="h-20 w-20 rounded-2xl flex-shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-3.5 w-24" />
              </div>
            </div>
            <div className="space-y-2 mb-5">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-5/6" />
            </div>
            <div className="space-y-3 mb-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded flex-shrink-0" />
                  <Skeleton className="h-3.5 w-32" />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-16 rounded-full" />
              ))}
            </div>
          </Card>
        </div>

        {/* Main content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-3 w-12 mb-2" />
                <Skeleton className="h-7 w-10 mb-1" />
                <Skeleton className="h-3 w-20" />
              </Card>
            ))}
          </div>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <Skeleton className="h-5 w-5 rounded flex-shrink-0" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="space-y-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-amber-50 dark:border-slate-700/50 last:border-b-0">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <Skeleton className="h-5 w-5 rounded flex-shrink-0" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <div className="space-y-2.5">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="p-3 rounded-xl bg-amber-50/70 dark:bg-slate-700/60 space-y-1.5">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  </PageBg>
);

// ---------------------------------------------------------------------------
// Forum detail  (matches ForumFeature)
// ---------------------------------------------------------------------------

export const ForumDetailSkeleton = () => (
  <PageBg>
    <div className="container mx-auto px-4 py-8">
      {/* Back link */}
      <Skeleton className="h-5 w-32 mb-6" />

      {/* Forum header card */}
      <div className="bg-white/95 dark:bg-slate-800/95 rounded-2xl border border-amber-200/70 dark:border-slate-700 overflow-hidden mb-8">
        <div className="h-2 bg-gradient-to-r from-amber-200 via-orange-200 to-rose-200 dark:from-amber-900/60 dark:via-orange-900/60 dark:to-rose-900/60 animate-pulse" />
        <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="flex gap-2 pt-1">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-16 rounded-full" />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-amber-200/70 dark:border-slate-700 bg-amber-50/40 dark:bg-slate-700/30 p-3 space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-6 w-10" />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-xl border border-amber-200/70 dark:border-slate-700 p-4 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* Search + new discussion bar */}
          <div className="bg-white/90 dark:bg-slate-800/95 rounded-xl border border-amber-200/70 dark:border-slate-700 p-5">
            <div className="flex gap-3">
              <Skeleton className="h-10 flex-1 rounded-lg" />
              <Skeleton className="h-10 w-36 rounded-lg" />
            </div>
          </div>

          {/* Thread cards */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/90 dark:bg-slate-800/95 rounded-xl border border-amber-200/70 dark:border-slate-700 p-6 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-full mt-1" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {/* Members card */}
          <div className="bg-white/90 dark:bg-slate-800/95 rounded-xl border border-amber-200/70 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-7 w-14 rounded-lg" />
            </div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-6 w-20 rounded" />
              ))}
            </div>
          </div>
          {/* Snapshot card */}
          <div className="bg-white/90 dark:bg-slate-800/95 rounded-xl border border-amber-200/70 dark:border-slate-700 p-6 space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  </PageBg>
);

// ---------------------------------------------------------------------------
// Thread detail  (matches ForumPostFeature)
// ---------------------------------------------------------------------------

export const ThreadDetailSkeleton = () => (
  <PageBg>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back link */}
      <Skeleton className="h-5 w-32 mb-6" />

      {/* Thread content card */}
      <div className="bg-white/90 dark:bg-slate-800/95 rounded-xl border border-amber-200/70 dark:border-slate-700 p-6 mb-8 space-y-3">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Reply form card */}
      <div className="bg-white/90 dark:bg-slate-800/95 rounded-xl border border-amber-200/70 dark:border-slate-700 p-6 mb-8 space-y-3">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-28 w-full rounded" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      {/* Post cards */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/90 dark:bg-slate-800/95 rounded-xl border border-amber-200/70 dark:border-slate-700 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-3 pt-1">
              <Skeleton className="h-6 w-14 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </PageBg>
);

// ---------------------------------------------------------------------------
// Book detail
// ---------------------------------------------------------------------------

export const BookDetailSkeleton = () => (
  <PageBg>
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Skeleton className="h-8 w-28 rounded-full mb-8" />

      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="h-80 w-52 rounded-xl flex-shrink-0 mx-auto md:mx-0" />
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-10 w-36 rounded-lg" />
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="p-6 space-y-3">
            <Skeleton className="h-5 w-32 mb-4" />
            {[1, 2, 3, 4].map((j) => (
              <Skeleton key={j} className="h-4 w-full" />
            ))}
          </Card>
        ))}
      </div>
    </div>
  </PageBg>
);

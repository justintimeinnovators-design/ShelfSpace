// Base skeleton component
export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
  />
);

// Card skeleton
export const CardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
    <div className="space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  </div>
);

// Book card skeleton
export const BookCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  </div>
);

// Stats card skeleton
export const StatsCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-12 w-12 rounded-lg" />
    </div>
  </div>
);

// Table row skeleton
export const TableRowSkeleton = () => (
  <tr className="border-b border-gray-200 dark:border-gray-700">
    <td className="px-6 py-4">
      <Skeleton className="h-4 w-32" />
    </td>
    <td className="px-6 py-4">
      <Skeleton className="h-4 w-24" />
    </td>
    <td className="px-6 py-4">
      <Skeleton className="h-4 w-20" />
    </td>
    <td className="px-6 py-4">
      <Skeleton className="h-4 w-16" />
    </td>
  </tr>
);

// List item skeleton
export const ListItemSkeleton = () => (
  <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
    <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-8 w-20" />
  </div>
);

// Dashboard skeleton
export const DashboardSkeleton = () => (
  <div className="space-y-6 p-6">
    {/* Header */}
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCardSkeleton />
      <StatsCardSkeleton />
      <StatsCardSkeleton />
      <StatsCardSkeleton />
    </div>

    {/* Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CardSkeleton />
      <CardSkeleton />
    </div>
  </div>
);

// Library skeleton
export const LibrarySkeleton = () => (
  <div className="space-y-6 p-6">
    {/* Header with search */}
    <div className="flex flex-col md:flex-row gap-4 justify-between">
      <Skeleton className="h-10 w-64" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>

    {/* Books Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <BookCardSkeleton />
      <BookCardSkeleton />
      <BookCardSkeleton />
      <BookCardSkeleton />
      <BookCardSkeleton />
      <BookCardSkeleton />
      <BookCardSkeleton />
      <BookCardSkeleton />
    </div>
  </div>
);

// Chat skeleton
export const ChatSkeleton = () => (
  <div className="flex flex-col h-[calc(100vh-4rem)]">
    {/* Chat header */}
    <div className="border-b border-gray-200 dark:border-gray-700 p-4">
      <Skeleton className="h-6 w-48" />
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div className="flex gap-3">
        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <div className="flex-1 space-y-2 max-w-md">
          <Skeleton className="h-4 w-full ml-auto" />
          <Skeleton className="h-4 w-3/4 ml-auto" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>

    {/* Input area */}
    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  </div>
);

// Settings skeleton
export const SettingsSkeleton = () => (
  <div className="space-y-6 p-6 max-w-4xl">
    <Skeleton className="h-8 w-48" />

    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-3">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Profile skeleton
export const ProfileSkeleton = () => (
  <div className="space-y-6 p-6 max-w-4xl mx-auto">
    {/* Profile header */}
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-6">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCardSkeleton />
      <StatsCardSkeleton />
      <StatsCardSkeleton />
    </div>

    {/* Content sections */}
    <div className="space-y-4">
      <CardSkeleton />
      <CardSkeleton />
    </div>
  </div>
);

// Group card skeleton
export const GroupCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-start gap-4">
      <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  </div>
);

// Full page loading spinner
export const PageLoader = ({
  message = "Loading...",
}: {
  message?: string;
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-dye-200 border-t-indigo-dye-600 mb-4"></div>
      <p className="text-gray-700 dark:text-gray-300 font-medium">{message}</p>
    </div>
  </div>
);

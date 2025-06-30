import { getServerSession } from "next-auth"; // For server-side session fetching
import { redirect } from "next/navigation"; // For server-side redirection
import LogoutButton from "./logout-button"; // Import the client component for logout

export default async function DashboardPage() {
  // Use getServerSession to retrieve the session data on the server.
  // This is a crucial step for protecting server components.
  const session = await getServerSession();

  // If no session exists, the user is not authenticated.
  // Redirect them to the login page immediately.
  if (!session) {
    redirect("/login");
  }

  // If a session exists, render the dashboard content.
  // Access session.user.email and session.token (thanks to our type augmentation).
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Welcome to ShelfSpace!
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
          You are logged in as:
        </p>
        <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-6 break-words">
          {session.user?.email}
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-3">
          Your Session Token:
        </h2>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto max-h-48 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-500 dark:scrollbar-track-gray-900">
          <code className="text-sm text-gray-800 dark:text-gray-200 break-all whitespace-pre-wrap">
            {session.token}
          </code>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          This is the token you can send to your backend microservices.
        </p>

        {/* The LogoutButton is a client component, imported here */}
        <LogoutButton />
      </div>
    </div>
  );
}

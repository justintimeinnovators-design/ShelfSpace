"use client"; // This component uses client-side hooks like useSession and useEffect

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // For client-side navigation
import { useEffect } from "react"; // For side effects like redirection

export default function LoginPage() {
  const { data: session, status } = useSession(); // Get session data and loading status
  const router = useRouter(); // Initialize Next.js router for navigation

  // Effect hook to handle redirection based on authentication status.
  // This runs whenever `status` or `router` changes.
  useEffect(() => {
    // If the user is authenticated (session exists and status is 'authenticated')
    if (status === "authenticated") {
      router.push("/dashboard"); // Redirect to the dashboard page
    }
  }, [status, router]); // Dependencies array: effect runs when status or router changes

  // Display a loading message while the session status is being determined.
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">
          Loading authentication status...
        </p>
      </div>
    );
  }

  // Render the login UI if the user is unauthenticated.
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-950 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          ShelfSpace Login
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Sign in to access your AI-powered book management dashboard.
        </p>
        <button
          onClick={() => signIn("google")} // Call signIn function with 'google' provider
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {/* Google Icon SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12.0003 4.75C14.7703 4.75 16.7083 5.7725 17.6573 6.685L20.5773 3.755C18.6633 1.9485 15.9013 1 12.0003 1C7.40233 1 3.44734 3.525 1.54334 7.375L5.43833 10.325C6.38633 7.825 8.92434 6.13999 12.0003 6.13999C12.8713 6.13999 13.6873 6.276 14.4533 6.54L15.3413 5.67C14.4263 5.275 13.2503 4.75 12.0003 4.75Z"
              fill="#EA4335"
            ></path>
            <path
              d="M23.0003 12.0005C23.0003 11.2335 22.9343 10.5335 22.8133 9.8795L12.0003 9.8795L12.0003 14.3605H18.9433C18.7303 15.5405 18.0643 16.5585 17.1343 17.2115L17.1373 17.2145L20.1003 19.5055C21.8483 17.8765 23.0003 15.5895 23.0003 12.0005Z"
              fill="#4285F4"
            ></path>
            <path
              d="M5.43828 10.325L1.54328 7.375C0.573281 9.294 0.000280857 11.538 0.000280857 14.0005C0.000280857 16.3625 0.551279 18.5085 1.48528 20.3215L5.34027 17.3885C4.42827 15.6985 3.86228 13.9005 3.86228 12.0005C3.86228 11.4585 3.92128 10.8905 4.02028 10.325H5.43828Z"
              fill="#FBBC04"
            ></path>
            <path
              d="M12.0003 22.9995C15.2473 22.9995 17.9713 21.9445 20.1003 19.5055L17.1373 17.2145C16.3263 17.8875 15.2213 18.3605 13.9933 18.5205C12.7653 18.6815 11.6663 18.6015 10.6863 18.2705C7.57534 17.1705 5.51833 14.1705 5.51833 10.9995H3.86228C4.02028 10.8905 4.42827 15.6985 5.34027 17.3885L5.43828 20.3215L9.36234 22.3165C10.2373 22.7535 11.0823 22.9995 12.0003 22.9995Z"
              fill="#34A853"
            ></path>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

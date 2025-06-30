"use client"; // This component uses client-side hooks like signOut

import { signOut } from "next-auth/react"; // Import signOut function

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })} // Call signOut and redirect to /login afterwards
      className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
    >
      Sign Out
    </button>
  );
}

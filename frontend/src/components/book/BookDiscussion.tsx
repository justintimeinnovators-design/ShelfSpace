"use client";

import { DiscussionThread } from "../../../../types/models";

interface BookDiscussionProps {
  discussions: DiscussionThread[];
}

export default function BookDiscussion({ discussions }: BookDiscussionProps) {
  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold mb-4">Join the Discussion</h2>
      <div className="space-y-4">
        {discussions.map((thread) => (
          <div
            key={thread.id}
            className="flex justify-between items-center p-3 rounded-md hover:bg-gray-100 cursor-pointer"
          >
            <div>
              <p className="font-semibold">{thread.title}</p>
              <p className="text-sm text-gray-600">{thread.replies} replies</p>
            </div>
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full bg-primary text-white px-4 py-2 rounded-md">
        Start a new thread
      </button>
    </div>
  );
}
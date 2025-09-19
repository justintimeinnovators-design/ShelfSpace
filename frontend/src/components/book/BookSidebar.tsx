"use client";

import Image from "next/image";
import { BookDetail } from "../../../types/models";

interface BookSidebarProps {
  book: BookDetail;
  inLibrary: boolean;
  onAddToLibrary: () => void;
  status: "none" | "want" | "reading" | "finished";
  onChangeStatus: (status: "want" | "reading" | "finished") => void;
}

export default function BookSidebar({
  book,
  inLibrary,
  onAddToLibrary,
  status,
  onChangeStatus,
}: BookSidebarProps) {
  return (
    <div className="card p-6 flex flex-col items-center h-full">
      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden mb-4">
        <Image src={book.cover} alt={book.title} fill style={{ objectFit: "cover" }} />
      </div>
      <h2 className="text-xl font-bold text-center">{book.title}</h2>
      <p className="text-md text-gray-600 mb-4 text-center">{book.author}</p>

      <button
        onClick={onAddToLibrary}
        disabled={inLibrary}
        className="w-full bg-primary text-white px-4 py-2 rounded-md mb-2 disabled:bg-gray-400"
      >
        {inLibrary ? "In Library" : "Add to Library"}
      </button>

      <div className="w-full flex justify-around">
        <button
          onClick={() => onChangeStatus("want")}
          className={`px-3 py-1 rounded-md text-sm font-semibold ${
            status === "want" ? "bg-accent text-white" : "bg-gray-200"
          }`}
        >
          Want to Read
        </button>
        <button
          onClick={() => onChangeStatus("reading")}
          className={`px-3 py-1 rounded-md text-sm font-semibold ${
            status === "reading" ? "bg-accent text-white" : "bg-gray-200"
          }`}
        >
          Reading
        </button>
        <button
          onClick={() => onChangeStatus("finished")}
          className={`px-3 py-1 rounded-md text-sm font-semibold ${
            status === "finished" ? "bg-accent text-white" : "bg-gray-200"
          }`}
        >
          Finished
        </button>
      </div>
    </div>
  );
}
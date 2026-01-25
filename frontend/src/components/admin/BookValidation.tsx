"use client";

import { useState } from "react";
import { BookOpen, Loader2, CheckCircle, XCircle, Clock, Search } from "lucide-react";
import { useBookValidation } from "@/hooks/data/useAdmin";
import { ValidationStatus } from "@/lib/admin-service";
import { bookService } from "@/lib/book-service";

export function BookValidation() {
  const [bookId, setBookId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const { validation, loading, error, fetchValidation, updateValidation } = useBookValidation(bookId);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const results = await bookService.searchBooks(searchQuery, 1);
      setSearchResults(results.data || []);
    } catch (err) {
      console.error("Failed to search books:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleValidate = async (status: ValidationStatus, notes?: string) => {
    if (!bookId) {
      alert("Please select a book first");
      return;
    }
    try {
      await updateValidation(status, notes);
      alert(`Book ${status.toLowerCase()} successfully`);
    } catch (err: any) {
      alert(err.message || "Failed to update book validation");
    }
  };

  const getStatusIcon = (status?: ValidationStatus) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">Book Validation</h2>

        {/* Search Books */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Search Books</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by title or author..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={handleSearch}
              disabled={searching}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Search
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-slate-300">Select a book:</p>
              {searchResults.map((book) => (
                <button
                  key={book.id}
                  onClick={() => {
                    setBookId(book.id);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="w-full text-left p-3 bg-white dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 hover:bg-amber-50 dark:hover:bg-slate-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-slate-100">{book.title}</p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">by {book.author}</p>
                    </div>
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Book ID Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Book ID</label>
          <input
            type="text"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            placeholder="Enter book ID or search above"
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
          />
          {bookId && (
            <button
              onClick={fetchValidation}
              disabled={loading}
              className="mt-2 text-sm text-amber-600 dark:text-amber-400 hover:underline"
            >
              Check validation status
            </button>
          )}
        </div>

        {/* Current Validation Status */}
        {validation && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(validation.status)}
                <span className="font-medium text-gray-900 dark:text-slate-100">Current Status: {validation.status}</span>
              </div>
            </div>
            {validation.notes && (
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">Notes: {validation.notes}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">
              Last updated: {new Date(validation.updatedAt).toLocaleString()}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Validation Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => handleValidate("APPROVED")}
            disabled={loading || !bookId}
            className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            Approve
          </button>
          <button
            onClick={() => handleValidate("REJECTED")}
            disabled={loading || !bookId}
            className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
            Reject
          </button>
          <button
            onClick={() => handleValidate("PENDING")}
            disabled={loading || !bookId}
            className="flex-1 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
            Set Pending
          </button>
        </div>
      </div>
    </div>
  );
}


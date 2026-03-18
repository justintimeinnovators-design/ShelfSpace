"use client";

import { useState } from "react";
import { X, Save, Heart, BookOpen, Star, Check } from "lucide-react";

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface Genre {
  id: string;
  name: string;
  selected: boolean;
}

interface Book {
  title: string;
  author: string;
}

const availableGenres: Omit<Genre, 'selected'>[] = [
  { id: "fantasy", name: "Fantasy" },
  { id: "sci-fi", name: "Science Fiction" },
  { id: "mystery", name: "Mystery" },
  { id: "romance", name: "Romance" },
  { id: "thriller", name: "Thriller" },
  { id: "literary-fiction", name: "Literary Fiction" },
  { id: "historical-fiction", name: "Historical Fiction" },
  { id: "biography", name: "Biography" },
  { id: "self-help", name: "Self-Help" },
  { id: "philosophy", name: "Philosophy" },
  { id: "poetry", name: "Poetry" },
  { id: "horror", name: "Horror" },
];

/**
 * Preferences Modal.
 * @param { isOpen, onClose, onSave } - { is Open, on Close, on Save } value.
 */
export function PreferencesModal({ isOpen, onClose, onSave }: PreferencesModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState<Genre[]>(
    availableGenres.map(genre => ({ ...genre, selected: false }))
  );
  const [favoriteBooks, setFavoriteBooks] = useState<Record<string, Book[]>>({});

  const selectedGenres = genres.filter(g => g.selected);

/**
 * Handle Genre Toggle.
 * @param genreId - genre Id value.
 */
  const handleGenreToggle = (genreId: string) => {
    setGenres(prev => prev.map(genre => 
      genre.id === genreId 
        ? { ...genre, selected: !genre.selected }
        : genre
    ));
  };

/**
 * Handle Book Change.
 * @param genreId - genre Id value.
 * @param index - index value.
 * @param field - field value.
 * @param value - value value.
 */
  const handleBookChange = (genreId: string, index: number, field: 'title' | 'author', value: string) => {
    setFavoriteBooks(prev => {
      const genreBooks = prev[genreId] || [];
      const updatedBooks = [...genreBooks];
      
      if (!updatedBooks[index]) {
        updatedBooks[index] = { title: '', author: '' };
      }
      
      updatedBooks[index] = { ...updatedBooks[index], [field]: value };
      
      return { ...prev, [genreId]: updatedBooks };
    });
  };

/**
 * Handle Save.
 */
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Here you would save the user's reading preferences
      // For now, we'll just simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Selected genres:", selectedGenres);
      console.log("Favorite books:", favoriteBooks);
      
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-slate-900 dark:to-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-amber-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">
                Tell Us About Your Reading Taste
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Help us recommend books you'll love
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-amber-100 dark:hover:bg-slate-700 rounded-2xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Favorite Genres */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                What are your favorite genres?
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreToggle(genre.id)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                    genre.selected
                      ? "border-amber-500 bg-amber-100 dark:bg-amber-900/30 shadow-lg transform scale-105"
                      : "border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-md"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">
                      {genre.selected ? <Check className="h-5 w-5 mx-auto" /> : <BookOpen className="h-5 w-5 mx-auto" />}
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {genre.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Favorite Books by Genre */}
          {selectedGenres.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  What are your top 3 books in each genre?
                </h3>
              </div>
              
              <div className="space-y-6">
                {selectedGenres.map((genre) => (
                  <div key={genre.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 dark:border-slate-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {genre.name}
                    </h4>
                    
                    <div className="space-y-4">
                      {[1, 2, 3].map((index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                            <span className="text-amber-600 dark:text-amber-400 font-semibold text-sm">
                              {index}
                            </span>
                          </div>
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Book title"
                              value={favoriteBooks[genre.id]?.[index - 1]?.title || ""}
                              onChange={(e) => handleBookChange(genre.id, index - 1, 'title', e.target.value)}
                              className="px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                            />
                            <input
                              type="text"
                              placeholder="Author name"
                              value={favoriteBooks[genre.id]?.[index - 1]?.author || ""}
                              onChange={(e) => handleBookChange(genre.id, index - 1, 'author', e.target.value)}
                              className="px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-8 border-t border-amber-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium"
          >
            Skip for now
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || selectedGenres.length === 0}
            className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Save className="w-5 h-5" />
            {isLoading ? "Saving..." : "Save My Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}

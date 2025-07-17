'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Filter, 
  Search, 
  Grid, 
  List,
  Star,
  Clock,
  User,
  MoreHorizontal,
  Bookmark,
  Eye,
  ChevronRight,
  Book,
  Heart,
  CheckCircle,
  Clock as ClockIcon
} from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  rating?: number;
  readingProgress?: number;
  timeToRead?: string;
  genre?: string;
  isCurrentlyReading?: boolean;
  isRead?: boolean;
  isWishlist?: boolean;
  dateAdded?: string;
  lastRead?: string;
  pages?: number;
  isbn?: string;
}

interface ReadingList {
  id: string;
  name: string;
  description: string;
  bookCount: number;
  isDefault?: boolean;
  color?: string;
  icon: React.ComponentType<{ className?: string }>;
  books: Book[];
}

const mockReadingLists: ReadingList[] = [
  {
    id: '1',
    name: 'Currently Reading',
    description: 'Books I\'m actively reading',
    bookCount: 3,
    isDefault: true,
    color: 'indigo-dye',
    icon: BookOpen,
    books: [
      {
        id: '1',
        title: 'The Design of Everyday Things',
        author: 'Don Norman',
        rating: 4.5,
        readingProgress: 75,
        timeToRead: '2h 30m',
        genre: 'Design',
        isCurrentlyReading: true,
        dateAdded: '2024-01-15',
        lastRead: '2024-01-20',
        pages: 368,
        isbn: '978-0465050659',
        coverImage: 'https://images.gr-assets.com/books/1327909635m/28348.jpg',
      },
      {
        id: '2',
        title: 'Atomic Habits',
        author: 'James Clear',
        rating: 4.8,
        readingProgress: 45,
        timeToRead: '1h 45m',
        genre: 'Self-Help',
        isCurrentlyReading: true,
        dateAdded: '2024-01-10',
        lastRead: '2024-01-19',
        pages: 320,
        isbn: '978-0735211292',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg',
      },
      {
        id: '3',
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        rating: 4.6,
        readingProgress: 90,
        timeToRead: '3h 15m',
        genre: 'History',
        isCurrentlyReading: true,
        dateAdded: '2024-01-05',
        lastRead: '2024-01-18',
        pages: 464,
        isbn: '978-0062316097',
        coverImage: 'https://images.gr-assets.com/books/1420585954m/23692271.jpg',
      }
    ]
  },
  {
    id: '2',
    name: 'Want to Read',
    description: 'Books on my reading list',
    bookCount: 8,
    color: 'safety-orange',
    icon: Bookmark,
    books: [
      {
        id: '4',
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        rating: 4.7,
        genre: 'Psychology',
        isWishlist: true,
        dateAdded: '2024-01-12',
        pages: 499,
        isbn: '978-0374533557',
        coverImage: 'https://images.gr-assets.com/books/1317793965m/11468377.jpg',
      },
      {
        id: '5',
        title: 'The Lean Startup',
        author: 'Eric Ries',
        rating: 4.4,
        genre: 'Business',
        isWishlist: true,
        dateAdded: '2024-01-08',
        pages: 336,
        isbn: '978-0307887894',
        coverImage: 'https://images.gr-assets.com/books/1348143751m/10127019.jpg',
      },
      {
        id: '6',
        title: 'Project Hail Mary',
        author: 'Andy Weir',
        rating: 4.6,
        genre: 'Science Fiction',
        isWishlist: true,
        dateAdded: '2024-01-14',
        pages: 496,
        isbn: '978-0593135204',
        coverImage: 'https://images.gr-assets.com/books/1597695869m/54493401.jpg',
      }
    ]
  },
  {
    id: '3',
    name: 'Completed',
    description: 'Books I\'ve finished reading',
    bookCount: 12,
    color: 'verdigris',
    icon: CheckCircle,
    books: [
      {
        id: '7',
        title: 'The Midnight Library',
        author: 'Matt Haig',
        rating: 4.3,
        genre: 'Fiction',
        isRead: true,
        dateAdded: '2023-12-01',
        lastRead: '2023-12-15',
        pages: 288,
        isbn: '978-0525559474',
        coverImage: 'https://images.gr-assets.com/books/1588763866m/52578297.jpg',
      },
      {
        id: '8',
        title: 'Dune',
        author: 'Frank Herbert',
        rating: 4.9,
        genre: 'Science Fiction',
        isRead: true,
        dateAdded: '2023-11-10',
        lastRead: '2023-12-10',
        pages: 688,
        isbn: '978-0441172719',
        coverImage: 'https://images.gr-assets.com/books/1555447414m/44767458.jpg',
      },
      {
        id: '9',
        title: 'Deep Work',
        author: 'Cal Newport',
        rating: 4.5,
        genre: 'Productivity',
        isRead: true,
        dateAdded: '2023-10-20',
        lastRead: '2023-11-25',
        pages: 304,
        isbn: '978-1455586692',
        coverImage: 'https://images.gr-assets.com/books/1447957962m/25744928.jpg',
      }
    ]
  },
  {
    id: '4',
    name: 'Favorites',
    description: 'My all-time favorite books',
    bookCount: 5,
    color: 'turkey-red',
    icon: Heart,
    books: [
      {
        id: '10',
        title: 'The Name of the Wind',
        author: 'Patrick Rothfuss',
        rating: 5.0,
        genre: 'Fantasy',
        isRead: true,
        dateAdded: '2023-08-15',
        lastRead: '2023-09-20',
        pages: 662,
        isbn: '978-0756404741',
        coverImage: 'https://images.gr-assets.com/books/1554006152m/186074.jpg',
      },
      {
        id: '11',
        title: 'Educated',
        author: 'Tara Westover',
        rating: 4.8,
        genre: 'Memoir',
        isRead: true,
        dateAdded: '2023-07-10',
        lastRead: '2023-08-05',
        pages: 334,
        isbn: '978-0399590504',
        coverImage: 'https://images.gr-assets.com/books/1506026635m/35133922.jpg',
      }
    ]
  }
];

const LibraryContent: React.FC = () => {
  const [selectedList, setSelectedList] = useState<string>('1');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGenre, setFilterGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'dateAdded' | 'rating'>('title');

  const currentList = mockReadingLists.find(list => list.id === selectedList);
  const filteredBooks = currentList?.books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = filterGenre === 'all' || book.genre === filterGenre;
    return matchesSearch && matchesGenre;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'title': return a.title.localeCompare(b.title);
      case 'author': return a.author.localeCompare(b.author);
      case 'dateAdded': return new Date(b.dateAdded || '').getTime() - new Date(a.dateAdded || '').getTime();
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      default: return 0;
    }
  }) || [];

  const genres = Array.from(new Set(mockReadingLists.flatMap(list => 
    list.books.map(book => book.genre).filter(Boolean)
  )));

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'indigo-dye': return 'bg-indigo-dye-50 text-indigo-dye-700 border-indigo-dye-200';
      case 'safety-orange': return 'bg-safety-orange-50 text-safety-orange-700 border-safety-orange-200';
      case 'verdigris': return 'bg-verdigris-50 text-verdigris-700 border-verdigris-200';
      case 'turkey-red': return 'bg-turkey-red-50 text-turkey-red-700 border-turkey-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadge = (book: Book) => {
    if (book.isCurrentlyReading) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-dye-100 text-indigo-dye-800">
          <BookOpen className="h-3 w-3 mr-1" />
          Reading
        </span>
      );
    }
    if (book.isRead) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-verdigris-100 text-verdigris-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Read
        </span>
      );
    }
    if (book.isWishlist) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-safety-orange-100 text-safety-orange-800">
          <Bookmark className="h-3 w-3 mr-1" />
          Wishlist
        </span>
      );
    }
    return null;
  };

  const BookCard: React.FC<{ book: Book }> = ({ book }) => (
    <div
      className="relative group rounded-lg overflow-hidden shadow-md border border-gray-200 bg-white transition-all duration-300 hover:shadow-2xl hover:scale-110 focus-within:scale-110 z-0 hover:z-20 focus-within:z-20"
      style={{ aspectRatio: '2/3', width: '180px', minWidth: '180px', maxWidth: '180px' }}
      tabIndex={0}
    >
      {/* Book Cover */}
      <img
        src={book.coverImage}
        alt={book.title + ' cover'}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {/* Title Overlay */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent px-3 py-2 flex items-end pointer-events-none">
        <span className="text-white text-base font-semibold truncate w-full drop-shadow-md">{book.title}</span>
      </div>
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-10 px-4 py-4">
        {/* Full Title & Author */}
        <div className="mb-4 w-full text-center">
          <div className="text-lg font-bold text-white leading-tight mb-1 break-words">{book.title}</div>
          <div className="text-sm text-gray-200 mb-2 break-words">{book.author}</div>
        </div>
        <div className="flex flex-col items-center space-y-2 w-full">
          {book.rating && (
            <div className="flex items-center space-x-1 text-yellow-400 text-base">
              <Star className="h-5 w-5 fill-yellow-400" />
              <span className="font-semibold text-white">{book.rating}</span>
            </div>
          )}
          {book.readingProgress !== undefined && (
            <div className="w-32">
              <div className="flex justify-between text-xs text-gray-200 mb-1">
                <span>Progress</span>
                <span>{book.readingProgress}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-indigo-dye-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${book.readingProgress}%` }}
                />
              </div>
            </div>
          )}
          {book.pages && (
            <div className="text-xs text-gray-200 mt-2">{book.pages} pages</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            {/* Removed <h1>My Library</h1> page title, as it should only appear in the top bar/header */}
            <button className="btn-primary flex items-center space-x-2 text-sm">
              <Plus className="h-4 w-4" />
              <span>Add Book</span>
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-dye-500 focus:border-indigo-dye-500"
            />
          </div>
        </div>

        {/* Reading Lists */}
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Reading Lists</h2>
          <div className="space-y-2">
            {mockReadingLists.map((list) => {
              const IconComponent = list.icon;
              return (
                <button
                  key={list.id}
                  onClick={() => setSelectedList(list.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                    selectedList === list.id
                      ? getColorClasses(list.color)
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`h-5 w-5 ${
                      selectedList === list.id ? '' : 'text-gray-400'
                    }`} />
                    <div className="text-left">
                      <p className="font-medium">{list.name}</p>
                      <p className="text-xs text-gray-500">{list.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded-full font-medium">
                      {list.bookCount}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Content Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{currentList?.name}</h2>
              <p className="text-gray-600">{currentList?.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-indigo-dye-100 text-indigo-dye-700' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-indigo-dye-100 text-indigo-dye-700' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-dye-500 focus:border-indigo-dye-500"
            >
              <option value="all">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-dye-500 focus:border-indigo-dye-500"
            >
              <option value="title">Sort by Title</option>
              <option value="author">Sort by Author</option>
              <option value="dateAdded">Sort by Date Added</option>
              <option value="rating">Sort by Rating</option>
            </select>

            <span className="text-sm text-gray-600">
              {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Books Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredBooks.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
              : 'space-y-6'
            }>
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Book className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryContent; 
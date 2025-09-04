'use client';

import React, { useState } from 'react';
import LibrarySidebar from './LibrarySidebar';
import LibraryHeader from './LibraryHeader';
import BookGrid from './BookGrid';
import BookList from './BookList';
import { BookOpen, Bookmark, CheckCircle, Heart } from 'lucide-react';
import { Book, ReadingList } from '../../../types/library';

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

  return (
    <div className="flex h-screen bg-gray-50">
      <LibrarySidebar 
        readingLists={mockReadingLists}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <LibraryHeader 
          currentList={currentList}
          viewMode={viewMode}
          setViewMode={setViewMode}
          filterGenre={filterGenre}
          setFilterGenre={setFilterGenre}
          sortBy={sortBy}
          setSortBy={setSortBy}
          genres={genres}
          filteredBooksCount={filteredBooks.length}
        />

        {/* Books Display */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredBooks.length > 0 ? (
            viewMode === 'grid' ? (
              <BookGrid books={filteredBooks} />
            ) : (
              <BookList books={filteredBooks} />
            )
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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

import { initialCurrentlyReading } from './books';
import { initialRecommendations } from './recommendations';
import { initialReadingGroups } from './groups';
import { initialRecentActivity } from './activity';
import { initialUserSettings } from './user';
import { initialMessages } from './chat';
import { BookDetail, DiscussionThread, SimilarBookItem, UserReview } from '../../../types/models';

export {
  initialCurrentlyReading,
  initialRecommendations,
  initialReadingGroups,
  initialRecentActivity,
  initialUserSettings,
  initialMessages,
};

// Mock Book Details by ID
export const bookDetailsById: Record<number, BookDetail> = {
  1: {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    cover: '/book-covers/the-great-gatsby.jpg',
    rating: 4.1,
    ratingsCount: 3892142,
    genres: ['Classic', 'Fiction', 'Literature'],
    description:
      'A portrait of the Jazz Age in all of its decadence and excess, Gatsby captured the spirit of the author’s generation and earned itself a permanent place in American mythology.',
  },
  2: {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    cover: '/book-covers/1984.jpg',
    rating: 4.2,
    ratingsCount: 5489211,
    genres: ['Dystopian', 'Science Fiction', 'Political'],
    description:
      'A chilling prophecy about the future, and a haunting tale of power, surveillance, and truth in a totalitarian regime.',
  },
  3: {
    id: 3,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    cover: '/book-covers/to-kill-a-mockingbird.jpg',
    rating: 4.3,
    ratingsCount: 5123890,
    genres: ['Classic', 'Historical', 'Coming of Age'],
    description:
      'A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.',
  },
  4: {
    id: 4,
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: '/book-covers/atomic-habits.jpg',
    rating: 4.5,
    ratingsCount: 1234567,
    genres: ['Self-Help', 'Productivity', 'Psychology'],
    description:
      'An Easy & Proven Way to Build Good Habits & Break Bad Ones. Tiny changes that compound into remarkable results.',
  },
  5: {
    id: 5,
    title: 'Deep Work',
    author: 'Cal Newport',
    cover: '/book-covers/deep-work.jpg',
    rating: 4.2,
    ratingsCount: 987654,
    genres: ['Productivity', 'Business', 'Psychology'],
    description:
      'Rules for Focused Success in a Distracted World. Learn how to focus without distraction and produce better work.',
  },
  6: {
    id: 6,
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    cover: '/book-covers/design-of-everyday-things.jpg',
    rating: 4.3,
    ratingsCount: 456789,
    genres: ['Design', 'Psychology', 'Technology'],
    description:
      'A powerful primer on how and why some products satisfy customers while others only frustrate them.',
  },
  7: {
    id: 7,
    title: 'Dune',
    author: 'Frank Herbert',
    cover: '/book-covers/dune.jpg',
    rating: 4.6,
    ratingsCount: 2345678,
    genres: ['Science Fiction', 'Fantasy', 'Adventure'],
    description:
      'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.',
  },
  8: {
    id: 8,
    title: 'Educated',
    author: 'Tara Westover',
    cover: '/book-covers/educated.jpg',
    rating: 4.4,
    ratingsCount: 876543,
    genres: ['Memoir', 'Biography', 'Education'],
    description:
      'A memoir about a woman who grows up in a survivalist Mormon family and eventually goes on to earn a PhD from Cambridge University.',
  },
  9: {
    id: 9,
    title: 'The Lean Startup',
    author: 'Eric Ries',
    cover: '/book-covers/lean-startup.jpg',
    rating: 4.1,
    ratingsCount: 654321,
    genres: ['Business', 'Entrepreneurship', 'Management'],
    description:
      'How Today\'s Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses.',
  },
  10: {
    id: 10,
    title: 'The Midnight Library',
    author: 'Matt Haig',
    cover: '/book-covers/midnight-library.jpg',
    rating: 4.0,
    ratingsCount: 789012,
    genres: ['Fiction', 'Fantasy', 'Philosophy'],
    description:
      'A dazzling novel about all the choices that go into a life well lived, from the internationally bestselling author.',
  },
  11: {
    id: 11,
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    cover: '/book-covers/name-of-the-wind.jpg',
    rating: 4.7,
    ratingsCount: 3456789,
    genres: ['Fantasy', 'Adventure', 'Magic'],
    description:
      'The story of Kvothe, an adventurer and musician, told in his own voice. A tale of magic, mystery, and adventure.',
  },
  12: {
    id: 12,
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    cover: '/book-covers/project-hail-mary.jpg',
    rating: 4.5,
    ratingsCount: 567890,
    genres: ['Science Fiction', 'Adventure', 'Space'],
    description:
      'A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the #1 New York Times bestselling author.',
  },
  13: {
    id: 13,
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    cover: '/book-covers/sapiens.jpg',
    rating: 4.3,
    ratingsCount: 1234567,
    genres: ['History', 'Anthropology', 'Philosophy'],
    description:
      'A Brief History of Humankind. From a renowned historian comes a groundbreaking narrative of humanity\'s creation and evolution.',
  },
  14: {
    id: 14,
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    cover: '/book-covers/thinking-fast-slow.jpg',
    rating: 4.2,
    ratingsCount: 987654,
    genres: ['Psychology', 'Science', 'Philosophy'],
    description:
      'The author of the bestseller "Thinking, Fast and Slow" reveals how our minds are tripped up by error and bias.',
  },
};

// Mock Similar Books by Book ID
export const similarBooksById: Record<number, SimilarBookItem[]> = {
  1: [
    { id: 2, title: '1984', author: 'George Orwell', cover: '/book-covers/1984.jpg' },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', cover: '/book-covers/to-kill-a-mockingbird.jpg' },
    { id: 7, title: 'Dune', author: 'Frank Herbert', cover: '/book-covers/dune.jpg' },
  ],
  2: [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', cover: '/book-covers/the-great-gatsby.jpg' },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', cover: '/book-covers/to-kill-a-mockingbird.jpg' },
    { id: 7, title: 'Dune', author: 'Frank Herbert', cover: '/book-covers/dune.jpg' },
  ],
  3: [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', cover: '/book-covers/the-great-gatsby.jpg' },
    { id: 2, title: '1984', author: 'George Orwell', cover: '/book-covers/1984.jpg' },
    { id: 8, title: 'Educated', author: 'Tara Westover', cover: '/book-covers/educated.jpg' },
  ],
  4: [
    { id: 5, title: 'Deep Work', author: 'Cal Newport', cover: '/book-covers/deep-work.jpg' },
    { id: 6, title: 'The Design of Everyday Things', author: 'Don Norman', cover: '/book-covers/design-of-everyday-things.jpg' },
    { id: 14, title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', cover: '/book-covers/thinking-fast-slow.jpg' },
  ],
  5: [
    { id: 4, title: 'Atomic Habits', author: 'James Clear', cover: '/book-covers/atomic-habits.jpg' },
    { id: 6, title: 'The Design of Everyday Things', author: 'Don Norman', cover: '/book-covers/design-of-everyday-things.jpg' },
    { id: 9, title: 'The Lean Startup', author: 'Eric Ries', cover: '/book-covers/lean-startup.jpg' },
  ],
  6: [
    { id: 4, title: 'Atomic Habits', author: 'James Clear', cover: '/book-covers/atomic-habits.jpg' },
    { id: 5, title: 'Deep Work', author: 'Cal Newport', cover: '/book-covers/deep-work.jpg' },
    { id: 14, title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', cover: '/book-covers/thinking-fast-slow.jpg' },
  ],
  7: [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', cover: '/book-covers/the-great-gatsby.jpg' },
    { id: 2, title: '1984', author: 'George Orwell', cover: '/book-covers/1984.jpg' },
    { id: 11, title: 'The Name of the Wind', author: 'Patrick Rothfuss', cover: '/book-covers/name-of-the-wind.jpg' },
  ],
  8: [
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', cover: '/book-covers/to-kill-a-mockingbird.jpg' },
    { id: 10, title: 'The Midnight Library', author: 'Matt Haig', cover: '/book-covers/midnight-library.jpg' },
    { id: 13, title: 'Sapiens', author: 'Yuval Noah Harari', cover: '/book-covers/sapiens.jpg' },
  ],
  9: [
    { id: 4, title: 'Atomic Habits', author: 'James Clear', cover: '/book-covers/atomic-habits.jpg' },
    { id: 5, title: 'Deep Work', author: 'Cal Newport', cover: '/book-covers/deep-work.jpg' },
    { id: 6, title: 'The Design of Everyday Things', author: 'Don Norman', cover: '/book-covers/design-of-everyday-things.jpg' },
  ],
  10: [
    { id: 8, title: 'Educated', author: 'Tara Westover', cover: '/book-covers/educated.jpg' },
    { id: 11, title: 'The Name of the Wind', author: 'Patrick Rothfuss', cover: '/book-covers/name-of-the-wind.jpg' },
    { id: 13, title: 'Sapiens', author: 'Yuval Noah Harari', cover: '/book-covers/sapiens.jpg' },
  ],
  11: [
    { id: 7, title: 'Dune', author: 'Frank Herbert', cover: '/book-covers/dune.jpg' },
    { id: 10, title: 'The Midnight Library', author: 'Matt Haig', cover: '/book-covers/midnight-library.jpg' },
    { id: 12, title: 'Project Hail Mary', author: 'Andy Weir', cover: '/book-covers/project-hail-mary.jpg' },
  ],
  12: [
    { id: 7, title: 'Dune', author: 'Frank Herbert', cover: '/book-covers/dune.jpg' },
    { id: 11, title: 'The Name of the Wind', author: 'Patrick Rothfuss', cover: '/book-covers/name-of-the-wind.jpg' },
    { id: 2, title: '1984', author: 'George Orwell', cover: '/book-covers/1984.jpg' },
  ],
  13: [
    { id: 8, title: 'Educated', author: 'Tara Westover', cover: '/book-covers/educated.jpg' },
    { id: 10, title: 'The Midnight Library', author: 'Matt Haig', cover: '/book-covers/midnight-library.jpg' },
    { id: 14, title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', cover: '/book-covers/thinking-fast-slow.jpg' },
  ],
  14: [
    { id: 4, title: 'Atomic Habits', author: 'James Clear', cover: '/book-covers/atomic-habits.jpg' },
    { id: 6, title: 'The Design of Everyday Things', author: 'Don Norman', cover: '/book-covers/design-of-everyday-things.jpg' },
    { id: 13, title: 'Sapiens', author: 'Yuval Noah Harari', cover: '/book-covers/sapiens.jpg' },
  ],
};

// Mock Discussions by Book ID
export const discussionsByBookId: Record<number, DiscussionThread[]> = {
  1: [
    { id: 101, title: 'Symbolism of the green light', replies: 42 },
    { id: 102, title: 'Is Gatsby a tragic hero?', replies: 27 },
  ],
  2: [
    { id: 201, title: 'Modern parallels to 1984', replies: 58 },
    { id: 202, title: 'Big Brother interpretations', replies: 19 },
  ],
  3: [
    { id: 301, title: 'Moral lessons from Atticus Finch', replies: 33 },
    { id: 302, title: 'Perspective of Scout as narrator', replies: 21 },
  ],
  4: [
    { id: 401, title: 'Best habits to start with', replies: 89 },
    { id: 402, title: 'Habit stacking techniques', replies: 45 },
  ],
  5: [
    { id: 501, title: 'Deep work vs shallow work', replies: 67 },
    { id: 502, title: 'Digital minimalism tips', replies: 34 },
  ],
  6: [
    { id: 601, title: 'Design principles in everyday life', replies: 23 },
    { id: 602, title: 'Affordances and signifiers', replies: 18 },
  ],
  7: [
    { id: 701, title: 'Dune universe politics', replies: 156 },
    { id: 702, title: 'Spice and its significance', replies: 78 },
  ],
  8: [
    { id: 801, title: 'Education vs indoctrination', replies: 92 },
    { id: 802, title: 'Family dynamics in the book', replies: 41 },
  ],
  9: [
    { id: 901, title: 'MVP vs perfection', replies: 56 },
    { id: 902, title: 'Pivot strategies', replies: 29 },
  ],
  10: [
    { id: 1001, title: 'Regret and second chances', replies: 73 },
    { id: 1002, title: 'Philosophy of the midnight library', replies: 38 },
  ],
  11: [
    { id: 1101, title: 'Magic system in Kingkiller', replies: 124 },
    { id: 1102, title: 'Kvothe as unreliable narrator', replies: 67 },
  ],
  12: [
    { id: 1201, title: 'Science accuracy in the book', replies: 89 },
    { id: 1202, title: 'Rocky character development', replies: 45 },
  ],
  13: [
    { id: 1301, title: 'Cognitive revolution impact', replies: 112 },
    { id: 1302, title: 'Agricultural revolution consequences', replies: 58 },
  ],
  14: [
    { id: 1401, title: 'System 1 vs System 2 thinking', replies: 95 },
    { id: 1402, title: 'Cognitive biases in daily life', replies: 63 },
  ],
};

// Optional: seed reviews per book (empty by default)
export const reviewsByBookId: Record<number, UserReview[]> = {
  1: [
    {
      id: 1,
      user: 'Alex',
      rating: 5,
      text: 'Timeless and beautifully written.',
      createdAt: new Date().toISOString(),
    },
  ],
  2: [
    {
      id: 2,
      user: 'Sarah',
      rating: 4,
      text: 'Disturbing but important read.',
      createdAt: new Date().toISOString(),
    },
  ],
  3: [
    {
      id: 3,
      user: 'Mike',
      rating: 5,
      text: 'A masterpiece of American literature.',
      createdAt: new Date().toISOString(),
    },
  ],
  4: [
    {
      id: 4,
      user: 'Emma',
      rating: 5,
      text: 'Life-changing book on habits.',
      createdAt: new Date().toISOString(),
    },
  ],
  5: [
    {
      id: 5,
      user: 'David',
      rating: 4,
      text: 'Great insights on focused work.',
      createdAt: new Date().toISOString(),
    },
  ],
  6: [],
  7: [
    {
      id: 7,
      user: 'Lisa',
      rating: 5,
      text: 'Epic science fiction at its best.',
      createdAt: new Date().toISOString(),
    },
  ],
  8: [],
  9: [],
  10: [],
  11: [],
  12: [],
  13: [],
  14: [],
};
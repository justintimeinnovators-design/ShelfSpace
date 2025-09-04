import { Book } from '../../../types/models'; 

export const initialCurrentlyReading: Book[] = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', progress: 60, cover: '/book-covers/the-great-gatsby.jpg' },
  { id: 2, title: '1984', author: 'George Orwell', progress: 25, cover: '/book-covers/1984.jpg' },
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', progress: 90, cover: '/book-covers/to-kill-a-mockingbird.jpg' },
];

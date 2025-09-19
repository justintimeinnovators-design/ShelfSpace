export interface Book {
    id: number;
    title: string;
    author: string;
    progress: number;
    cover: string;
  }
  
  export interface Recommendation {
    id: number;
    title: string;
    author: string;
    reason: string;
    cover: string;
  }
  
  export interface ReadingGroup {
    id: number;
    name: string;
    members: number;
    currentBook: string;
  }
  
  export interface Activity {
    id: number;
    action: string;
    book?: string;
    group?: string;
    rating?: number;
    time: string;
  }
  
  // Book Details Page Types
  export interface BookDetail {
    id: number;
    title: string;
    author: string;
    cover: string;
    rating: number; // average rating 0-5
    ratingsCount: number;
    genres: string[];
    description: string;
  }
  
  export interface SimilarBookItem {
    id: number;
    title: string;
    author: string;
    cover: string;
  }
  
  export interface DiscussionThread {
    id: number;
    title: string;
    replies: number;
  }
  
  export interface UserReview {
    id: number;
    user: string;
    rating: number; // 1-5
    text: string;
    createdAt: string; // ISO string
  }
  
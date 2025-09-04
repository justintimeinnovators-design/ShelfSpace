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
  
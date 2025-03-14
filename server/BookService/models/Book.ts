import mongoose, { Schema, Document, Types, Model, model } from "mongoose";

export default interface IBook {
  isbn: string;
  isbn13: string;
  country_code: string;
  is_ebook: boolean;
  description: string;
  language_code: string;
  publication_data: Date;
  publisher: string;
  num_pages: Number;
  image_url: string;
  title: string;
}
type BookModel = Model<IBook>;

const BookSchema = new Schema<IBook, BookModel>({
  isbn: {
    type: String,
  },
  isbn13: {
    type: String,
  },
  country_code: {
    type: String,
  },
  is_ebook: {
    type: Boolean,
  },
  description: {
    type: String,
  },
  language_code: {
    type: String,
  },
  publication_data: {
    type: Date,
  },
  publisher: {
    type: String,
  },
  num_pages: {
    type: Number,
  },
  image_url: {
    type: String,
  },
  title: {
    type: String,
  },
});

export const Book: BookModel = model<IBook, BookModel>("Book", BookSchema);

// const json = {
//   isbn: "0312853122",
//   text_reviews_count: "1",
//   series: [],
//   country_code: "US",
//   language_code: "",
//   popular_shelves: [
//     { count: "3", name: "to-read" },
//     { count: "1", name: "p" },
//     { count: "1", name: "collection" },
//     { count: "1", name: "w-c-fields" },
//     { count: "1", name: "biography" },
//   ],
//   asin: "",
//   is_ebook: "false",
//   average_rating: "4.00",
//   kindle_asin: "",
//   similar_books: [],
//   description: "",
//   format: "Paperback",
//   link: "https://www.goodreads.com/book/show/5333265-w-c-fields",
//   authors: [{ author_id: "604031", role: "" }],
//   publisher: "St. Martin's Press",
//   num_pages: "256",
//   publication_day: "1",
//   isbn13: "9780312853129",
//   publication_month: "9",
//   edition_information: "",
//   publication_year: "1984",
//   url: "https://www.goodreads.com/book/show/5333265-w-c-fields",
//   image_url: "https://images.gr-assets.com/books/1310220028m/5333265.jpg",
//   book_id: "5333265",
//   ratings_count: "3",
//   work_id: "5400751",
//   title: "W.C. Fields: A Life on Film",
//   title_without_series: "W.C. Fields: A Life on Film",
// };

import mongoose from "mongoose";

//example scema
//{"series": ["193052"], "language_code": "eng", "average_rating": "3.91",
// "similar_books": ["1724619", "7098832", "419471", "6503160", "1530868", "303202", "342984", "702573", "2795472", "3568573", "825834", "238466", "32489221", "7601805", "226082"],
//  "description": "It's hardly the type of wedding Fiona MacLean dreamed of. No family, no guests, just a groom who's been dragged -- literally -- to the altar. But if marriage to Black Jack Kincaid, the handsome wastrel she'd sworn never to see again, will avert a bloody war between their clans, so be it. Surely she can share his bed without losing her heart.... \nKnown throughout Scotland and London as a wild rogue, Jack is accustomed to waking in dire situations, but...married? Long ago, he and Fiona reveled in a youthful passion. Now, the fiery, sensual lass is his once more. And though their marriage is in name only, Jack is determined to win her forever -- body and soul....",
//  "authors": [{"author_id": "4633", "name": "Karen Hawkins", "role": ""}], "publisher": "", "num_pages": "313", "isbn13": "9781416525035",
// "publication_year": "2007", "url": "https://www.goodreads.com/book/show/300043.How_to_Abduct_a_Highland_Lord",
// "image_url": "https://images.gr-assets.com/books/1410977930m/300043.jpg", "book_id": "300043", "ratings_count": "3899",
// "work_id": "2084690", "title": "How to Abduct a Highland Lord (MacLean Curse, #1)",
// "title_without_series": "How to Abduct a Highland Lord (MacLean Curse, #1)",
// "genres": ["Historical Romance", "Adult", "Scotland", "Historical Fiction", "Historical"]},

// Define the schema for the Book model
// This structure will be enforced for every document in the 'books' collection
const bookSchema = new mongoose.Schema(
  {
    series: [{ type: String, trim: true }],
    language_code: { type: String, trim: true },
    average_rating: { type: Number, default: 0 },
    // Storing an array of strings/ObjectIds for similar books
    similar_books: [{ type: String }],
    description: { type: String, trim: true },
    authors: [{ author_id: String, name: String, role: String }],
    publisher: { type: String },
    num_pages: { type: Number },
    isbn13: { type: String },
    publication_year: { type: String },
    url: { type: String },
    image_url: { type: String },
    book_id: { type: String, required: true, unique: true },
    // ratings_count: { type: Number, default: 0 },
    work_id: { type: String },
    title: { type: String, required: true, trim: true },
    title_without_series: { type: String, trim: true },
    genres: [{ type: String }],
  },
  {
    // Automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

// Create a text index for efficient searching on title and authors
bookSchema.index({ title: "text", authors: "text", book_id: "text" });

// Create and export the Mongoose model
const Book = mongoose.model("Book", bookSchema);

export default Book;

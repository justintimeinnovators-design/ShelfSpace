import fs from "fs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Book from "./src/models/book.ts"; // Assuming your Mongoose model is here

// --- Configuration ---
dotenv.config(); // Load environment variables from .env file
const DATA_FILE_PATH =
  "./src/data/complete_goodreads_filtered_books_authors2.json"; // The file path for your book data
const BATCH_SIZE = 500; // The number of documents to insert in a single batch

const RESUME_FROM_BOOK_ID = 57101;

const uploadData = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("Error: MONGO_URI is not set in the .env file.");
      process.exit(1);
    }
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to the database.");

    // +++ GET COUNT OF EXISTING BOOKS FIRST +++
    console.log("Checking for existing books in the database...");
    const existingBookCount = await Book.countDocuments();
    console.log(`Found ${existingBookCount} books already in the database.`);

    console.log(`Reading data from ${DATA_FILE_PATH}...`);
    const booksData = JSON.parse(fs.readFileSync(DATA_FILE_PATH, "utf-8"));

    if (!Array.isArray(booksData)) {
      throw new Error("JSON data must be a list of book objects.");
    }

    const totalBooksInFile = booksData.length;
    console.log(`Found ${totalBooksInFile} total books in the JSON file.`);

    if (existingBookCount >= totalBooksInFile) {
      console.log("Database is already up-to-date. No new books to upload.");
      return; // Exit the function gracefully
    }

    // +++ SLICE THE ARRAY BASED ON THE COUNT OF EXISTING BOOKS +++
    console.log(
      `Resuming upload by skipping the first ${existingBookCount} books.`
    );
    const booksToUpload = booksData.slice(existingBookCount);

    const totalBooksToUpload = booksToUpload.length;
    if (totalBooksToUpload === 0) {
      console.log("No new books to upload.");
      return;
    }

    console.log(
      `Starting upload of ${totalBooksToUpload} remaining books in batches of ${BATCH_SIZE}...`
    );
    for (let i = 0; i < totalBooksToUpload; i += BATCH_SIZE) {
      const batch = booksToUpload.slice(i, i + BATCH_SIZE);
      if (batch.length === 0) continue;

      console.log(
        `Uploading batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(
          totalBooksToUpload / BATCH_SIZE
        )}...`
      );

      // +++ NEW: ERROR HANDLING FOR DUPLICATE KEYS +++
      try {
        // The `ordered: false` option is crucial. It ensures that all documents
        // in the batch are attempted, even if some fail.
        await Book.insertMany(batch, { ordered: false });
      } catch (error) {
        // Check if the error is the specific duplicate key error (code 11000).
        // A bulk write operation might wrap this in a writeErrors array.
        if (
          error.code === 11000 ||
          (error.writeErrors &&
            error.writeErrors.some((err) => err.code === 11000))
        ) {
          console.warn(
            `--> Warning: Duplicate key errors were found in this batch. The script ignored them and is continuing.`
          );
        } else {
          // If it's a different error, we should stop the script.
          throw error;
        }
      }
    }

    const finalCount = await Book.countDocuments();
    console.log("\n✅ Upload complete!");
    console.log(`Current total books in the database: ${finalCount}`);
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
};

uploadData();

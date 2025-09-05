import { Router } from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  searchBooks,
  getGenres,
  getAuthors,
  getLanguages,
} from "../controllers/book.controller.ts";
import validate from "../middlewares/validate.ts";
import {
  createBookSchema,
  updateBookSchema,
  getBookByIdSchema,
  deleteBookSchema,
  searchBookSchema,
} from "../schemas.ts";

const router = Router();

router.post("/", validate(createBookSchema), createBook);
router.get("/search", validate(searchBookSchema), searchBooks);
router.get("/genres", getGenres);
router.get("/authors", getAuthors);
router.get("/languages", getLanguages);

router.get("/", getAllBooks);
router.get("/:bookId", validate(getBookByIdSchema), getBookById);
router.put("/:id", validate(updateBookSchema), updateBook);
router.delete("/:id", validate(deleteBookSchema), deleteBook);

export default router;

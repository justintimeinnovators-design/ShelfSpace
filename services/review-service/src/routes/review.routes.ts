import express from 'express';
import prisma from '../prisma.js';
import { createReviewSchema, updateReviewSchema } from '../schemas.js';

const router = express.Router();

// Create a new review
router.post('/', async (req, res) => {
  const parseResult = createReviewSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid input', details: parseResult.error.errors });
  }

  try {
    const review = await prisma.review.create({
      data: parseResult.data,
    });
    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all reviews for a specific book
router.get('/book/:bookId', async (req, res) => {
  const { bookId } = req.params;
  try {
    const reviews = await prisma.review.findMany({
      where: { bookId },
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews for book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all reviews from a specific user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const reviews = await prisma.review.findMany({
      where: { userId },
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews for user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single review by its ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const review = await prisma.review.findUnique({
      where: { id },
    });
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a review
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const parseResult = updateReviewSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid input', details: parseResult.error.errors });
  }

  try {
    const updatedReview = await prisma.review.update({
      where: { id },
      data: parseResult.data,
    });
    res.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a review
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.review.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

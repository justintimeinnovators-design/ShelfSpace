import { Router } from "express";
import { getCollections } from "../db.js";

const router = Router();

/**
 * Get Favorite Genre.
 * @param genres - genres value.
 */
function getFavoriteGenre(genres: Record<string, number>) {
  const entries = Object.entries(genres || {});
  if (entries.length === 0) return "N/A";
  return entries.sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";
}

/**
 * Get Monthly Series.
 * @param monthly - monthly value.
 */
function getMonthlySeries(
  monthly: Record<string, { books: number; pages: number; minutes: number }>
) {
  const now = new Date();
  const months: { key: string; label: string }[] = [];
  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleString("default", { month: "short" });
    months.push({ key, label });
  }

  return months.map(({ key, label }) => ({
    month: label,
    books: monthly[key]?.books || 0,
    pages: monthly[key]?.pages || 0,
    hours: Math.round((monthly[key]?.minutes || 0) / 60),
  }));
}

router.get("/dashboard/summary", async (req, res) => {
  try {
    const { analytics } = await getCollections();
    const doc = await analytics.findOne({ userId: req.userId });
    if (!doc) {
      return res.json({
        totalBooks: 0,
        booksRead: 0,
        currentlyReading: 0,
        wantToRead: 0,
        readingGoal: 52,
        currentStreak: 0,
        averageRating: 0,
        totalPages: 0,
        readingTime: 0,
        favoriteGenre: "N/A",
      });
    }

    const averageRating = doc.stats.ratingCount > 0
      ? doc.stats.totalRating / doc.stats.ratingCount
      : 0;

    res.json({
      totalBooks: doc.stats.totalBooks,
      booksRead: doc.stats.booksRead,
      currentlyReading: doc.stats.currentlyReading,
      wantToRead: doc.stats.wantToRead,
      readingGoal: doc.goals.yearlyGoal,
      currentStreak: doc.stats.currentStreak,
      averageRating: Math.round(averageRating * 10) / 10,
      totalPages: doc.stats.totalPages,
      readingTime: Math.round(doc.stats.totalReadingMinutes / 60),
      favoriteGenre: getFavoriteGenre(doc.genres),
    });
  } catch (error) {
    console.error("Failed to load dashboard summary:", error);
    res.status(500).json({ error: "Failed to load dashboard summary" });
  }
});

router.get("/dashboard/reading-analytics", async (req, res) => {
  try {
    const { analytics } = await getCollections();
    const doc = await analytics.findOne({ userId: req.userId });
    if (!doc) {
      return res.json({
        readingTrends: [],
        genreData: [],
        monthlyData: [],
        ratingData: [],
        stats: {
          totalBooksThisYear: 0,
          averageBooksPerMonth: 0,
          totalPagesRead: 0,
          averageRating: 0,
          readingTime: 0,
          favoriteGenre: "N/A",
          longestStreak: 0,
          currentStreak: 0,
        },
      });
    }

    const monthlySeries = getMonthlySeries(doc.monthly);
    const totalBooksThisYear = monthlySeries.reduce((sum, m) => sum + m.books, 0);
    const totalPagesRead = monthlySeries.reduce((sum, m) => sum + m.pages, 0);

    const averageBooksPerMonth = monthlySeries.length
      ? totalBooksThisYear / monthlySeries.length
      : 0;

    const averageRating = doc.stats.ratingCount > 0
      ? doc.stats.totalRating / doc.stats.ratingCount
      : 0;

    const genreData = Object.entries(doc.genres || {})
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([name, value], index) => ({
        name,
        value,
        color: ["#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"][index % 6],
      }));

    const ratingData = [5, 4, 3, 2, 1].map((rating) => ({
      rating: `${rating}★`,
      count: doc.ratings?.[String(rating)] || 0,
    }));

    res.json({
      readingTrends: monthlySeries,
      genreData,
      monthlyData: monthlySeries,
      ratingData,
      stats: {
        totalBooksThisYear,
        averageBooksPerMonth: Math.round(averageBooksPerMonth * 10) / 10,
        totalPagesRead,
        averageRating: Math.round(averageRating * 10) / 10,
        readingTime: Math.round(doc.stats.totalReadingMinutes / 60),
        favoriteGenre: getFavoriteGenre(doc.genres),
        longestStreak: doc.stats.longestStreak,
        currentStreak: doc.stats.currentStreak,
      },
    });
  } catch (error) {
    console.error("Failed to load reading analytics:", error);
    res.status(500).json({ error: "Failed to load reading analytics" });
  }
});

router.get("/dashboard/reading-goals", async (req, res) => {
  try {
    const { analytics } = await getCollections();
    const doc = await analytics.findOne({ userId: req.userId });
    if (!doc) {
      return res.json({
        goals: [],
        chartData: [],
        completionRate: 0,
      });
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const monthlySeries = getMonthlySeries(doc.monthly);
    const booksThisYear = monthlySeries.reduce((sum, m) => sum + m.books, 0);
    const pagesThisMonth = monthlySeries[monthlySeries.length - 1]?.pages || 0;
    const hoursThisMonth = monthlySeries[monthlySeries.length - 1]?.hours || 0;

    const averageRating = doc.stats.ratingCount > 0
      ? doc.stats.totalRating / doc.stats.ratingCount
      : 0;

    const goals = [
      {
        id: "1",
        title: "Books This Year",
        description: "Annual reading goal",
        current: booksThisYear,
        target: doc.goals.yearlyGoal,
        unit: "books",
        deadline: `Dec 31, ${currentYear}`,
        category: "books",
        isCompleted: booksThisYear >= doc.goals.yearlyGoal,
      },
      {
        id: "2",
        title: "Pages This Month",
        description: "Monthly page target",
        current: pagesThisMonth,
        target: doc.goals.monthlyPagesGoal,
        unit: "pages",
        deadline: `${now.toLocaleString("default", { month: "long" })} ${daysInMonth}, ${currentYear}`,
        category: "pages",
        isCompleted: pagesThisMonth >= doc.goals.monthlyPagesGoal,
      },
      {
        id: "3",
        title: "Reading Time",
        description: "Hours spent reading this month",
        current: hoursThisMonth,
        target: doc.goals.monthlyHoursGoal,
        unit: "hours",
        deadline: `${now.toLocaleString("default", { month: "long" })} ${daysInMonth}, ${currentYear}`,
        category: "time",
        isCompleted: hoursThisMonth >= doc.goals.monthlyHoursGoal,
      },
      {
        id: "4",
        title: "Average Rating",
        description: "Maintain high quality reads",
        current: Math.round(averageRating * 10) / 10,
        target: doc.goals.targetRating,
        unit: "stars",
        category: "rating",
        isCompleted: averageRating >= doc.goals.targetRating,
      },
    ];

    const chartData = goals.map((goal) => ({
      goal: goal.title,
      current: goal.current,
      target: goal.target,
      unit: goal.unit,
    }));

    const completedGoals = goals.filter((goal) => goal.isCompleted).length;
    const completionRate = goals.length ? Math.round((completedGoals / goals.length) * 100) : 0;

    res.json({ goals, chartData, completionRate });
  } catch (error) {
    console.error("Failed to load reading goals:", error);
    res.status(500).json({ error: "Failed to load reading goals" });
  }
});

router.get("/dashboard/activity", async (req, res) => {
  try {
    const { analytics } = await getCollections();
    const doc = await analytics.findOne({ userId: req.userId });
    res.json({ activity: doc?.activity || [] });
  } catch (error) {
    console.error("Failed to load activity timeline:", error);
    res.status(500).json({ error: "Failed to load activity timeline" });
  }
});

export default router;

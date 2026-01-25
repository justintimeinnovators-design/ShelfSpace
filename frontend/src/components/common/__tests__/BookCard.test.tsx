import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookCard } from "../BookCard";
import { createMockBook } from "../../../test-utils/mock-data";

describe("BookCard", () => {
  const mockBook = createMockBook({
    title: "Test Book",
    author: "Test Author",
    rating: 4.5,
    readingProgress: 75,
    status: "reading",
  });

  it("renders book information correctly", () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByText("Test Book")).toBeInTheDocument();
    expect(screen.getByText("Test Author")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  it("displays reading progress for books in progress", () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("handles different book statuses", () => {
    const completedBook = createMockBook({
      status: "completed",
      readingProgress: 100,
    });
    const { rerender } = render(<BookCard book={completedBook} />);

    expect(screen.getByText("Completed")).toBeInTheDocument();

    const wantToReadBook = createMockBook({
      status: "want-to-read",
      readingProgress: 0,
    });
    rerender(<BookCard book={wantToReadBook} />);

    expect(screen.getByText("Want to Read")).toBeInTheDocument();
  });

  it("renders in different variants", () => {
    const { rerender } = render(<BookCard book={mockBook} variant="compact" />);

    let card = screen.getByTestId("book-card");
    expect(card).toHaveClass("compact");

    rerender(<BookCard book={mockBook} variant="detailed" />);
    card = screen.getByTestId("book-card");
    expect(card).toHaveClass("detailed");
  });

  it("handles action callbacks", async () => {
    const mockActions = {
      onView: jest.fn(),
      onEdit: jest.fn(),
      onRemove: jest.fn(),
    };
    const user = userEvent.setup();

    render(<BookCard book={mockBook} actions={mockActions} />);

    await user.click(screen.getByLabelText("View book"));
    expect(mockActions.onView).toHaveBeenCalledWith(mockBook);

    await user.click(screen.getByLabelText("Edit book"));
    expect(mockActions.onEdit).toHaveBeenCalledWith(mockBook);

    await user.click(screen.getByLabelText("Remove book"));
    expect(mockActions.onRemove).toHaveBeenCalledWith(mockBook);
  });

  it("is accessible", () => {
    render(<BookCard book={mockBook} />);

    const card = screen.getByRole("article");
    expect(card).toHaveAttribute(
      "aria-label",
      expect.stringContaining("Test Book")
    );

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", "Test Book cover");
  });

  it("supports keyboard navigation", async () => {
    const mockActions = { onView: jest.fn() };
    const user = userEvent.setup();

    render(<BookCard book={mockBook} actions={mockActions} />);

    const card = screen.getByRole("article");
    card.focus();

    await user.keyboard("{Enter}");
    expect(mockActions.onView).toHaveBeenCalledWith(mockBook);
  });

  it("handles missing book cover gracefully", () => {
    const bookWithoutCover = createMockBook({ cover: "" });
    render(<BookCard book={bookWithoutCover} />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining("placeholder")
    );
  });

  it("displays genre and tags when available", () => {
    const bookWithMetadata = createMockBook({
      genre: "Science Fiction",
      tags: ["space", "adventure"],
    });

    render(<BookCard book={bookWithMetadata} variant="detailed" />);

    expect(screen.getByText("Science Fiction")).toBeInTheDocument();
    expect(screen.getByText("space")).toBeInTheDocument();
    expect(screen.getByText("adventure")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardContent, CardFooter } from "../Card";

describe("Card Components", () => {
  describe("Card", () => {
    it("renders with default props", () => {
      render(<Card>Card content</Card>);

      const card = screen.getByText("Card content");
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass("bg-white", "border", "rounded-lg", "shadow-sm");
    });

    it("applies custom className", () => {
      render(<Card className="custom-class">Content</Card>);

      expect(screen.getByText("Content")).toHaveClass("custom-class");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Content</Card>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("CardHeader", () => {
    it("renders with proper styling", () => {
      render(<CardHeader>Header content</CardHeader>);

      const header = screen.getByText("Header content");
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass("p-6", "pb-0");
    });
  });

  describe("CardContent", () => {
    it("renders with proper styling", () => {
      render(<CardContent>Main content</CardContent>);

      const content = screen.getByText("Main content");
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass("p-6");
    });
  });

  describe("CardFooter", () => {
    it("renders with proper styling", () => {
      render(<CardFooter>Footer content</CardFooter>);

      const footer = screen.getByText("Footer content");
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass("p-6", "pt-0");
    });
  });

  describe("Card Composition", () => {
    it("renders complete card structure", () => {
      render(
        <Card>
          <CardHeader>
            <h2>Card Title</h2>
          </CardHeader>
          <CardContent>
            <p>Card description</p>
          </CardContent>
          <CardFooter>
            <button>Action</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText("Card Title")).toBeInTheDocument();
      expect(screen.getByText("Card description")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /action/i })
      ).toBeInTheDocument();
    });

    it("maintains proper semantic structure", () => {
      render(
        <Card>
          <CardHeader>
            <h2>Title</h2>
          </CardHeader>
          <CardContent>
            <p>Content</p>
          </CardContent>
        </Card>
      );

      const title = screen.getByRole("heading", { level: 2 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent("Title");
    });
  });
});

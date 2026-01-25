import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navigation from "../Navigation";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

describe("Navigation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders navigation items", () => {
    render(<Navigation />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Library")).toBeInTheDocument();
    expect(screen.getByText("Chat")).toBeInTheDocument();
    expect(screen.getByText("Discover")).toBeInTheDocument();
    expect(screen.getByText("Groups")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders ShelfSpace brand", () => {
    render(<Navigation />);

    expect(screen.getByText("ShelfSpace")).toBeInTheDocument();
  });

  it("shows badge for Library item", () => {
    render(<Navigation />);

    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("shows badge for Groups item", () => {
    render(<Navigation />);

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("calls onSignOut when sign out button is clicked", () => {
    const mockSignOut = jest.fn();
    render(<Navigation onSignOut={mockSignOut} />);

    const signOutButton = screen.getByText("Sign Out");
    fireEvent.click(signOutButton);

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it("has proper accessibility attributes", () => {
    render(<Navigation />);

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Main navigation");

    const menu = screen.getByRole("menu");
    expect(menu).toHaveAttribute("aria-label", "Navigation menu");
  });
});

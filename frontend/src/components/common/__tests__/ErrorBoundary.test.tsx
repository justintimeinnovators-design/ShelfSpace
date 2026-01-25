import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBoundary } from "../ErrorBoundary";

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

// Mock error fallback component
const MockErrorFallback = ({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) => (
  <div>
    <h2>Something went wrong</h2>
    <p>{error.message}</p>
    <button onClick={retry}>Try again</button>
  </div>
);

describe("ErrorBoundary", () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary fallback={MockErrorFallback}>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText("No error")).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });

  it("renders error fallback when child component throws", () => {
    render(
      <ErrorBoundary fallback={MockErrorFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();
    expect(screen.queryByText("No error")).not.toBeInTheDocument();
  });

  it("calls onError callback when error occurs", () => {
    const onError = jest.fn();

    render(
      <ErrorBoundary fallback={MockErrorFallback} onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it("allows retry functionality", async () => {
    const user = userEvent.setup();
    let shouldThrow = true;

    const RetryableComponent = () => {
      if (shouldThrow) {
        throw new Error("Retryable error");
      }
      return <div>Success after retry</div>;
    };

    render(
      <ErrorBoundary fallback={MockErrorFallback}>
        <RetryableComponent />
      </ErrorBoundary>
    );

    // Error state
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    // Fix the error condition
    shouldThrow = false;

    // Click retry
    await user.click(screen.getByText("Try again"));

    // Should show success
    expect(screen.getByText("Success after retry")).toBeInTheDocument();
  });

  it("resets error state when children change", () => {
    const { rerender } = render(
      <ErrorBoundary fallback={MockErrorFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Error state
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    // Change children
    rerender(
      <ErrorBoundary fallback={MockErrorFallback}>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Should reset and show no error
    expect(screen.getByText("No error")).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });

  it("handles multiple error boundaries", () => {
    const InnerErrorFallback = ({ error }: { error: Error }) => (
      <div>Inner error: {error.message}</div>
    );

    const OuterErrorFallback = ({ error }: { error: Error }) => (
      <div>Outer error: {error.message}</div>
    );

    render(
      <ErrorBoundary fallback={OuterErrorFallback}>
        <div>Outer content</div>
        <ErrorBoundary fallback={InnerErrorFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </ErrorBoundary>
    );

    // Inner error boundary should catch the error
    expect(screen.getByText("Inner error: Test error")).toBeInTheDocument();
    expect(screen.getByText("Outer content")).toBeInTheDocument();
    expect(screen.queryByText("Outer error")).not.toBeInTheDocument();
  });
});

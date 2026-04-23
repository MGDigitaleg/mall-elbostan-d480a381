import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LazyErrorBoundary } from "@/components/LazyErrorBoundary";

function ThrowChunkError(): React.ReactNode {
  throw new Error("Failed to fetch dynamically imported module: /chunk.js");
}

function ThrowGenericError(): React.ReactNode {
  throw new Error("Something went wrong");
}

describe("LazyErrorBoundary", () => {
  // Suppress expected error boundary console.error noise
  const original = console.error;
  beforeAll(() => { console.error = () => {}; });
  afterAll(() => { console.error = original; });

  it("renders children when no error occurs", () => {
    render(
      <LazyErrorBoundary>
        <p>Hello</p>
      </LazyErrorBoundary>,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("shows chunk-error message for dynamic import failures", () => {
    render(
      <LazyErrorBoundary>
        <ThrowChunkError />
      </LazyErrorBoundary>,
    );
    expect(screen.getByText("تعذّر تحميل الصفحة")).toBeInTheDocument();
    expect(screen.getByText("إعادة تحميل الصفحة")).toBeInTheDocument();
  });

  it("shows generic error message for non-chunk errors", () => {
    render(
      <LazyErrorBoundary>
        <ThrowGenericError />
      </LazyErrorBoundary>,
    );
    expect(screen.getByText("حدث خطأ غير متوقع")).toBeInTheDocument();
  });
});

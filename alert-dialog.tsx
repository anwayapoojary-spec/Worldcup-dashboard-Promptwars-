import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GlassCard, CardHeader } from "./glass-card";

describe("GlassCard", () => {
  it("renders children and merges className", () => {
    render(
      <GlassCard className="extra-class" data-testid="card">
        <p>content</p>
      </GlassCard>,
    );
    const el = screen.getByTestId("card");
    expect(el).toBeInTheDocument();
    expect(el.className).toContain("extra-class");
    expect(el.className).toContain("rounded-xl");
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});

describe("CardHeader", () => {
  it("renders title, description, and action slot", () => {
    render(
      <CardHeader
        title="Live crowd"
        description="Updated moments ago"
        action={<button type="button">Refresh</button>}
      />,
    );
    expect(screen.getByText("Live crowd")).toBeInTheDocument();
    expect(screen.getByText("Updated moments ago")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Refresh" })).toBeInTheDocument();
  });

  it("omits the description when not provided", () => {
    render(<CardHeader title="Title only" />);
    expect(screen.getByText("Title only")).toBeInTheDocument();
    expect(screen.queryByText("Updated moments ago")).not.toBeInTheDocument();
  });
});

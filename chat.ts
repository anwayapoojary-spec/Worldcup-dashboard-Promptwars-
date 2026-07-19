import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges conditional classes", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });
  it("deduplicates conflicting tailwind classes with tailwind-merge", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
  it("handles nullish inputs", () => {
    expect(cn(undefined, null, "x")).toBe("x");
  });
});

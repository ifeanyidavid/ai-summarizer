import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

// Import test environment variables
import "./env";

// Add custom matchers
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "vitest" {
  interface Assertion<T = any>
    extends TestingLibraryMatchers<typeof expect.stringContaining, T> {}
}

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

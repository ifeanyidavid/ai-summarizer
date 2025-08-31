import { vi } from "vitest";

const mockPrisma = {
  snippet: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
  },
};

export default mockPrisma;

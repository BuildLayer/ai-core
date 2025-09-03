import { vi } from "vitest";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock fetch
global.fetch = vi.fn();

// Mock AbortController
global.AbortController = vi.fn().mockImplementation(() => ({
  abort: vi.fn(),
  signal: {
    aborted: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  },
}));

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock nanoid
let mockIdCounter = 0;
vi.mock("nanoid", () => ({
  nanoid: vi.fn(() => `mock-id-${++mockIdCounter}`),
}));

// Mock TetherAI providers
vi.mock("@tetherai/openai", () => ({
  openAI: vi.fn(() => ({
    chat: vi.fn(),
    models: vi.fn(),
  })),
}));

vi.mock("@tetherai/anthropic", () => ({
  anthropic: vi.fn(() => ({
    chat: vi.fn(),
    models: vi.fn(),
  })),
}));

vi.mock("@tetherai/mistral", () => ({
  mistral: vi.fn(() => ({
    chat: vi.fn(),
    models: vi.fn(),
  })),
}));

vi.mock("@tetherai/grok", () => ({
  grok: vi.fn(() => ({
    chat: vi.fn(),
    models: vi.fn(),
  })),
}));

vi.mock("@tetherai/local", () => ({
  localLLM: vi.fn(() => ({
    chat: vi.fn(),
    models: vi.fn(),
  })),
}));

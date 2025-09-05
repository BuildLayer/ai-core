import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  AIProviderManager,
  providerManager,
  createProviderAdapter,
  validateProviderConfig,
  getAvailableProviders,
  getAvailableModels,
} from "../provider-manager";
import type { ProviderConfig } from "../types";

// Mock the adapter functions
vi.mock("../adapters", () => ({
  createOpenAIAdapter: vi.fn().mockReturnValue({
    chat: vi.fn(),
    models: vi.fn().mockResolvedValue([
      {
        id: "gpt-4",
        name: "GPT-4",
        provider: "openai",
        contextLength: 8192,
        supportsTools: true,
      },
    ]),
  }),
  createAnthropicAdapter: vi.fn().mockReturnValue({
    chat: vi.fn(),
    models: vi.fn().mockResolvedValue([
      {
        id: "claude-3-sonnet",
        name: "Claude 3 Sonnet",
        provider: "anthropic",
        contextLength: 200000,
        supportsTools: true,
      },
    ]),
  }),
  createMistralAdapter: vi.fn().mockReturnValue({
    chat: vi.fn(),
    models: vi.fn().mockResolvedValue([
      {
        id: "mistral-large",
        name: "Mistral Large",
        provider: "mistral",
        contextLength: 32000,
        supportsTools: false,
      },
    ]),
  }),
  createGrokAdapter: vi.fn().mockReturnValue({
    chat: vi.fn(),
    models: vi.fn().mockResolvedValue([
      {
        id: "grok-beta",
        name: "Grok Beta",
        provider: "grok",
        contextLength: 8192,
        supportsTools: false,
      },
    ]),
  }),
  createLocalLLMAdapter: vi.fn().mockReturnValue({
    chat: vi.fn(),
    models: vi.fn().mockResolvedValue([
      {
        id: "llama2",
        name: "Llama 2",
        provider: "local",
        contextLength: 4096,
        supportsTools: false,
      },
    ]),
  }),
}));

describe("AIProviderManager", () => {
  let manager: AIProviderManager;

  beforeEach(() => {
    manager = AIProviderManager.getInstance();
    vi.clearAllMocks();
  });

  describe("getAvailableProviders", () => {
    it("should return all available providers", () => {
      const providers = manager.getAvailableProviders();
      expect(providers).toEqual([
        "openai",
        "anthropic",
        "mistral",
        "grok",
        "local",
      ]);
    });
  });

  describe("getAvailableModels", () => {
    it("should return models for a provider", async () => {
      const models = await manager.getAvailableModels("openai");
      expect(models).toHaveLength(1);
      expect(models[0].id).toBe("gpt-4");
    });

    it("should return default models when provider fails", async () => {
      // Mock the adapter to throw an error
      const { createOpenAIAdapter } = await import("../adapters");
      vi.mocked(createOpenAIAdapter).mockImplementationOnce(() => {
        throw new Error("API key required");
      });

      const models = await manager.getAvailableModels("openai");
      expect(models).toHaveLength(3); // Default models
      expect(models[0].provider).toBe("openai");
    });
  });

  describe("validateConfig", () => {
    it("should validate a correct configuration", () => {
      const config: ProviderConfig = {
        provider: "openai",
        apiKey: "test-key",
        model: "gpt-4",
      };

      const result = manager.validateConfig(config);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject configuration without provider", () => {
      const config = {} as ProviderConfig;
      const result = manager.validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Provider is required");
    });

    it("should reject invalid provider", () => {
      const config: ProviderConfig = {
        provider: "invalid" as any,
        apiKey: "test-key",
        model: "test-model",
      };

      const result = manager.validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Invalid provider: invalid");
    });

    it("should reject configuration without API key", () => {
      const config: ProviderConfig = {
        provider: "openai",
        model: "gpt-4",
        apiKey: "",
      };

      const result = manager.validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("API key is required for openai");
    });

    it("should require API key and model for all providers", () => {
      const config: ProviderConfig = {
        provider: "local",
        baseURL: "http://localhost:11434/v1",
        // Missing API key and model
      } as any;

      const result = manager.validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("API key is required for local");
      expect(result.errors).toContain("Model is required for local");
    });

    it("should validate baseURL for local provider", () => {
      const config: ProviderConfig = {
        provider: "local",
        baseURL: "invalid-url",
        apiKey: "test-key",
        model: "llama2",
      };

      const result = manager.validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Invalid baseURL for local LLM");
    });

    it("should reject empty model", () => {
      const config: ProviderConfig = {
        provider: "openai",
        apiKey: "test-key",
        model: "",
      };

      const result = manager.validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Model cannot be empty");
    });
  });

  describe("createAdapter", () => {
    it("should create adapter for valid configuration", () => {
      const config: ProviderConfig = {
        provider: "openai",
        apiKey: "test-key",
        model: "gpt-4",
      };

      const adapter = manager.createAdapter(config);
      expect(adapter).toBeDefined();
      expect(adapter.chat).toBeDefined();
    });

    it("should throw error for invalid configuration", () => {
      const config: ProviderConfig = {
        provider: "openai",
        apiKey: "", // Empty API key
        model: "gpt-4",
      };

      expect(() => manager.createAdapter(config)).toThrow(
        "Invalid configuration"
      );
    });

    it("should throw error for unsupported provider", () => {
      const config = {
        provider: "unsupported",
        apiKey: "test-key",
        model: "test-model",
      } as unknown as ProviderConfig;

      expect(() => manager.createAdapter(config)).toThrow(
        "Unsupported provider"
      );
    });
  });
});

describe("Convenience functions", () => {
  describe("createProviderAdapter", () => {
    it("should create adapter using provider manager", () => {
      const config: ProviderConfig = {
        provider: "openai",
        apiKey: "test-key",
        model: "gpt-4",
      };

      const adapter = createProviderAdapter(config);
      expect(adapter).toBeDefined();
    });
  });

  describe("validateProviderConfig", () => {
    it("should validate configuration", () => {
      const config: ProviderConfig = {
        provider: "openai",
        apiKey: "test-key",
        model: "gpt-4",
      };

      const result = validateProviderConfig(config);
      expect(result.valid).toBe(true);
    });
  });

  describe("getAvailableProviders", () => {
    it("should return available providers", () => {
      const providers = getAvailableProviders();
      expect(providers).toEqual([
        "openai",
        "anthropic",
        "mistral",
        "grok",
        "local",
      ]);
    });
  });

  describe("getAvailableModels", () => {
    it("should return models for provider", async () => {
      const models = await getAvailableModels("openai");
      expect(models).toHaveLength(1);
      expect(models[0].id).toBe("gpt-4");
    });
  });
});

describe("Singleton pattern", () => {
  it("should return the same instance", () => {
    const instance1 = AIProviderManager.getInstance();
    const instance2 = AIProviderManager.getInstance();
    expect(instance1).toBe(instance2);
  });

  it("should use the singleton instance for convenience functions", () => {
    const manager = AIProviderManager.getInstance();
    const providers = getAvailableProviders();
    expect(providers).toEqual(manager.getAvailableProviders());
  });
});

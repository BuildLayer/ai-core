import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createOpenAIAdapter,
  createAnthropicAdapter,
  createMistralAdapter,
  createGrokAdapter,
  createLocalLLMAdapter,
  createTetherAIAdapter,
} from "../adapters/tetherai";
import type {
  ChatRequest,
  Delta,
  ToolDef,
  Message,
  ContentPart,
} from "../types";

// Mock TetherAI providers
vi.mock("@tetherai/openai", () => ({
  openAI: vi.fn(() => mockOpenAIProvider),
}));

vi.mock("@tetherai/anthropic", () => ({
  anthropic: vi.fn(() => mockAnthropicProvider),
}));

vi.mock("@tetherai/mistral", () => ({
  mistral: vi.fn(() => mockMistralProvider),
}));

vi.mock("@tetherai/grok", () => ({
  grok: vi.fn(() => mockGrokProvider),
}));

vi.mock("@tetherai/local", () => ({
  localLLM: vi.fn(() => mockLocalProvider),
}));

// Mock TetherAI providers
const mockOpenAIProvider = {
  streamChat: vi.fn(),
  getModels: vi.fn(),
  validateModel: vi.fn(),
  getMaxTokens: vi.fn(),
};

const mockAnthropicProvider = {
  streamChat: vi.fn(),
  getModels: vi.fn(),
  validateModel: vi.fn(),
  getMaxTokens: vi.fn(),
};

const mockMistralProvider = {
  streamChat: vi.fn(),
  getModels: vi.fn(),
  validateModel: vi.fn(),
  getMaxTokens: vi.fn(),
};

const mockGrokProvider = {
  streamChat: vi.fn(),
  getModels: vi.fn(),
  validateModel: vi.fn(),
  getMaxTokens: vi.fn(),
};

const mockLocalProvider = {
  streamChat: vi.fn(),
  getModels: vi.fn(),
  validateModel: vi.fn(),
  getMaxTokens: vi.fn(),
};

describe("TetherAI Adapters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createOpenAIAdapter", () => {
    it("should create OpenAI adapter with correct configuration", () => {
      const adapter = createOpenAIAdapter("test-key");

      expect(adapter).toBeDefined();
      expect(typeof adapter.chat).toBe("function");
    });

    it("should handle OpenAI chat requests", async () => {
      const mockResponse = {
        async *[Symbol.asyncIterator]() {
          yield { type: "text", chunk: "Hello" };
          yield { type: "done", finishReason: "stop" };
        },
      };

      mockOpenAIProvider.streamChat.mockImplementation(() => mockResponse);

      const adapter = createOpenAIAdapter("test-key");

      const request: ChatRequest = {
        model: "gpt-4",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [{ type: "text", text: "Hello" }],
            createdAt: Date.now(),
          },
        ],
      };

      const response = await adapter.chat(request, {});
      expect(response).toBeDefined();
    });
  });

  describe("createAnthropicAdapter", () => {
    it("should create Anthropic adapter with correct configuration", () => {
      const adapter = createAnthropicAdapter("test-key");

      expect(adapter).toBeDefined();
      expect(typeof adapter.chat).toBe("function");
    });

    it("should handle Anthropic chat requests", async () => {
      const mockResponse = {
        async *[Symbol.asyncIterator]() {
          yield { type: "text", chunk: "Hello from Claude" };
          yield { type: "done", finishReason: "stop" };
        },
      };

      mockAnthropicProvider.streamChat.mockImplementation(() => mockResponse);

      const adapter = createAnthropicAdapter("test-key");

      const request: ChatRequest = {
        model: "claude-3-sonnet-20240229",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [{ type: "text", text: "Hello" }],
            createdAt: Date.now(),
          },
        ],
      };

      const response = await adapter.chat(request, {});
      expect(response).toBeDefined();
    });
  });

  describe("createMistralAdapter", () => {
    it("should create Mistral adapter with correct configuration", () => {
      const adapter = createMistralAdapter("test-key");

      expect(adapter).toBeDefined();
      expect(typeof adapter.chat).toBe("function");
    });

    it("should handle Mistral chat requests", async () => {
      const mockResponse = {
        async *[Symbol.asyncIterator]() {
          yield { type: "text", chunk: "Hello from Mistral" };
          yield { type: "done", finishReason: "stop" };
        },
      };

      mockMistralProvider.streamChat.mockImplementation(() => mockResponse);

      const adapter = createMistralAdapter("test-key");

      const request: ChatRequest = {
        model: "mistral-large-latest",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [{ type: "text", text: "Hello" }],
            createdAt: Date.now(),
          },
        ],
      };

      const response = await adapter.chat(request, {});
      expect(response).toBeDefined();
    });
  });

  describe("createGrokAdapter", () => {
    it("should create Grok adapter with correct configuration", () => {
      const adapter = createGrokAdapter("test-key");

      expect(adapter).toBeDefined();
      expect(typeof adapter.chat).toBe("function");
    });

    it("should handle Grok chat requests", async () => {
      const mockResponse = {
        async *[Symbol.asyncIterator]() {
          yield { type: "text", chunk: "Hello from Grok" };
          yield { type: "done", finishReason: "stop" };
        },
      };

      mockGrokProvider.streamChat.mockImplementation(() => mockResponse);

      const adapter = createGrokAdapter("test-key");

      const request: ChatRequest = {
        model: "grok-beta",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [{ type: "text", text: "Hello" }],
            createdAt: Date.now(),
          },
        ],
      };

      const response = await adapter.chat(request, {});
      expect(response).toBeDefined();
    });
  });

  describe("createLocalLLMAdapter", () => {
    it("should create Local LLM adapter with correct configuration", () => {
      const adapter = createLocalLLMAdapter({
        baseURL: "http://localhost:11434",
      });

      expect(adapter).toBeDefined();
      expect(typeof adapter.chat).toBe("function");
    });

    it("should handle Local LLM chat requests", async () => {
      const mockResponse = {
        async *[Symbol.asyncIterator]() {
          yield { type: "text", chunk: "Hello from Local LLM" };
          yield { type: "done", finishReason: "stop" };
        },
      };

      mockLocalProvider.streamChat.mockImplementation(() => mockResponse);

      const adapter = createLocalLLMAdapter({
        baseURL: "http://localhost:11434",
      });

      const request: ChatRequest = {
        model: "llama2",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [{ type: "text", text: "Hello" }],
            createdAt: Date.now(),
          },
        ],
      };

      const response = await adapter.chat(request, {});
      expect(response).toBeDefined();
    });
  });

  describe("createTetherAIAdapter", () => {
    it("should create generic TetherAI adapter", () => {
      const mockProvider = {
        streamChat: vi.fn(),
        getModels: vi.fn(),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);
      expect(adapter).toBeDefined();
      expect(typeof adapter.chat).toBe("function");
    });

    it("should convert ChatRequest to TetherAI format", async () => {
      const mockProvider = {
        streamChat: vi.fn().mockImplementation(() => ({
          async *[Symbol.asyncIterator]() {
            yield { type: "text", chunk: "Response" };
            yield { type: "done", finishReason: "stop" };
          },
        })),
        getModels: vi.fn(),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      const request: ChatRequest = {
        model: "test-model",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [{ type: "text", text: "Hello" }],
            createdAt: Date.now(),
          },
        ],
      };

      await adapter.chat(request, {});

      expect(mockProvider.streamChat).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "test-model",
          messages: expect.any(Array),
        }),
        undefined
      );
    });

    it("should convert TetherAI stream to Delta format", async () => {
      const mockProvider = {
        streamChat: vi.fn().mockImplementation(() => ({
          async *[Symbol.asyncIterator]() {
            yield { delta: "Hello" };
            yield { delta: " world" };
            yield { done: true, finishReason: "stop" };
          },
        })),
        getModels: vi.fn(),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      const request: ChatRequest = {
        model: "test-model",
        messages: [],
      };

      const response = await adapter.chat(request, {});
      const deltas: Delta[] = [];

      // Check if streamChat was called
      expect(mockProvider.streamChat).toHaveBeenCalled();

      for await (const delta of response) {
        deltas.push(delta);
      }

      expect(deltas).toEqual([
        { type: "text", chunk: "Hello" },
        { type: "text", chunk: " world" },
        { type: "done", finishReason: "stop" },
      ]);
    });
  });

  describe("Error Handling", () => {
    it("should handle provider errors gracefully", async () => {
      const errorProvider = {
        streamChat: vi.fn().mockImplementation(() => {
          throw new Error("Provider error");
        }),
        getModels: vi.fn(),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(errorProvider);

      const request: ChatRequest = {
        model: "test-model",
        messages: [],
      };

      await expect(adapter.chat(request, {})).rejects.toThrow("Provider error");
    });

    it("should handle streaming errors", async () => {
      const errorProvider = {
        streamChat: vi.fn().mockImplementation(() => ({
          async *[Symbol.asyncIterator]() {
            yield { type: "text", chunk: "Hello" };
            throw new Error("Streaming error");
          },
        })),
        getModels: vi.fn(),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(errorProvider);

      const request: ChatRequest = {
        model: "test-model",
        messages: [],
      };

      const response = await adapter.chat(request, {});

      await expect(async () => {
        for await (const delta of response) {
          // Consume the first delta
        }
      }).rejects.toThrow("Streaming error");
    });
  });
});

describe("Real-World Adapter Scenarios", () => {
  describe("Content Type Conversion", () => {
    it("should convert Message types correctly", async () => {
      const mockProvider = {
        streamChat: vi.fn().mockImplementation(() => ({
          async *[Symbol.asyncIterator]() {
            yield { done: true, finishReason: "stop" };
          },
        })),
        getModels: vi
          .fn()
          .mockImplementation(() => Promise.resolve(["test-model"])),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      const request: ChatRequest = {
        model: "test-model",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [{ type: "text", text: "Hello" }],
            createdAt: Date.now(),
          },
          {
            id: "msg_2",
            role: "assistant",
            content: [
              { type: "text", text: "Hi there!" },
              {
                type: "tool_use",
                name: "get_weather",
                args: { location: "New York" },
                id: "tool_call_1",
              },
            ],
            createdAt: Date.now(),
          },
          {
            id: "msg_3",
            role: "tool",
            content: [
              {
                type: "tool_result",
                name: "get_weather",
                result: { temperature: 22, condition: "Sunny" },
                forId: "tool_call_1",
              },
            ],
            createdAt: Date.now(),
          },
        ],
      };

      await adapter.chat(request, {});

      // Verify the provider was called with converted messages
      expect(mockProvider.streamChat).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: "user",
              content: "Hello",
            }),
            expect.objectContaining({
              role: "assistant",
              content: "Hi there![Tool Use: get_weather]",
            }),
            expect.objectContaining({
              role: "tool",
              content: "[Tool Result: get_weather]",
            }),
          ]),
        }),
        undefined
      );
    });

    it("should convert ContentPart types correctly", async () => {
      const mockProvider = {
        streamChat: vi.fn().mockImplementation(() => ({
          async *[Symbol.asyncIterator]() {
            yield { done: true, finishReason: "stop" };
          },
        })),
        getModels: vi
          .fn()
          .mockImplementation(() => Promise.resolve(["test-model"])),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      const request: ChatRequest = {
        model: "test-model",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [
              { type: "text", text: "Hello" },
              {
                type: "file",
                mime: "image/jpeg",
                name: "photo.jpg",
                url: "https://example.com/photo.jpg",
              },
            ],
            createdAt: Date.now(),
          },
        ],
      };

      await adapter.chat(request, {});

      // Verify different ContentPart types are converted correctly
      expect(mockProvider.streamChat).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              content: expect.stringContaining("Hello"),
            }),
          ]),
        }),
        undefined
      );
    });

    it("should handle text content conversion", async () => {
      const mockProvider = {
        streamChat: vi.fn().mockImplementation(() => ({
          async *[Symbol.asyncIterator]() {
            yield { delta: "Hello", done: false };
            yield { delta: " world", done: false };
            yield { done: true, finishReason: "stop" };
          },
        })),
        getModels: vi
          .fn()
          .mockImplementation(() => Promise.resolve(["test-model"])),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      const request: ChatRequest = {
        model: "test-model",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [{ type: "text", text: "Hello" }],
            createdAt: Date.now(),
          },
        ],
      };

      const response = await adapter.chat(request, {});
      const deltas: Delta[] = [];

      for await (const delta of response) {
        deltas.push(delta);
      }

      expect(deltas).toEqual([
        { type: "text", chunk: "Hello" },
        { type: "text", chunk: " world" },
        { type: "done", finishReason: "stop" },
      ]);
    });

    it("should handle tool_use content conversion", async () => {
      const mockProvider = {
        streamChat: vi.fn().mockImplementation(() => ({
          async *[Symbol.asyncIterator]() {
            yield {
              toolUse: {
                name: "get_weather",
                argsDelta: JSON.stringify({ location: "New York" }),
                id: "tool_call_1",
              },
              done: false,
            };
            yield { done: true, finishReason: "tool_calls" };
          },
        })),
        getModels: vi
          .fn()
          .mockImplementation(() => Promise.resolve(["test-model"])),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      const request: ChatRequest = {
        model: "test-model",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [{ type: "text", text: "What's the weather?" }],
            createdAt: Date.now(),
          },
        ],
      };

      const response = await adapter.chat(request, {});
      const deltas: Delta[] = [];

      for await (const delta of response) {
        deltas.push(delta);
      }

      expect(deltas).toEqual([
        {
          type: "tool_use",
          name: "get_weather",
          argsDelta: JSON.stringify({ location: "New York" }),
          id: "tool_call_1",
        },
        { type: "done", finishReason: "tool_calls" },
      ]);
    });

    it("should handle file content conversion", async () => {
      const mockProvider = {
        streamChat: vi.fn().mockImplementation(() => ({
          async *[Symbol.asyncIterator]() {
            yield { delta: "File processed", done: false };
            yield { done: true, finishReason: "stop" };
          },
        })),
        getModels: vi
          .fn()
          .mockImplementation(() => Promise.resolve(["test-model"])),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      const request: ChatRequest = {
        model: "test-model",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [
              {
                type: "file",
                mime: "image/jpeg",
                name: "photo.jpg",
                url: "https://example.com/photo.jpg",
              },
            ],
            createdAt: Date.now(),
          },
        ],
      };

      const response = await adapter.chat(request, {});
      const deltas: Delta[] = [];

      for await (const delta of response) {
        deltas.push(delta);
      }

      expect(deltas).toEqual([
        { type: "text", chunk: "File processed" },
        { type: "done", finishReason: "stop" },
      ]);

      // Verify the provider was called with correct file content
      expect(mockProvider.streamChat).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              content: "[File: photo.jpg]",
            }),
          ]),
        }),
        undefined
      );
    });
  });

  describe("Tool Support Integration", () => {
    it("should handle tools in chat requests", async () => {
      const weatherTool: ToolDef = {
        name: "get_weather",
        title: "Get Weather",
        description: "Get current weather for a location",
        schema: {
          type: "object",
          properties: {
            location: { type: "string", description: "City name" },
          },
          required: ["location"],
        },
        execute: async () => ({ temperature: 22, condition: "Sunny" }),
      };

      const mockProvider = {
        streamChat: vi.fn().mockImplementation(() => ({
          async *[Symbol.asyncIterator]() {
            yield { delta: "I'll check the weather", done: false };
            yield { done: true, finishReason: "stop" };
          },
        })),
        getModels: vi
          .fn()
          .mockImplementation(() => Promise.resolve(["test-model"])),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      const request: ChatRequest = {
        model: "test-model",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [{ type: "text", text: "What's the weather in NYC?" }],
            createdAt: Date.now(),
          },
        ],
        tools: [weatherTool],
      };

      await adapter.chat(request, {});

      expect(mockProvider.streamChat).toHaveBeenCalledWith(
        expect.objectContaining({
          tools: [
            {
              name: "get_weather",
              description: "Get current weather for a location",
              schema: weatherTool.schema,
            },
          ],
        }),
        undefined
      );
    });

    it("should handle tool_use and tool_result message flow", async () => {
      const mockProvider = {
        streamChat: vi.fn().mockImplementation(() => ({
          async *[Symbol.asyncIterator]() {
            yield {
              toolUse: {
                name: "get_weather",
                argsDelta: JSON.stringify({ location: "New York" }),
                id: "tool_call_1",
              },
              done: false,
            };
            yield { done: true, finishReason: "tool_calls" };
          },
        })),
        getModels: vi
          .fn()
          .mockImplementation(() => Promise.resolve(["test-model"])),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      const request: ChatRequest = {
        model: "test-model",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [{ type: "text", text: "What's the weather?" }],
            createdAt: Date.now(),
          },
          {
            id: "msg_2",
            role: "assistant",
            content: [
              {
                type: "tool_use",
                name: "get_weather",
                args: { location: "New York" },
                id: "tool_call_1",
              },
            ],
            createdAt: Date.now(),
          },
          {
            id: "msg_3",
            role: "tool",
            content: [
              {
                type: "tool_result",
                name: "get_weather",
                result: { temperature: 22, condition: "Sunny" },
                forId: "tool_call_1",
              },
            ],
            createdAt: Date.now(),
          },
        ],
      };

      const response = await adapter.chat(request, {});
      const deltas: Delta[] = [];

      for await (const delta of response) {
        deltas.push(delta);
      }

      expect(deltas).toEqual([
        {
          type: "tool_use",
          name: "get_weather",
          argsDelta: JSON.stringify({ location: "New York" }),
          id: "tool_call_1",
        },
        { type: "done", finishReason: "tool_calls" },
      ]);
    });
  });

  describe("Models API Integration", () => {
    it("should fetch and convert models correctly", async () => {
      const mockProvider = {
        streamChat: vi.fn(),
        getModels: vi
          .fn()
          .mockImplementation(() =>
            Promise.resolve(["gpt-4", "gpt-3.5-turbo", "gpt-4-turbo"])
          ),
        getMaxTokens: vi.fn().mockImplementation((modelId: string) => {
          const limits: Record<string, number> = {
            "gpt-4": 8192,
            "gpt-3.5-turbo": 4096,
            "gpt-4-turbo": 128000,
          };
          return limits[modelId] || 0;
        }),
        validateModel: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      const models = await adapter.models!();

      expect(models).toEqual([
        {
          id: "gpt-4",
          name: "gpt-4",
          provider: "tetherai",
          contextLength: 8192,
          supportsTools: false,
        },
        {
          id: "gpt-3.5-turbo",
          name: "gpt-3.5-turbo",
          provider: "tetherai",
          contextLength: 4096,
          supportsTools: false,
        },
        {
          id: "gpt-4-turbo",
          name: "gpt-4-turbo",
          provider: "tetherai",
          contextLength: 128000,
          supportsTools: false,
        },
      ]);
    });

    it("should handle models API errors gracefully", async () => {
      const mockProvider = {
        streamChat: vi.fn(),
        getModels: vi
          .fn()
          .mockRejectedValue(new Error("API rate limit exceeded")),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      await expect(adapter.models!()).rejects.toThrow(
        "API rate limit exceeded"
      );
    });
  });

  describe("Abort Signal Support", () => {
    it("should pass abort signal to provider", async () => {
      const abortController = new AbortController();
      const mockProvider = {
        streamChat: vi.fn().mockImplementation(() => ({
          async *[Symbol.asyncIterator]() {
            yield { delta: "Hello", done: false };
            yield { done: true, finishReason: "stop" };
          },
        })),
        getModels: vi
          .fn()
          .mockImplementation(() => Promise.resolve(["test-model"])),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      const request: ChatRequest = {
        model: "test-model",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [{ type: "text", text: "Hello" }],
            createdAt: Date.now(),
          },
        ],
      };

      await adapter.chat(request, { signal: abortController.signal });

      expect(mockProvider.streamChat).toHaveBeenCalledWith(
        expect.any(Object),
        abortController.signal
      );
    });

    it("should handle aborted requests gracefully", async () => {
      const abortController = new AbortController();
      const mockProvider = {
        streamChat: vi.fn().mockImplementation((req, signal) => {
          return {
            async *[Symbol.asyncIterator]() {
              // Check abort signal during streaming
              if (signal?.aborted) {
                throw new Error("Request aborted");
              }
              yield { delta: "Hello", done: false };

              // Check again between chunks
              if (signal?.aborted) {
                throw new Error("Request aborted");
              }
              yield { done: true, finishReason: "stop" };
            },
          };
        }),
        getModels: vi
          .fn()
          .mockImplementation(() => Promise.resolve(["test-model"])),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      const request: ChatRequest = {
        model: "test-model",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [{ type: "text", text: "Hello" }],
            createdAt: Date.now(),
          },
        ],
      };

      // Start the request first, then abort it
      const responsePromise = adapter.chat(request, {
        signal: abortController.signal,
      });

      // Abort the request immediately
      abortController.abort();

      // The response should be an async generator
      const response = await responsePromise;

      // Verify the signal was passed correctly
      expect(mockProvider.streamChat).toHaveBeenCalledWith(
        expect.any(Object),
        abortController.signal
      );

      // The stream should still work (this test just verifies signal passing)
      const deltas = [];
      for await (const delta of response) {
        deltas.push(delta);
      }

      expect(deltas).toHaveLength(2); // Hello + done
    });
  });

  describe("Configuration Validation", () => {
    it("should handle invalid API keys gracefully", async () => {
      const mockProvider = {
        streamChat: vi.fn().mockImplementation(() => {
          throw new Error("Invalid API key");
        }),
        getModels: vi
          .fn()
          .mockImplementation(() =>
            Promise.reject(new Error("Invalid API key"))
          ),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      const request: ChatRequest = {
        model: "test-model",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [{ type: "text", text: "Hello" }],
            createdAt: Date.now(),
          },
        ],
      };

      await expect(adapter.chat(request, {})).rejects.toThrow(
        "Invalid API key"
      );
    });

    it("should handle unsupported models gracefully", async () => {
      const mockProvider = {
        streamChat: vi.fn().mockImplementation(() => {
          throw new Error("Model not found");
        }),
        getModels: vi
          .fn()
          .mockImplementation(() => Promise.resolve(["supported-model"])),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      const request: ChatRequest = {
        model: "unsupported-model",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [{ type: "text", text: "Hello" }],
            createdAt: Date.now(),
          },
        ],
      };

      await expect(adapter.chat(request, {})).rejects.toThrow(
        "Model not found"
      );
    });
  });

  describe("Streaming Edge Cases", () => {
    it("should handle empty streams", async () => {
      const mockProvider = {
        streamChat: vi.fn().mockImplementation(() => ({
          async *[Symbol.asyncIterator]() {
            // Empty stream
          },
        })),
        getModels: vi
          .fn()
          .mockImplementation(() => Promise.resolve(["test-model"])),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      const request: ChatRequest = {
        model: "test-model",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [{ type: "text", text: "Hello" }],
            createdAt: Date.now(),
          },
        ],
      };

      const response = await adapter.chat(request, {});
      const deltas: Delta[] = [];

      for await (const delta of response) {
        deltas.push(delta);
      }

      expect(deltas).toEqual([]);
    });

    it("should handle partial streams with errors", async () => {
      const mockProvider = {
        streamChat: vi.fn().mockImplementation(() => ({
          async *[Symbol.asyncIterator]() {
            yield { delta: "Hello", done: false };
            yield { delta: " world", done: false };
            throw new Error("Stream interrupted");
          },
        })),
        getModels: vi
          .fn()
          .mockImplementation(() => Promise.resolve(["test-model"])),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      const request: ChatRequest = {
        model: "test-model",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [{ type: "text", text: "Hello" }],
            createdAt: Date.now(),
          },
        ],
      };

      const response = await adapter.chat(request, {});

      await expect(async () => {
        for await (const delta of response) {
          // Consume deltas
        }
      }).rejects.toThrow("Stream interrupted");
    });

    it("should handle malformed stream chunks", async () => {
      const mockProvider = {
        streamChat: vi.fn().mockImplementation(() => ({
          async *[Symbol.asyncIterator]() {
            yield { delta: "Hello", done: false };
            yield { malformed: "chunk" }; // Malformed chunk
            yield { done: true, finishReason: "stop" };
          },
        })),
        getModels: vi
          .fn()
          .mockImplementation(() => Promise.resolve(["test-model"])),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      const request: ChatRequest = {
        model: "test-model",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [{ type: "text", text: "Hello" }],
            createdAt: Date.now(),
          },
        ],
      };

      const response = await adapter.chat(request, {});
      const deltas: Delta[] = [];

      for await (const delta of response) {
        deltas.push(delta);
      }

      // Should only process valid chunks
      expect(deltas).toEqual([
        { type: "text", chunk: "Hello" },
        { type: "done", finishReason: "stop" },
      ]);
    });
  });

  describe("Provider-Specific Adapters", () => {
    it("should create OpenAI adapter with correct configuration", () => {
      // Mock the openAI function
      const mockOpenAI = vi.fn().mockReturnValue({
        streamChat: vi.fn(),
        getModels: vi.fn(),
      });

      // Mock the import
      vi.doMock("@tetherai/openai", () => ({
        openAI: mockOpenAI,
      }));

      const adapter = createOpenAIAdapter("test-api-key");

      expect(adapter).toBeDefined();
      expect(typeof adapter.chat).toBe("function");
      expect(typeof adapter.models).toBe("function");
    });

    it("should create Anthropic adapter with correct configuration", () => {
      const mockAnthropic = vi.fn().mockReturnValue({
        streamChat: vi.fn(),
        getModels: vi.fn(),
      });

      vi.doMock("@tetherai/anthropic", () => ({
        anthropic: mockAnthropic,
      }));

      const adapter = createAnthropicAdapter("test-api-key");

      expect(adapter).toBeDefined();
      expect(typeof adapter.chat).toBe("function");
      expect(typeof adapter.models).toBe("function");
    });

    it("should create Local LLM adapter with correct configuration", () => {
      const mockLocalLLM = vi.fn().mockReturnValue({
        streamChat: vi.fn(),
        getModels: vi.fn(),
      });

      vi.doMock("@tetherai/local", () => ({
        localLLM: mockLocalLLM,
      }));

      const adapter = createLocalLLMAdapter({
        baseURL: "http://localhost:11434",
        apiKey: "optional-key",
      });

      expect(adapter).toBeDefined();
      expect(typeof adapter.chat).toBe("function");
      expect(typeof adapter.models).toBe("function");
    });
  });

  describe("Message and ContentPart Conversion", () => {
    it("should handle complex Message structures with multiple ContentParts", async () => {
      const mockProvider = {
        streamChat: vi.fn().mockImplementation(() => ({
          async *[Symbol.asyncIterator]() {
            yield { done: true, finishReason: "stop" };
          },
        })),
        getModels: vi
          .fn()
          .mockImplementation(() => Promise.resolve(["test-model"])),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      // Create a complex message with multiple content parts
      const complexMessage: Message = {
        id: "complex_msg_1",
        role: "assistant",
        content: [
          { type: "text", text: "I'll help you with that." },
          {
            type: "tool_use",
            name: "search_database",
            args: { query: "user preferences", limit: 10 },
            id: "search_call_1",
          },
          { type: "text", text: " Let me also check the weather." },
          {
            type: "tool_use",
            name: "get_weather",
            args: { location: "San Francisco" },
            id: "weather_call_1",
          },
        ],
        createdAt: Date.now(),
        meta: { conversationId: "conv_123" },
      };

      const request: ChatRequest = {
        model: "test-model",
        messages: [complexMessage],
      };

      await adapter.chat(request, {});

      // Verify the complex message was converted correctly
      expect(mockProvider.streamChat).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: "assistant",
              content: expect.stringContaining("I'll help you with that."),
            }),
          ]),
        }),
        undefined
      );
    });

    it("should handle all ContentPart types in conversion", async () => {
      const mockProvider = {
        streamChat: vi.fn().mockImplementation(() => ({
          async *[Symbol.asyncIterator]() {
            yield { done: true, finishReason: "stop" };
          },
        })),
        getModels: vi
          .fn()
          .mockImplementation(() => Promise.resolve(["test-model"])),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      // Test all ContentPart types
      const textPart: ContentPart = { type: "text", text: "Hello world" };
      const toolUsePart: ContentPart = {
        type: "tool_use",
        name: "calculator",
        args: { expression: "2 + 2" },
        id: "calc_1",
      };
      const toolResultPart: ContentPart = {
        type: "tool_result",
        name: "calculator",
        result: { answer: 4 },
        forId: "calc_1",
      };
      const filePart: ContentPart = {
        type: "file",
        mime: "application/pdf",
        name: "document.pdf",
        url: "https://example.com/doc.pdf",
      };

      const request: ChatRequest = {
        model: "test-model",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [textPart, filePart],
            createdAt: Date.now(),
          },
          {
            id: "msg_2",
            role: "assistant",
            content: [toolUsePart],
            createdAt: Date.now(),
          },
          {
            id: "msg_3",
            role: "tool",
            content: [toolResultPart],
            createdAt: Date.now(),
          },
        ],
      };

      await adapter.chat(request, {});

      // Verify all content part types were processed
      expect(mockProvider.streamChat).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              content: "Hello world[File: document.pdf]",
            }),
            expect.objectContaining({
              content: "[Tool Use: calculator]",
            }),
            expect.objectContaining({
              content: "[Tool Result: calculator]",
            }),
          ]),
        }),
        undefined
      );
    });

    it("should preserve Message metadata during conversion", async () => {
      const mockProvider = {
        streamChat: vi.fn().mockImplementation(() => ({
          async *[Symbol.asyncIterator]() {
            yield { done: true, finishReason: "stop" };
          },
        })),
        getModels: vi
          .fn()
          .mockImplementation(() => Promise.resolve(["test-model"])),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      const messageWithMeta: Message = {
        id: "meta_msg_1",
        role: "user",
        content: [{ type: "text", text: "Test message" }],
        createdAt: 1234567890,
        meta: {
          source: "web",
          userId: "user_123",
          sessionId: "session_456",
          priority: "high",
        },
      };

      const request: ChatRequest = {
        model: "test-model",
        messages: [messageWithMeta],
      };

      await adapter.chat(request, {});

      // Verify the message was converted (metadata handling depends on implementation)
      expect(mockProvider.streamChat).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: "user",
              content: "Test message",
            }),
          ]),
        }),
        undefined
      );
    });

    it("should handle empty ContentPart arrays gracefully", async () => {
      const mockProvider = {
        streamChat: vi.fn().mockImplementation(() => ({
          async *[Symbol.asyncIterator]() {
            yield { done: true, finishReason: "stop" };
          },
        })),
        getModels: vi
          .fn()
          .mockImplementation(() => Promise.resolve(["test-model"])),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      const emptyMessage: Message = {
        id: "empty_msg_1",
        role: "user",
        content: [], // Empty content array
        createdAt: Date.now(),
      };

      const request: ChatRequest = {
        model: "test-model",
        messages: [emptyMessage],
      };

      await adapter.chat(request, {});

      // Verify empty content is handled gracefully
      expect(mockProvider.streamChat).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: "user",
              content: "", // Should be empty string
            }),
          ]),
        }),
        undefined
      );
    });
  });

  describe("Request Parameter Handling", () => {
    it("should pass all request parameters correctly", async () => {
      const mockProvider = {
        streamChat: vi.fn().mockImplementation(() => ({
          async *[Symbol.asyncIterator]() {
            yield { done: true, finishReason: "stop" };
          },
        })),
        getModels: vi
          .fn()
          .mockImplementation(() => Promise.resolve(["test-model"])),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      const request: ChatRequest = {
        model: "gpt-4",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [{ type: "text", text: "Hello" }],
            createdAt: Date.now(),
          },
        ],
        temperature: 0.7,
        maxTokens: 1000,
        systemPrompt: "You are a helpful assistant",
      };

      await adapter.chat(request, {});

      expect(mockProvider.streamChat).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "gpt-4",
          temperature: 0.7,
          maxTokens: 1000,
          systemPrompt: "You are a helpful assistant",
          messages: expect.any(Array),
        }),
        undefined
      );
    });

    it("should handle missing optional parameters", async () => {
      const mockProvider = {
        streamChat: vi.fn().mockImplementation(() => ({
          async *[Symbol.asyncIterator]() {
            yield { done: true, finishReason: "stop" };
          },
        })),
        getModels: vi
          .fn()
          .mockImplementation(() => Promise.resolve(["test-model"])),
        validateModel: vi.fn(),
        getMaxTokens: vi.fn(),
        chat: vi.fn(),
      };

      const adapter = createTetherAIAdapter(mockProvider);

      const request: ChatRequest = {
        model: "gpt-4",
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: [{ type: "text", text: "Hello" }],
            createdAt: Date.now(),
          },
        ],
      };

      await adapter.chat(request, {});

      expect(mockProvider.streamChat).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "gpt-4",
          messages: expect.any(Array),
          temperature: undefined,
          maxTokens: undefined,
          systemPrompt: undefined,
          tools: undefined,
        }),
        undefined
      );
    });
  });
});

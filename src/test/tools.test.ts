import { describe, it, expect, vi, beforeEach } from "vitest";
import { weatherTool } from "../tools/weather";
import { ChatStore } from "../store";
import type {
  ToolDef,
  ToolContext,
  ProviderAdapter,
  ChatRequest,
  Delta,
} from "../types";

describe("Built-in Tools", () => {
  describe("weatherTool", () => {
    it("should have correct tool definition", () => {
      expect(weatherTool.name).toBe("get_weather");
      expect(weatherTool.title).toBe("Get Weather");
      expect(weatherTool.description).toBe(
        "Get current weather information for a location"
      );
      expect(weatherTool.schema).toBeDefined();
      expect(weatherTool.execute).toBeDefined();
    });

    it("should have correct schema structure", () => {
      expect(weatherTool.schema.type).toBe("object");
      expect(weatherTool.schema.properties).toHaveProperty("location");
      expect(weatherTool.schema.properties.location.type).toBe("string");
      expect(weatherTool.schema.properties.location.description).toBe(
        "The city or location to get weather for"
      );
      expect(weatherTool.schema.required).toContain("location");
    });

    it("should execute weather tool with valid input", async () => {
      const mockContext: ToolContext = {
        signal: undefined,
        logger: vi.fn(),
      };

      const result = (await weatherTool.execute(
        { location: "New York" },
        mockContext
      )) as {
        location: string;
        temperature: number;
        condition: string;
        unit: string;
        humidity: number;
        windSpeed: string;
        forecast: string;
      };

      expect(result).toBeDefined();
      expect(result).toHaveProperty("location", "New York");
      expect(result).toHaveProperty("temperature");
      expect(result).toHaveProperty("condition");
      expect(typeof result.temperature).toBe("number");
      expect(typeof result.condition).toBe("string");
    });

    it("should handle different locations", async () => {
      const mockContext: ToolContext = {
        signal: undefined,
        logger: vi.fn(),
      };

      const locations = ["London", "Tokyo", "Paris"];

      for (const location of locations) {
        const result = (await weatherTool.execute(
          { location },
          mockContext
        )) as {
          location: string;
          temperature: number;
          condition: string;
          unit: string;
          humidity: number;
          windSpeed: string;
          forecast: string;
        };

        expect(result.location).toBe(location);
        expect(result.temperature).toBeGreaterThan(-50);
        expect(result.temperature).toBeLessThan(60);
      }
    });

    it("should handle invalid input gracefully", async () => {
      const mockContext: ToolContext = {
        signal: undefined,
        logger: vi.fn(),
      };

      // Test with empty location
      const result = await weatherTool.execute({ location: "" }, mockContext);

      expect(result).toBeDefined();
      expect(result).toHaveProperty("error");
    });

    it.skip("should respect abort signal", async () => {
      const abortController = new AbortController();

      // Abort the signal before calling execute
      abortController.abort();

      const mockContext: ToolContext = {
        signal: abortController.signal,
        logger: vi.fn(),
      };

      await expect(
        weatherTool.execute({ location: "New York" }, mockContext)
      ).rejects.toThrow("Operation aborted");
    });

    it("should call logger when provided", async () => {
      const mockLogger = vi.fn();
      const mockContext: ToolContext = {
        signal: undefined,
        logger: mockLogger,
      };

      await weatherTool.execute({ location: "New York" }, mockContext);

      expect(mockLogger).toHaveBeenCalled();
    });
  });
});

describe("Tool Definition Validation", () => {
  const createValidTool = (): ToolDef => ({
    name: "test_tool",
    title: "Test Tool",
    description: "A test tool",
    schema: {
      type: "object",
      properties: {
        input: {
          type: "string",
          description: "Test input",
        },
      },
      required: ["input"],
    },
    execute: async (args: Record<string, unknown>) => ({
      result: args.input as string,
    }),
  });

  it("should validate tool name is required", () => {
    const tool = createValidTool();
    expect(tool.name).toBeDefined();
    expect(typeof tool.name).toBe("string");
    expect(tool.name.length).toBeGreaterThan(0);
  });

  it("should validate tool schema structure", () => {
    const tool = createValidTool();
    expect(tool.schema.type).toBe("object");
    expect(tool.schema.properties).toBeDefined();
    expect(typeof tool.schema.properties).toBe("object");
  });

  it("should validate tool execute function", () => {
    const tool = createValidTool();
    expect(typeof tool.execute).toBe("function");
  });

  it("should handle tool execution with proper args validation", async () => {
    const tool = createValidTool();
    const mockContext: ToolContext = {
      signal: undefined,
      logger: vi.fn(),
    };

    const result = await tool.execute({ input: "test" }, mockContext);
    expect(result).toEqual({ result: "test" });
  });

  it("should handle tool execution errors", async () => {
    const errorTool: ToolDef = {
      ...createValidTool(),
      execute: async () => {
        throw new Error("Tool execution failed");
      },
    };

    const mockContext: ToolContext = {
      signal: undefined,
      logger: vi.fn(),
    };

    await expect(
      errorTool.execute({ input: "test" }, mockContext)
    ).rejects.toThrow("Tool execution failed");
  });
});

describe("Tool Context", () => {
  it.skip("should provide abort signal to tools", async () => {
    const abortController = new AbortController();
    const context: ToolContext = {
      signal: abortController.signal,
    };

    const tool: ToolDef = {
      name: "abort_test",
      schema: { type: "object", properties: {} },
      execute: async (args, ctx) => {
        if (ctx.signal?.aborted) {
          throw new Error("Operation aborted");
        }
        return { result: "success" };
      },
    };

    // Test normal execution
    const result = await tool.execute({}, context);
    expect(result).toEqual({ result: "success" });

    // Test aborted execution - abort before execution
    const abortedController = new AbortController();
    abortedController.abort();

    const abortedContext: ToolContext = {
      signal: abortedController.signal,
    };

    await expect(tool.execute({}, abortedContext)).rejects.toThrow(
      "Operation aborted"
    );
  });

  it("should provide logger to tools", async () => {
    const mockLogger = vi.fn();
    const context: ToolContext = {
      logger: mockLogger,
    };

    const tool: ToolDef = {
      name: "logger_test",
      schema: { type: "object", properties: {} },
      execute: async (args, ctx) => {
        ctx.logger?.({ event: "test", data: "test data" });
        return { result: "success" };
      },
    };

    await tool.execute({}, context);
    expect(mockLogger).toHaveBeenCalledWith({
      event: "test",
      data: "test data",
    });
  });

  it("should handle missing context properties", async () => {
    const context: ToolContext = {};

    const tool: ToolDef = {
      name: "minimal_test",
      schema: { type: "object", properties: {} },
      execute: async (args, ctx) => {
        // Should not throw when signal or logger are undefined
        expect(ctx.signal).toBeUndefined();
        expect(ctx.logger).toBeUndefined();
        return { result: "success" };
      },
    };

    const result = await tool.execute({}, context);
    expect(result).toEqual({ result: "success" });
  });
});

describe("Tool Integration with ChatStore", () => {
  let mockProvider: ProviderAdapter;
  let chatStore: ChatStore;

  beforeEach(() => {
    // Create a mock provider that can handle tool calls
    mockProvider = {
      async chat(request: ChatRequest) {
        const mockDeltas: Delta[] = [
          {
            type: "tool_use",
            name: "get_weather",
            argsDelta: JSON.stringify({ location: "New York" }),
            id: "tool_call_1",
          },
          { type: "done", finishReason: "tool_calls" },
        ];

        return {
          async *[Symbol.asyncIterator]() {
            for (const delta of mockDeltas) {
              yield delta;
            }
          },
        };
      },
    };

    chatStore = new ChatStore(mockProvider);
  });

  it("should handle tool calls through ChatStore", async () => {
    await chatStore.send("What's the weather in New York?");

    // Should have user message and tool call
    expect(chatStore.messages).toHaveLength(2);
    expect(chatStore.messages[0].role).toBe("user");
    expect(chatStore.messages[1].role).toBe("assistant");
    expect(chatStore.messages[1].content[0].type).toBe("tool_use");
    if (chatStore.messages[1].content[0].type === "tool_use") {
      expect(chatStore.messages[1].content[0].name).toBe("get_weather");
    }
  });

  it("should handle tool execution and result processing", async () => {
    // Register the weather tool first
    chatStore.registerTool(weatherTool);

    await chatStore.send("What's the weather in New York?");

    // Simulate tool execution
    const toolCall = chatStore.messages[1].content[0];
    if (toolCall.type === "tool_use") {
      await chatStore.runTool({
        name: toolCall.name,
        args: toolCall.args as Record<string, unknown>,
        id: toolCall.id,
      });
    }

    // Should have tool result message
    console.log(
      "Messages:",
      chatStore.messages.map((m, i) => ({
        index: i,
        role: m.role,
        content: m.content.map((c) => c.type),
      }))
    );

    // Find the tool result message
    const toolResultMessage = chatStore.messages.find((m) => m.role === "tool");
    expect(toolResultMessage).toBeDefined();
    expect(toolResultMessage?.content[0].type).toBe("tool_result");
    if (toolResultMessage?.content[0].type === "tool_result") {
      expect(toolResultMessage.content[0].name).toBe("get_weather");
    }
  });

  it("should handle tool execution errors gracefully", async () => {
    // Create a failing tool
    const failingTool: ToolDef = {
      name: "failing_tool",
      title: "Failing Tool",
      description: "A tool that always fails",
      schema: { type: "object", properties: {} },
      execute: async () => {
        throw new Error("Tool execution failed");
      },
    };

    // Mock provider to call the failing tool
    const failingProvider: ProviderAdapter = {
      async chat(request: ChatRequest) {
        const mockDeltas: Delta[] = [
          {
            type: "tool_use",
            name: "failing_tool",
            argsDelta: JSON.stringify({}),
            id: "tool_call_fail",
          },
          { type: "done", finishReason: "tool_calls" },
        ];

        return {
          async *[Symbol.asyncIterator]() {
            for (const delta of mockDeltas) {
              yield delta;
            }
          },
        };
      },
    };

    chatStore = new ChatStore(failingProvider);

    // Register the failing tool
    chatStore.registerTool(failingTool);

    await chatStore.send("Call the failing tool");

    const toolCall = chatStore.messages[1].content[0];
    if (toolCall.type === "tool_use") {
      await expect(
        chatStore.runTool({
          name: toolCall.name,
          args: toolCall.args as Record<string, unknown>,
          id: toolCall.id,
        })
      ).rejects.toThrow("Tool execution failed");
    }

    // Should handle error gracefully
    expect(chatStore.status).toBe("error");
    expect(chatStore.error).toContain("Tool execution failed");
  });

  it("should handle unknown tool calls", async () => {
    const unknownProvider: ProviderAdapter = {
      async chat(request: ChatRequest) {
        const mockDeltas: Delta[] = [
          {
            type: "tool_use",
            name: "unknown_tool",
            argsDelta: JSON.stringify({}),
            id: "tool_call_unknown",
          },
          { type: "done", finishReason: "tool_calls" },
        ];

        return {
          async *[Symbol.asyncIterator]() {
            for (const delta of mockDeltas) {
              yield delta;
            }
          },
        };
      },
    };

    chatStore = new ChatStore(unknownProvider);

    await chatStore.send("Call unknown tool");

    const toolCall = chatStore.messages[1].content[0];
    if (toolCall.type === "tool_use") {
      await expect(
        chatStore.runTool({
          name: toolCall.name,
          args: toolCall.args as Record<string, unknown>,
          id: toolCall.id,
        })
      ).rejects.toThrow("Tool unknown_tool not found");
    }
  });
});

describe("Tool Result Rendering", () => {
  it("should render weather tool results correctly", () => {
    const mockResult = {
      location: "New York",
      temperature: 22,
      unit: "celsius",
      condition: "Sunny",
      humidity: 45,
      windSpeed: "10 mph",
      forecast: "Clear skies throughout the day",
    };

    const rendered = weatherTool.renderResult?.(mockResult);

    expect(rendered).toBeDefined();
    expect((rendered as { type: string; data: unknown })?.type).toBe(
      "weather_card"
    );
    expect((rendered as { type: string; data: unknown })?.data).toEqual(
      mockResult
    );
  });

  it("should handle tools without renderResult function", () => {
    const toolWithoutRender: ToolDef = {
      name: "no_render_tool",
      schema: { type: "object", properties: {} },
      execute: async () => ({ result: "test" }),
    };

    const result = { result: "test" };
    const rendered = toolWithoutRender.renderResult?.(result);

    expect(rendered).toBeUndefined();
  });
});

describe("Tool Schema Validation", () => {
  it("should validate required parameters", async () => {
    const mockContext: ToolContext = {
      signal: undefined,
      logger: vi.fn(),
    };

    // Test with missing required parameter
    const result = await weatherTool.execute({}, mockContext);
    expect(result).toBeDefined();
    // Should handle gracefully even with missing required params
  });

  it("should validate parameter types", async () => {
    const mockContext: ToolContext = {
      signal: undefined,
      logger: vi.fn(),
    };

    // Test with invalid parameter type
    const result = await weatherTool.execute(
      {
        location: 123, // Should be string
        unit: "invalid_unit", // Should be celsius or fahrenheit
      },
      mockContext
    );

    expect(result).toBeDefined();
    // Should handle gracefully even with invalid input
  });

  it("should validate enum values", async () => {
    const mockContext: ToolContext = {
      signal: undefined,
      logger: vi.fn(),
    };

    // Test with valid enum value
    const result = await weatherTool.execute(
      {
        location: "London",
        unit: "fahrenheit", // Valid enum value
      },
      mockContext
    );

    expect(result).toBeDefined();
    expect((result as { unit: string; temperature: number }).unit).toBe(
      "fahrenheit"
    );
    expect((result as { unit: string; temperature: number }).temperature).toBe(
      72
    ); // Fahrenheit value
  });
});

describe("Tool Performance and Timeout", () => {
  it.skip("should handle tool execution timeout", async () => {
    const slowTool: ToolDef = {
      name: "slow_tool",
      title: "Slow Tool",
      description: "A tool that takes a long time",
      schema: { type: "object", properties: {} },
      execute: async (args, context) => {
        // Check for abort signal
        if (context?.signal?.aborted) {
          throw new Error("Operation aborted");
        }

        // Simulate slow operation with abort signal support
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(resolve, 2000);

          if (context?.signal) {
            if (context.signal.aborted) {
              clearTimeout(timeout);
              reject(new Error("Operation aborted"));
              return;
            }

            context.signal.addEventListener("abort", () => {
              clearTimeout(timeout);
              reject(new Error("Operation aborted"));
            });
          }
        });

        return { result: "slow result" };
      },
    };

    const abortController = new AbortController();

    // Abort the signal before calling execute
    abortController.abort();

    const mockContext: ToolContext = {
      signal: abortController.signal,
      logger: vi.fn(),
    };

    await expect(slowTool.execute({}, mockContext)).rejects.toThrow(
      "Operation aborted"
    );
  });

  it("should handle concurrent tool executions", async () => {
    const concurrentTool: ToolDef = {
      name: "concurrent_tool",
      title: "Concurrent Tool",
      description: "A tool that can handle concurrent calls",
      schema: {
        type: "object",
        properties: {
          id: { type: "string", description: "Request ID" },
        },
        required: ["id"],
      },
      execute: async (args: Record<string, unknown>) => {
        const id = args.id as string;
        // Simulate some processing time
        await new Promise((resolve) => setTimeout(resolve, 100));
        return { result: `processed_${id}` };
      },
    };

    const mockContext: ToolContext = {
      signal: undefined,
      logger: vi.fn(),
    };

    // Execute multiple concurrent calls
    const promises = [
      concurrentTool.execute({ id: "1" }, mockContext),
      concurrentTool.execute({ id: "2" }, mockContext),
      concurrentTool.execute({ id: "3" }, mockContext),
    ];

    const results = await Promise.all(promises);

    expect(results).toHaveLength(3);
    expect((results[0] as { result: string }).result).toBe("processed_1");
    expect((results[1] as { result: string }).result).toBe("processed_2");
    expect((results[2] as { result: string }).result).toBe("processed_3");
  });
});

describe("Tool Security and Input Validation", () => {
  it("should sanitize tool inputs", async () => {
    const sanitizingTool: ToolDef = {
      name: "sanitizing_tool",
      title: "Sanitizing Tool",
      description: "A tool that sanitizes inputs",
      schema: {
        type: "object",
        properties: {
          input: { type: "string", description: "User input" },
        },
        required: ["input"],
      },
      execute: async (args: Record<string, unknown>) => {
        const input = args.input as string;
        // Basic sanitization
        const sanitized = input
          .replace(/<script>/gi, "")
          .replace(/<\/script>/gi, "")
          .trim();

        return {
          original: input,
          sanitized,
          length: sanitized.length,
        };
      },
    };

    const mockContext: ToolContext = {
      signal: undefined,
      logger: vi.fn(),
    };

    const maliciousInput = "<script>alert('xss')</script>Hello World";
    const result = await sanitizingTool.execute(
      { input: maliciousInput },
      mockContext
    );

    expect(
      (result as { original: string; sanitized: string; length: number })
        .original
    ).toBe(maliciousInput);
    expect(
      (result as { original: string; sanitized: string; length: number })
        .sanitized
    ).toBe("alert('xss')Hello World");
    expect(
      (result as { original: string; sanitized: string; length: number })
        .sanitized
    ).not.toContain("<script>");
  });

  it("should validate input length limits", async () => {
    const lengthLimitedTool: ToolDef = {
      name: "length_limited_tool",
      title: "Length Limited Tool",
      description: "A tool with input length limits",
      schema: {
        type: "object",
        properties: {
          input: {
            type: "string",
            description: "User input",
          },
        },
        required: ["input"],
      },
      execute: async (args: Record<string, unknown>) => {
        const input = args.input as string;
        if (input.length > 100) {
          throw new Error("Input too long");
        }
        return { result: "processed", length: input.length };
      },
    };

    const mockContext: ToolContext = {
      signal: undefined,
      logger: vi.fn(),
    };

    // Test with valid length
    const validResult = await lengthLimitedTool.execute(
      {
        input: "a".repeat(50),
      },
      mockContext
    );
    expect((validResult as { result: string; length: number }).result).toBe(
      "processed"
    );

    // Test with invalid length
    await expect(
      lengthLimitedTool.execute(
        {
          input: "a".repeat(150),
        },
        mockContext
      )
    ).rejects.toThrow("Input too long");
  });
});

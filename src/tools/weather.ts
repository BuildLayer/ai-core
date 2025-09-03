import type { ToolDef } from "../types.js";

export const weatherTool: ToolDef = {
  name: "get_weather",
  title: "Get Weather",
  description: "Get current weather information for a location",
  schema: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "The city or location to get weather for",
      },
      unit: {
        type: "string",
        description: "Temperature unit",
        enum: ["celsius", "fahrenheit"],
      },
    },
    required: ["location"],
  },
  async execute(
    args: Record<string, unknown>,
    context?: {
      signal?: AbortSignal;
      logger?: (ev: Record<string, unknown>) => void;
    }
  ) {
    // Check for abort signal
    if (context?.signal?.aborted) {
      throw new Error("Operation aborted");
    }

    // Extract and validate arguments
    const location = typeof args.location === "string" ? args.location : "";
    const unit = typeof args.unit === "string" ? args.unit : "celsius";

    // Call logger if provided
    if (context?.logger) {
      context.logger({
        event: "weather_tool_executed",
        data: { location, unit },
      });
    }

    // Handle invalid input
    if (!location || location.trim() === "") {
      return {
        location: location || "",
        temperature: 0,
        unit: unit || "celsius",
        condition: "Unknown",
        humidity: 0,
        windSpeed: "0 mph",
        forecast: "Invalid location provided",
        error: "Location cannot be empty",
      };
    }

    const mockWeatherData = {
      location,
      temperature: unit === "fahrenheit" ? 72 : 22,
      unit,
      condition: "Sunny",
      humidity: 45,
      windSpeed: "10 mph",
      forecast: "Clear skies throughout the day",
    };

    // Simulate API delay with abort signal support
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, 1000);

      if (context?.signal) {
        // Check if already aborted
        if (context.signal.aborted) {
          clearTimeout(timeout);
          reject(new Error("Operation aborted"));
          return;
        }

        // Listen for abort events
        const abortHandler = () => {
          clearTimeout(timeout);
          reject(new Error("Operation aborted"));
        };

        context.signal.addEventListener("abort", abortHandler);

        // Clean up listener when promise resolves
        const originalResolve = resolve;
        resolve = (...args) => {
          context.signal?.removeEventListener("abort", abortHandler);
          originalResolve(...args);
        };
      }
    });

    return mockWeatherData;
  },
  renderResult(result: unknown) {
    return {
      type: "weather_card",
      data: result,
    };
  },
};

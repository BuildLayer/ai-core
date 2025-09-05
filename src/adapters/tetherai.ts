import type {
  ChatRequest,
  ProviderAdapter,
  Delta,
  ModelInfo,
  Message,
  ContentPart,
} from "../types";

// Import all tetherai providers
import { openAI } from "@tetherai/openai";
import { anthropic } from "@tetherai/anthropic";
import { mistral } from "@tetherai/mistral";
import { grok } from "@tetherai/grok";
import { localLLM } from "@tetherai/local";

// TetherAI provider types
export type TetherAIProvider =
  | ReturnType<typeof openAI>
  | ReturnType<typeof anthropic>
  | ReturnType<typeof mistral>
  | ReturnType<typeof grok>
  | ReturnType<typeof localLLM>;

// Create adapter from any tetherai provider
export function createTetherAIAdapter(
  provider: TetherAIProvider
): ProviderAdapter {
  return {
    async chat(
      req: ChatRequest,
      opts: { signal?: AbortSignal }
    ): Promise<AsyncIterable<Delta>> {
      // Convert our ChatRequest to tetherai format
      const tetheraiReq = {
        model: req.model,
        messages: req.messages.map((msg: Message) => ({
          role: msg.role,
          content: msg.content
            .map((part: ContentPart) => {
              if (part.type === "text") return part.text;
              // For non-text content, convert to string representation
              if (part.type === "tool_use") {
                return `[Tool Use: ${part.name}]`;
              }
              if (part.type === "tool_result") {
                return `[Tool Result: ${part.name}]`;
              }
              if (part.type === "file") {
                return `[File: ${part.name || part.url}]`;
              }
              return JSON.stringify(part);
            })
            .join(""),
        })),
        temperature: req.temperature,
        maxTokens: req.maxTokens,
        systemPrompt: req.systemPrompt,
        tools: req.tools?.map((tool) => ({
          name: tool.name,
          description: tool.description,
          schema: tool.schema,
        })),
      };

      try {
        // Use tetherai provider's streamChat method
        const stream = await provider.streamChat(tetheraiReq, opts.signal);

        // Convert tetherai stream to our Delta format
        return convertStream(stream);
      } catch (error) {
        // Re-throw the error to ensure it's properly propagated
        throw error;
      }
    },

    async models(): Promise<ModelInfo[]> {
      const modelIds = await provider.getModels();
      return modelIds.map((id: string) => ({
        id,
        name: id,
        provider: "tetherai",
        contextLength: provider.getMaxTokens ? provider.getMaxTokens(id) : 0,
        supportsTools: false, // Tetherai providers don't expose tools support yet
      }));
    },
  };
}

// Convert tetherai stream to our Delta format
async function* convertStream(
  stream: AsyncIterable<{
    delta?: string;
    done?: boolean;
    finishReason?: string;
    toolUse?: {
      name: string;
      argsDelta: string;
      id: string;
    };
  }>
): AsyncGenerator<Delta> {
  try {
    for await (const chunk of stream) {
      if (chunk.done) {
        yield { type: "done", finishReason: chunk.finishReason };
        return;
      }
      if (chunk.delta) {
        yield { type: "text", chunk: chunk.delta };
      }
      if (chunk.toolUse) {
        yield {
          type: "tool_use",
          name: chunk.toolUse.name,
          argsDelta: chunk.toolUse.argsDelta,
          id: chunk.toolUse.id,
        };
      }
    }
  } catch (error) {
    // Re-throw the error so it can be caught by the caller
    throw error;
  }
}

// Pre-configured adapters for each provider
export function createOpenAIAdapter(
  apiKey: string,
  options?: {
    baseURL?: string;
    defaultModel?: string;
  }
): ProviderAdapter {
  const provider = openAI({
    apiKey,
    baseURL: options?.baseURL,
  });
  return createTetherAIAdapter(provider);
}

export function createAnthropicAdapter(
  apiKey: string,
  options?: {
    baseURL?: string;
    defaultModel?: string;
  }
): ProviderAdapter {
  const provider = anthropic({
    apiKey,
    baseURL: options?.baseURL,
  });
  return createTetherAIAdapter(provider);
}

export function createMistralAdapter(
  apiKey: string,
  options?: {
    baseURL?: string;
    defaultModel?: string;
  }
): ProviderAdapter {
  const provider = mistral({
    apiKey,
    baseURL: options?.baseURL,
  });
  return createTetherAIAdapter(provider);
}

export function createGrokAdapter(
  apiKey: string,
  options?: {
    baseURL?: string;
    defaultModel?: string;
  }
): ProviderAdapter {
  const provider = grok({
    apiKey,
    baseURL: options?.baseURL,
  });
  return createTetherAIAdapter(provider);
}

export function createLocalLLMAdapter(config: {
  baseURL: string;
  model: string;
  apiKey?: string;
}): ProviderAdapter {
  const provider = localLLM({
    baseURL: config.baseURL,
    apiKey: config.apiKey || "ollama",
  });
  return createTetherAIAdapter(provider);
}

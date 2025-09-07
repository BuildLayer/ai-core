# @buildlayer/ai-core

> Headless AI chat engine and store with support for multiple AI providers

[![npm version](https://img.shields.io/npm/v/@buildlayer/ai-core.svg)](https://www.npmjs.com/package/@buildlayer/ai-core)
![npm](https://img.shields.io/npm/dw/@buildlayer/ai-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## AI Chat Live Demo

**Try it now:** [ai-react.buildlayer.dev](https://ai-react.buildlayer.dev)

Experience the AI chat with pre-configured custom Local LLM support and all major provider options.
> Note: Some features are intentionally disabled in this demo version for performance and public access safety.

## Installation

```bash
# npm
npm install @buildlayer/ai-core

# pnpm
pnpm add @buildlayer/ai-core

# yarn
yarn add @buildlayer/ai-core
```

## Quick Start

### Simple Usage

```typescript
import { ChatStore, createOpenAIAdapter } from "@buildlayer/ai-core";

// Create a chat store with OpenAI
const adapter = createOpenAIAdapter(process.env.OPENAI_API_KEY!);
const chat = new ChatStore(adapter);

// Send a message
await chat.send("Hello! How are you today?");

// Listen to state changes
chat.subscribe((state) => {
  console.log("Chat state:", state);
});
```

### Advanced Provider Configuration

```typescript
import { 
  ChatStore, 
  createProviderAdapter, 
  validateProviderConfig,
  getAvailableProviders,
  getAvailableModels,
  type ProviderConfig 
} from "@buildlayer/ai-core";

// Configure your AI provider
const config: ProviderConfig = {
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY!, // Required
  model: 'gpt-4', // Required
  options: {
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: 'You are a helpful assistant.',
  },
};

// Validate configuration
const validation = validateProviderConfig(config);
if (!validation.valid) {
  console.error('Configuration errors:', validation.errors);
}

// Create adapter and chat store
const adapter = createProviderAdapter(config);
const chat = new ChatStore(adapter);

// Get available providers and models
const providers = getAvailableProviders();
const models = await getAvailableModels('openai');

console.log('Available providers:', providers);
console.log('OpenAI models:', models);
```

## Provider Configuration

The package now includes a powerful provider configuration system that allows you to easily switch between AI providers, validate configurations, and manage models.

### ProviderManager

The `ProviderManager` class provides a centralized way to manage AI providers:

```typescript
import { providerManager, type ProviderConfig } from "@buildlayer/ai-core";

// Get available providers
const providers = providerManager.getAvailableProviders();
console.log(providers); // ['openai', 'anthropic', 'mistral', 'grok', 'local']

// Get available models for a provider
const models = await providerManager.getAvailableModels('openai');
console.log(models); // Array of ModelInfo objects

// Create adapter with validation
const config: ProviderConfig = {
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY!, // Required
  model: 'gpt-4', // Required
  options: {
    temperature: 0.7,
    maxTokens: 1000,
  },
};

const adapter = providerManager.createAdapter(config);
```

### Configuration Validation

All configurations are validated before creating adapters. **API key and model are required for all providers**:

```typescript
// ✅ Valid configuration
const config: ProviderConfig = {
  provider: 'openai',
  apiKey: 'sk-...', // Required
  model: 'gpt-4',   // Required
};

// ❌ Invalid - missing API key
const invalidConfig: ProviderConfig = {
  provider: 'openai',
  model: 'gpt-4',
  // Missing apiKey
};
```

```typescript
import { validateProviderConfig } from "@buildlayer/ai-core";

const config: ProviderConfig = {
  provider: 'openai',
  apiKey: '', // Empty API key
  model: 'gpt-4',
};

const validation = validateProviderConfig(config);
if (!validation.valid) {
  console.error('Errors:', validation.errors);
  // ['API key is required for openai']
}
```

### Dynamic Provider Switching

You can easily switch between providers at runtime:

```typescript
import { createProviderAdapter, ChatStore } from "@buildlayer/ai-core";

const configs = [
  { provider: 'openai', apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4' },
  { provider: 'anthropic', apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-3-sonnet' },
  { provider: 'local', baseURL: 'http://localhost:11434/v1', model: 'llama2', apiKey: 'ollama' },
];

for (const config of configs) {
  try {
    const adapter = createProviderAdapter(config);
    const chat = new ChatStore(adapter);
    await chat.send("Hello!");
    console.log(`Response from ${config.provider}:`, chat.messages[chat.messages.length - 1]);
  } catch (error) {
    console.log(`Error with ${config.provider}:`, error);
  }
}
```

## Supported AI Providers

### OpenAI

```typescript
import { createOpenAIAdapter } from "@buildlayer/ai-core";

const adapter = createOpenAIAdapter(process.env.OPENAI_API_KEY!);
const chat = new ChatStore(adapter);
```

### Anthropic

```typescript
import { createAnthropicAdapter } from "@buildlayer/ai-core";

const adapter = createAnthropicAdapter(process.env.ANTHROPIC_API_KEY!);
const chat = new ChatStore(adapter);
```

### Mistral

```typescript
import { createMistralAdapter } from "@buildlayer/ai-core";

const adapter = createMistralAdapter(process.env.MISTRAL_API_KEY!);
const chat = new ChatStore(adapter);
```

### Grok

```typescript
import { createGrokAdapter } from "@buildlayer/ai-core";

const adapter = createGrokAdapter(process.env.GROK_API_KEY!);
const chat = new ChatStore(adapter);
```

### Local LLM (Ollama, etc.)

```typescript
import { createLocalLLMAdapter } from "@buildlayer/ai-core";

const adapter = createLocalLLMAdapter({
  baseURL: "http://localhost:11434/v1", // Ollama default
  model: "llama2", // Required
  apiKey: process.env.LOCAL_API_KEY || "ollama", // Required
});
const chat = new ChatStore(adapter);
```

## Core Features

### ChatStore

The `ChatStore` is the main class that manages chat state and interactions:

```typescript
import { ChatStore, createOpenAIAdapter } from "@buildlayer/ai-core";

const adapter = createOpenAIAdapter("your-api-key");
const chat = new ChatStore(adapter);

// Send messages
await chat.send("Hello!");
await chat.send("What's the weather like?", {
  model: "gpt-4",
  temperature: 0.7,
});

// Subscribe to state changes
chat.subscribe((state) => {
  console.log("Status:", state.status);
  console.log("Messages:", state.messages);
});
```

### State Management

The chat store provides reactive state management:

```typescript
chat.subscribe((state) => {
  switch (state.status) {
    case "idle":
      console.log("Ready for new messages");
      break;
    case "streaming":
      console.log("Receiving response...");
      break;
    case "error":
      console.error("Error:", state.error);
      break;
  }
});
```

### Message History

Access and manage conversation history:

```typescript
// Access state properties directly
console.log("Session ID:", chat.sessionId);
console.log("Total messages:", chat.messages.length);
console.log("Current status:", chat.status);
console.log("Last message:", chat.messages[chat.messages.length - 1]);

// Clear history
chat.clearHistory();
```

## Advanced Usage

### Custom Adapters

Create custom adapters for any AI provider:

```typescript
import { ChatStore, type ProviderAdapter, type ChatRequest, type Delta } from "@buildlayer/ai-core";

const customAdapter: ProviderAdapter = {
  async chat(req: ChatRequest, opts: { signal?: AbortSignal }): Promise<AsyncIterable<Delta>> {
    // Implement your custom AI provider logic
    return {
      async *[Symbol.asyncIterator]() {
        yield { type: "text", chunk: "Custom response" };
        yield { type: "done", finishReason: "stop" };
      }
    };
  },
  
  async models() {
    return [
      {
        id: "custom-model",
        name: "Custom Model",
        provider: "custom",
        contextLength: 4096,
        supportsTools: false
      }
    ];
  }
};

const chat = new ChatStore(customAdapter);
```

### Tool Integration

Register and use tools with your chat:

```typescript
import { weatherTool } from "@buildlayer/ai-core";

// Register a tool
chat.registerTool(weatherTool);

// Send message that might trigger tool usage
await chat.send("What's the weather in Belgrade?");

// Listen for tool calls
chat.subscribe((state) => {
  if (state.status === "tool-calling" && state.currentToolCall) {
    // Execute the tool
    chat.runTool(state.currentToolCall);
  }
});
```

### Streaming Responses

Handle streaming responses in real-time:

```typescript
chat.subscribe((state) => {
  if (state.status === "streaming") {
    const lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage?.role === "assistant") {
      console.log("Streaming:", lastMessage.content);
    }
  }
});
```

## API Reference

### ChatStore API

```typescript
class ChatStore {
  constructor(adapter: ProviderAdapter, sessionId?: string, memory?: MemoryAdapter);
  
  // Send a message
  send(input: string | ContentPart[], opts?: SendOpts): Promise<void>;
  
  // Subscribe to state changes
  subscribe(listener: (state: ChatState) => void): () => void;
  
  // State getters
  get sessionId(): string;
  get messages(): Message[];
  get status(): "idle" | "streaming" | "tool-calling" | "error";
  get currentToolCall(): { id: string; name: string; args: Record<string, unknown> } | undefined;
  get error(): string | undefined;
  
  // Message history management
  clearHistory(): void;
  exportHistory(): Message[];
  importHistory(msgs: Message[]): void;
  
  // Tool management
  registerTool(tool: ToolDef): void;
  unregisterTool(name: string): void;
  getTools(): ToolDef[];
  runTool(call: { name: string; args: Record<string, unknown>; id: string }): Promise<unknown>;
  
  // Control
  stop(): void;
  reset(): void;
}
```

### Adapters

All adapters implement the `ProviderAdapter` interface:

```typescript
interface ProviderAdapter {
  chat(req: ChatRequest, opts: { signal?: AbortSignal }): Promise<AsyncIterable<Delta>>;
  models?(): Promise<ModelInfo[]>;
}
```

### Types

```typescript
interface ChatState {
  sessionId: string;
  messages: Message[];
  status: "idle" | "streaming" | "tool-calling" | "error";
  currentToolCall?: { id: string; name: string; args: Record<string, unknown> };
  error?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: ContentPart[];
  createdAt: number;
  meta?: Record<string, unknown>;
}

interface SendOpts {
  model?: string;
  tools?: ToolDef[];
  temperature?: number;
  maxTokens?: number;
}
```

## Error Handling

```typescript
const chat = new ChatStore(adapter);

// Handle errors in subscription
chat.subscribe((state) => {
  if (state.status === "error") {
    console.error("Chat error:", state.error);
  }
});

// Handle errors in send
try {
  await chat.send("Hello!");
} catch (error) {
  console.error("Failed to send message:", error);
}
```

## TypeScript Support

This package is built with TypeScript and provides:

- Full type definitions
- IntelliSense support
- Compile-time error checking
- Runtime type validation

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/BuildLayer/ai-core.git
cd ai-core

# npm
npm install
npm run dev

# pnpm
pnpm install
pnpm dev

# yarn
yarn install
yarn dev
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Tetherai](https://github.com/nbursa/tetherai) - AI provider abstraction
  - [@tetherai/openai](https://github.com/nbursa/TetherAI/tree/main/packages/provider/openai) - OpenAI provider
  - [@tetherai/anthropic](https://github.com/nbursa/TetherAI/tree/main/packages/provider/anthropic) - Anthropic provider
  - [@tetherai/mistral](https://github.com/nbursa/TetherAI/tree/main/packages/provider/mistral) - Mistral provider
  - [@tetherai/grok](https://github.com/nbursa/TetherAI/tree/main/packages/provider/grok) - Grok provider
  - [@tetherai/local](https://github.com/nbursa/TetherAI/tree/main/packages/provider/local) - Local LLM provider

## Made with ❤️ by the BuildLayer.dev team

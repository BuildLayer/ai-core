# TetherAI Adapters

This package provides seamless integration with all TetherAI providers through a unified adapter interface.

## Available Adapters

- **OpenAI**: `createOpenAIAdapter(apiKey)`
- **Anthropic**: `createAnthropicAdapter(apiKey)`
- **Mistral**: `createMistralAdapter(apiKey)`
- **Grok**: `createGrokAdapter(apiKey)`
- **Local LLM**: `createLocalLLMAdapter(config)`

## Quick Start

```typescript
import { ChatStore, createOpenAIAdapter, weatherTool } from "@ai-ui-sdk/core";

// Create a chat store with OpenAI
const adapter = createOpenAIAdapter(process.env.OPENAI_API_KEY!);
const chat = new ChatStore(adapter);

// Add tools
chat.registerTool(weatherTool);

// Send a message
await chat.send("Hello! How are you today?");

// Send with specific options
await chat.send("What's the weather like?", {
  model: "gpt-4",
  temperature: 0.7,
  tools: [weatherTool],
});
```

## Using Different Providers

### OpenAI

```typescript
import { createOpenAIAdapter } from "@ai-ui-sdk/core";

const adapter = createOpenAIAdapter(process.env.OPENAI_API_KEY!);
const chat = new ChatStore(adapter);
```

### Anthropic

```typescript
import { createAnthropicAdapter } from "@ai-ui-sdk/core";

const adapter = createAnthropicAdapter(process.env.ANTHROPIC_API_KEY!);
const chat = new ChatStore(adapter);
```

### Mistral

```typescript
import { createMistralAdapter } from "@ai-ui-sdk/core";

const adapter = createMistralAdapter(process.env.MISTRAL_API_KEY!);
const chat = new ChatStore(adapter);
```

### Grok

```typescript
import { createGrokAdapter } from "@ai-ui-sdk/core";

const adapter = createGrokAdapter(process.env.GROK_API_KEY!);
const chat = new ChatStore(adapter);
```

### Local LLM (Ollama, etc.)

```typescript
import { createLocalLLMAdapter } from "@ai-ui-sdk/core";

const adapter = createLocalLLMAdapter({
  baseURL: "http://localhost:11434", // Ollama default
  apiKey: process.env.LOCAL_API_KEY, // Optional
});
const chat = new ChatStore(adapter);
```

## Advanced Usage

### Custom TetherAI Provider

```typescript
import { createTetherAIAdapter } from "@ai-ui-sdk/core";
import { openAI } from "@tetherai/openai";

// Create a custom provider
const provider = openAI({ 
  apiKey: process.env.OPENAI_API_KEY!,
  // Additional options...
});

// Create adapter from provider
const adapter = createTetherAIAdapter(provider);
const chat = new ChatStore(adapter);
```

### Working with Tools

```typescript
import { ChatStore, createOpenAIAdapter, weatherTool } from "@ai-ui-sdk/core";

const chat = new ChatStore(createOpenAIAdapter(process.env.OPENAI_API_KEY!));

// Register tools
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

## Type Safety

All adapters are fully typed and provide:

- Proper TypeScript definitions
- IntelliSense support
- Compile-time error checking
- Runtime type validation

## Error Handling

```typescript
const chat = new ChatStore(adapter);

chat.subscribe((state) => {
  if (state.status === "error") {
    console.error("Chat error:", state.error);
  }
});

try {
  await chat.send("Hello!");
} catch (error) {
  console.error("Failed to send message:", error);
}
```

## Streaming

All adapters support streaming responses:

```typescript
const chat = new ChatStore(adapter);

chat.subscribe((state) => {
  if (state.status === "streaming") {
    const lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage?.role === "assistant") {
      console.log("Streaming:", lastMessage.content);
    }
  }
});
```

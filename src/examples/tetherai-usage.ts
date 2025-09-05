import {
  ChatStore,
  createOpenAIAdapter,
  createAnthropicAdapter,
  createMistralAdapter,
  createGrokAdapter,
  createLocalLLMAdapter,
  weatherTool,
} from "@buildlayer/ai-core";

// Example usage of tetherai adapters

// 1. OpenAI Adapter
export function createOpenAIChat() {
  const adapter = createOpenAIAdapter(process.env.OPENAI_API_KEY!);
  const store = new ChatStore(adapter);

  return store;
}

// 2. Anthropic Adapter
export function createAnthropicChat() {
  const adapter = createAnthropicAdapter(process.env.ANTHROPIC_API_KEY!);
  const store = new ChatStore(adapter);

  return store;
}

// 3. Mistral Adapter
export function createMistralChat() {
  const adapter = createMistralAdapter(process.env.MISTRAL_API_KEY!);
  const store = new ChatStore(adapter);

  return store;
}

// 4. Grok Adapter
export function createGrokChat() {
  const adapter = createGrokAdapter(process.env.GROK_API_KEY!);
  const store = new ChatStore(adapter);

  return store;
}

// 5. Local LLM Adapter
export function createLocalLLMChat() {
  const adapter = createLocalLLMAdapter({
    baseURL: "http://localhost:11434/v1", // Ollama default
    model: "llama2", // Required
    apiKey: process.env.LOCAL_API_KEY || "ollama", // Required
  });
  const store = new ChatStore(adapter);

  return store;
}

// Example usage with tools
export function createChatWithTools() {
  const adapter = createOpenAIAdapter(process.env.OPENAI_API_KEY!);
  const store = new ChatStore(adapter);

  // Add tools to the store
  store.registerTool(weatherTool);

  return store;
}

// Example of using the chat
export async function exampleUsage() {
  const chat = createOpenAIChat();

  // Send a message
  await chat.send("Hello! How are you today?");

  // Send with specific model
  await chat.send("What's the weather like?", {
    model: "gpt-4",
    temperature: 0.7,
  });

  // Get chat history
  const history = chat.exportHistory();
  console.log("Chat history:", history);

  // Reset chat
  chat.reset();
}

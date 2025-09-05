import type {
  Role,
  ContentPart,
  Message,
  ToolDef,
  ToolContext,
  MemoryAdapter,
  ProviderAdapter,
  ChatRequest,
  ModelInfo,
  Delta,
  ChatState,
  SendOpts,
  ChatActions,
  ChatController,
} from "./types";

// Core types
export type {
  Role,
  ContentPart,
  Message,
  ToolDef,
  ToolContext,
  MemoryAdapter,
  ProviderAdapter,
  ChatRequest,
  ModelInfo,
  Delta,
  ChatState,
  SendOpts,
  ChatActions,
  ChatController,
  ProviderConfig,
  ProviderManager,
} from "./types";

// Core classes
export { ChatStore } from "./store";

// TetherAI Adapters
export {
  createTetherAIAdapter,
  createOpenAIAdapter,
  createAnthropicAdapter,
  createMistralAdapter,
  createGrokAdapter,
  createLocalLLMAdapter,
  type TetherAIProvider,
} from "./adapters";

// Provider Management
export {
  AIProviderManager,
  providerManager,
  createProviderAdapter,
  validateProviderConfig,
  getAvailableProviders,
  getAvailableModels,
} from "./provider-manager";

// Example tools
export { weatherTool } from "./tools/weather";

// Re-export common utilities
export { nanoid } from "nanoid";

import type {
  ProviderConfig,
  ProviderManager,
  ProviderAdapter,
  ModelInfo,
} from "./types";
import {
  createOpenAIAdapter,
  createAnthropicAdapter,
  createMistralAdapter,
  createGrokAdapter,
  createLocalLLMAdapter,
} from "./adapters";

export class AIProviderManager implements ProviderManager {
  private static instance: AIProviderManager;

  private constructor() {}

  static getInstance(): AIProviderManager {
    if (!AIProviderManager.instance) {
      AIProviderManager.instance = new AIProviderManager();
    }
    return AIProviderManager.instance;
  }

  getAvailableProviders(): string[] {
    return ["openai", "anthropic", "mistral", "grok", "local"];
  }

  async getAvailableModels(provider: string): Promise<ModelInfo[]> {
    // For local LLM, return empty array since user can enter any model name
    if (provider === "local") {
      return [];
    }

    const config: ProviderConfig = {
      provider: provider as any,
      apiKey: "dummy", // We need a dummy key to get models
      model: "dummy", // We need a dummy model to get models
    };

    try {
      const adapter = this.createAdapter(config);
      return (await adapter.models?.()) || [];
    } catch (error) {
      // Return default models if we can't fetch them
      return this.getDefaultModels(provider);
    }
  }

  createAdapter(config: ProviderConfig): ProviderAdapter {
    const validation = this.validateConfig(config);
    if (!validation.valid) {
      throw new Error(`Invalid configuration: ${validation.errors.join(", ")}`);
    }

    switch (config.provider) {
      case "openai":
        return createOpenAIAdapter(config.apiKey!, {
          baseURL: config.baseURL,
          defaultModel: config.model,
        });

      case "anthropic":
        return createAnthropicAdapter(config.apiKey!, {
          baseURL: config.baseURL,
          defaultModel: config.model,
        });

      case "mistral":
        return createMistralAdapter(config.apiKey!, {
          baseURL: config.baseURL,
          defaultModel: config.model,
        });

      case "grok":
        return createGrokAdapter(config.apiKey!, {
          baseURL: config.baseURL,
          defaultModel: config.model,
        });

      case "local":
        return createLocalLLMAdapter({
          baseURL: config.baseURL || "http://localhost:11434/v1",
          apiKey: config.apiKey,
          model: config.model,
        });

      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }
  }

  validateConfig(config: ProviderConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.provider) {
      errors.push("Provider is required");
    }

    if (!this.getAvailableProviders().includes(config.provider)) {
      errors.push(`Invalid provider: ${config.provider}`);
    }

    // Check API key requirements (not required for local LLM)
    if (!config.apiKey && config.provider !== "local") {
      errors.push(`API key is required for ${config.provider}`);
    }

    // Check model requirements
    if (!config.model) {
      errors.push(`Model is required for ${config.provider}`);
    }

    // Validate local LLM config
    if (config.provider === "local") {
      if (config.baseURL && !this.isValidUrl(config.baseURL)) {
        errors.push("Invalid baseURL for local LLM");
      }
    }

    // Validate model
    if (config.model.trim() === "") {
      errors.push("Model cannot be empty");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private getDefaultModels(provider: string): ModelInfo[] {
    const defaultModels: Record<string, ModelInfo[]> = {
      openai: [
        {
          id: "gpt-4",
          name: "GPT-4",
          provider: "openai",
          contextLength: 8192,
          supportsTools: true,
        },
        {
          id: "gpt-4-turbo",
          name: "GPT-4 Turbo",
          provider: "openai",
          contextLength: 128000,
          supportsTools: true,
        },
        {
          id: "gpt-3.5-turbo",
          name: "GPT-3.5 Turbo",
          provider: "openai",
          contextLength: 4096,
          supportsTools: true,
        },
      ],
      anthropic: [
        {
          id: "claude-3-opus",
          name: "Claude 3 Opus",
          provider: "anthropic",
          contextLength: 200000,
          supportsTools: true,
        },
        {
          id: "claude-3-sonnet",
          name: "Claude 3 Sonnet",
          provider: "anthropic",
          contextLength: 200000,
          supportsTools: true,
        },
        {
          id: "claude-3-haiku",
          name: "Claude 3 Haiku",
          provider: "anthropic",
          contextLength: 200000,
          supportsTools: true,
        },
      ],
      mistral: [
        {
          id: "mistral-large",
          name: "Mistral Large",
          provider: "mistral",
          contextLength: 32000,
          supportsTools: false,
        },
        {
          id: "mistral-medium",
          name: "Mistral Medium",
          provider: "mistral",
          contextLength: 32000,
          supportsTools: false,
        },
        {
          id: "mistral-small",
          name: "Mistral Small",
          provider: "mistral",
          contextLength: 32000,
          supportsTools: false,
        },
      ],
      grok: [
        {
          id: "grok-beta",
          name: "Grok Beta",
          provider: "grok",
          contextLength: 8192,
          supportsTools: false,
        },
      ],
      local: [
        {
          id: "llama2",
          name: "Llama 2",
          provider: "local",
          contextLength: 4096,
          supportsTools: false,
        },
        {
          id: "codellama",
          name: "Code Llama",
          provider: "local",
          contextLength: 4096,
          supportsTools: false,
        },
        {
          id: "mistral",
          name: "Mistral (Local)",
          provider: "local",
          contextLength: 32000,
          supportsTools: false,
        },
      ],
    };

    return defaultModels[provider] || [];
  }
}

// Export singleton instance
export const providerManager = AIProviderManager.getInstance();

// Convenience functions
export function createProviderAdapter(config: ProviderConfig): ProviderAdapter {
  return providerManager.createAdapter(config);
}

export function validateProviderConfig(config: ProviderConfig): {
  valid: boolean;
  errors: string[];
} {
  return providerManager.validateConfig(config);
}

export function getAvailableProviders(): string[] {
  return providerManager.getAvailableProviders();
}

export async function getAvailableModels(
  provider: string
): Promise<ModelInfo[]> {
  return providerManager.getAvailableModels(provider);
}

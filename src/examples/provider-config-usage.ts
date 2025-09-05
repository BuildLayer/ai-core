import {
  ChatStore,
  createProviderAdapter,
  validateProviderConfig,
  getAvailableProviders,
  getAvailableModels,
  providerManager,
  type ProviderConfig,
} from "../index";

// Example 1: Basic provider configuration
export async function basicProviderConfig() {
  // Configure OpenAI
  const openaiConfig: ProviderConfig = {
    provider: "openai",
    apiKey: process.env.OPENAI_API_KEY!,
    model: "gpt-4",
    options: {
      temperature: 0.7,
      maxTokens: 1000,
    },
  };

  // Validate configuration
  const validation = validateProviderConfig(openaiConfig);
  if (!validation.valid) {
    console.error("Configuration errors:", validation.errors);
    return;
  }

  // Create adapter and chat store
  const adapter = createProviderAdapter(openaiConfig);
  const chat = new ChatStore(adapter);

  // Use the chat
  await chat.send("Hello! How are you?");
  console.log("Messages:", chat.messages);
}

// Example 2: Dynamic provider selection
export async function dynamicProviderSelection() {
  const providers = getAvailableProviders();
  console.log("Available providers:", providers);

  // Get available models for each provider
  for (const provider of providers) {
    try {
      const models = await getAvailableModels(provider);
      console.log(
        `${provider} models:`,
        models.map((m) => m.name)
      );
    } catch (error) {
      console.log(`${provider} models: Unable to fetch (${error})`);
    }
  }
}

// Example 3: Provider switching
export async function providerSwitching() {
  const configs: ProviderConfig[] = [
    {
      provider: "openai",
      apiKey: process.env.OPENAI_API_KEY!,
      model: "gpt-4",
    },
    {
      provider: "anthropic",
      apiKey: process.env.ANTHROPIC_API_KEY!,
      model: "claude-3-sonnet",
    },
    {
      provider: "local",
      baseURL: "http://localhost:11434/v1",
      model: "llama2",
      apiKey: "ollama",
    },
  ];

  for (const config of configs) {
    try {
      const validation = validateProviderConfig(config);
      if (!validation.valid) {
        console.log(
          `Skipping ${config.provider}: ${validation.errors.join(", ")}`
        );
        continue;
      }

      const adapter = createProviderAdapter(config);
      const chat = new ChatStore(adapter);

      console.log(`Testing ${config.provider}...`);
      await chat.send("What is 2+2?");
      console.log(
        `Response from ${config.provider}:`,
        chat.messages[chat.messages.length - 1]
      );
    } catch (error) {
      console.log(`Error with ${config.provider}:`, error);
    }
  }
}

// Example 4: Using ProviderManager directly
export async function usingProviderManager() {
  const manager = providerManager;

  // Get all available providers
  const providers = manager.getAvailableProviders();
  console.log("Providers:", providers);

  // Get models for a specific provider
  const openaiModels = await manager.getAvailableModels("openai");
  console.log("OpenAI models:", openaiModels);

  // Create adapter with validation
  const config: ProviderConfig = {
    provider: "openai",
    apiKey: process.env.OPENAI_API_KEY!,
    model: "gpt-3.5-turbo",
  };

  const adapter = manager.createAdapter(config);
  const chat = new ChatStore(adapter);

  await chat.send("Tell me a joke!");
  console.log("Joke:", chat.messages[chat.messages.length - 1]);
}

// Example 5: Error handling and validation
export async function errorHandlingExample() {
  // Invalid configuration
  const invalidConfig: ProviderConfig = {
    provider: "openai",
    apiKey: "", // Empty API key
    model: "gpt-4",
  };

  const validation = validateProviderConfig(invalidConfig);
  console.log("Validation result:", validation);

  try {
    const adapter = createProviderAdapter(invalidConfig);
  } catch (error) {
    console.log("Expected error:", error);
  }

  // Valid configuration
  const validConfig: ProviderConfig = {
    provider: "openai",
    apiKey: process.env.OPENAI_API_KEY!,
    model: "gpt-4",
  };

  const validValidation = validateProviderConfig(validConfig);
  console.log("Valid config:", validValidation.valid);
}

// Example 6: Custom provider configuration with options
export async function customProviderConfig() {
  const config: ProviderConfig = {
    provider: "openai",
    apiKey: process.env.OPENAI_API_KEY!,
    model: "gpt-4-turbo",
    options: {
      temperature: 0.9,
      maxTokens: 2000,
      systemPrompt:
        "You are a helpful assistant that always responds in Serbian.",
    },
  };

  const adapter = createProviderAdapter(config);
  const chat = new ChatStore(adapter);

  // The system prompt will be applied to all conversations
  await chat.send("Kako se zoveš?");
  console.log("Response:", chat.messages[chat.messages.length - 1]);
}

// Example 7: Local LLM configuration
export async function localLLMConfig() {
  const config: ProviderConfig = {
    provider: "local",
    baseURL: "http://localhost:11434/v1",
    model: "llama2",
    apiKey: "ollama",
    options: {
      temperature: 0.8,
    },
  };

  const validation = validateProviderConfig(config);
  if (!validation.valid) {
    console.log("Local LLM not available:", validation.errors);
    return;
  }

  const adapter = createProviderAdapter(config);
  const chat = new ChatStore(adapter);

  try {
    await chat.send("Hello from local LLM!");
    console.log("Local LLM response:", chat.messages[chat.messages.length - 1]);
  } catch (error) {
    console.log("Local LLM error (make sure Ollama is running):", error);
  }
}

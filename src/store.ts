import { nanoid } from "nanoid";
import type {
  ChatState,
  ChatActions,
  ChatController,
  Message,
  ContentPart,
  ToolDef,
  SendOpts,
  ProviderAdapter,
  Delta,
  MemoryAdapter,
} from "./types.js";

export class ChatStore implements ChatController {
  private _state: ChatState;
  private _provider: ProviderAdapter;
  private _tools: Map<string, ToolDef> = new Map();
  private _abortController?: AbortController;
  private _listeners: Set<(state: ChatState) => void> = new Set();
  private _memory?: MemoryAdapter;
  private _updateTimeout?: NodeJS.Timeout;

  constructor(
    provider: ProviderAdapter,
    sessionId?: string,
    memory?: MemoryAdapter
  ) {
    if (!provider || typeof provider !== "object") {
      throw new Error("Provider must be a valid object");
    }
    if (!provider.chat || typeof provider.chat !== "function") {
      throw new Error("Provider must have a chat function");
    }
    if (sessionId && typeof sessionId !== "string") {
      throw new Error("Session ID must be a string");
    }
    if (memory && typeof memory !== "object") {
      throw new Error("Memory adapter must be a valid object");
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (typeof memory.get !== "function" ||
        typeof memory.set !== "function" ||
        typeof memory.delete !== "function" ||
        typeof memory.clear !== "function")
    ) {
      throw new Error("Memory adapter methods must be functions");
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (typeof memory.get !== "function" ||
        typeof memory.set !== "function" ||
        typeof memory.delete !== "function" ||
        typeof memory.clear !== "function")
    ) {
      throw new Error("Memory adapter methods must be functions");
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (typeof memory.get !== "function" ||
        typeof memory.set !== "function" ||
        typeof memory.delete !== "function" ||
        typeof memory.clear !== "function")
    ) {
      throw new Error("Memory adapter methods must be functions");
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (typeof memory.get !== "function" ||
        typeof memory.set !== "function" ||
        typeof memory.delete !== "function" ||
        typeof memory.clear !== "function")
    ) {
      throw new Error("Memory adapter methods must be functions");
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (typeof memory.get !== "function" ||
        typeof memory.set !== "function" ||
        typeof memory.delete !== "function" ||
        typeof memory.clear !== "function")
    ) {
      throw new Error("Memory adapter methods must be functions");
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (typeof memory.get !== "function" ||
        typeof memory.set !== "function" ||
        typeof memory.delete !== "function" ||
        typeof memory.clear !== "function")
    ) {
      throw new Error("Memory adapter methods must be functions");
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (typeof memory.get !== "function" ||
        typeof memory.set !== "function" ||
        typeof memory.delete !== "function" ||
        typeof memory.clear !== "function")
    ) {
      throw new Error("Memory adapter methods must be functions");
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (typeof memory.get !== "function" ||
        typeof memory.set !== "function" ||
        typeof memory.delete !== "function" ||
        typeof memory.clear !== "function")
    ) {
      throw new Error("Memory adapter methods must be functions");
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (typeof memory.get !== "function" ||
        typeof memory.set !== "function" ||
        typeof memory.delete !== "function" ||
        typeof memory.clear !== "function")
    ) {
      throw new Error("Memory adapter methods must be functions");
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (typeof memory.get !== "function" ||
        typeof memory.set !== "function" ||
        typeof memory.delete !== "function" ||
        typeof memory.clear !== "function")
    ) {
      throw new Error("Memory adapter methods must be functions");
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (typeof memory.get !== "function" ||
        typeof memory.set !== "function" ||
        typeof memory.delete !== "function" ||
        typeof memory.clear !== "function")
    ) {
      throw new Error("Memory adapter methods must be functions");
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (typeof memory.get !== "function" ||
        typeof memory.set !== "function" ||
        typeof memory.delete !== "function" ||
        typeof memory.clear !== "function")
    ) {
      throw new Error("Memory adapter methods must be functions");
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (typeof memory.get !== "function" ||
        typeof memory.set !== "function" ||
        typeof memory.delete !== "function" ||
        typeof memory.clear !== "function")
    ) {
      throw new Error("Memory adapter methods must be functions");
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (typeof memory.get !== "function" ||
        typeof memory.set !== "function" ||
        typeof memory.delete !== "function" ||
        typeof memory.clear !== "function")
    ) {
      throw new Error("Memory adapter methods must be functions");
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (typeof memory.get !== "function" ||
        typeof memory.set !== "function" ||
        typeof memory.delete !== "function" ||
        typeof memory.clear !== "function")
    ) {
      throw new Error("Memory adapter methods must be functions");
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (typeof memory.get !== "function" ||
        typeof memory.set !== "function" ||
        typeof memory.delete !== "function" ||
        typeof memory.clear !== "function")
    ) {
      throw new Error("Memory adapter methods must be functions");
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }
    if (
      memory &&
      (typeof memory.get !== "function" ||
        typeof memory.set !== "function" ||
        typeof memory.delete !== "function" ||
        typeof memory.clear !== "function")
    ) {
      throw new Error("Memory adapter methods must be functions");
    }
    if (
      memory &&
      (!memory.get || !memory.set || !memory.delete || !memory.clear)
    ) {
      throw new Error(
        "Memory adapter must have get, set, delete, and clear methods"
      );
    }

    this._provider = provider;
    this._memory = memory;
    this._state = {
      sessionId: sessionId || nanoid(),
      messages: [],
      status: "idle",
    };

    // Load from memory if available
    if (this._memory && sessionId) {
      this._memory
        .get(sessionId)
        .then((savedState: unknown) => {
          if (savedState && typeof savedState === "object") {
            this._state = { ...this._state, ...savedState };
          }
        })
        .catch((error: unknown) => {
          console.error("Failed to load state from memory:", error);
        });
    }

    // console.log("ChatStore constructor - this context:", this);
  }

  // State getters
  get sessionId() {
    return this._state.sessionId;
  }
  get messages() {
    return this._state.messages;
  }
  get status() {
    return this._state.status;
  }
  get currentToolCall() {
    return this._state.currentToolCall;
  }
  get error() {
    return this._state.error;
  }

  // Actions
  send = async (
    input: string | ContentPart[],
    opts: SendOpts = {}
  ): Promise<void> => {
    console.log("ChatStore send method called - this context:", this);
    console.log(
      "ChatStore send method called - _updateState exists:",
      typeof this._updateState
    );
    try {
      // Validate input
      if (
        !input ||
        (typeof input === "string" && input.trim() === "") ||
        (Array.isArray(input) && input.length === 0)
      ) {
        throw new Error("Input cannot be empty");
      }

      // Check if already streaming
      if (this._state.status === "streaming") {
        throw new Error("Another message is already being processed");
      }

      // Add user message
      const userMessage: Message = {
        id: nanoid(),
        role: "user",
        content:
          typeof input === "string" ? [{ type: "text", text: input }] : input,
        createdAt: Date.now(),
      };

      this._updateState({
        messages: [...this._state.messages, userMessage],
        status: "streaming",
        error: undefined,
      });

      // Prepare chat request (use updated state that includes user message)
      const chatRequest = {
        model: opts.model || "",
        messages: this._state.messages, // Already includes userMessage from _updateState above
        tools: opts.tools || Array.from(this._tools.values()),
        temperature: opts.temperature,
        maxTokens: opts.maxTokens,
      };

      // Start streaming
      this._abortController = new AbortController();
      const stream = await this._provider.chat(chatRequest, {
        signal: this._abortController.signal,
      });

      let assistantMessage: Message = {
        id: nanoid(),
        role: "assistant",
        content: [],
        createdAt: Date.now(),
      };

      for await (const delta of stream) {
        if (delta.type === "text") {
          // Append text chunk
          const textContent = assistantMessage.content.find(
            (c) => c.type === "text"
          ) as { type: "text"; text: string } | undefined;
          if (textContent) {
            textContent.text += delta.chunk;
          } else {
            assistantMessage.content.push({ type: "text", text: delta.chunk });
          }

          // Add assistant message if not already added
          const lastMessage =
            this._state.messages[this._state.messages.length - 1];

          if (!lastMessage || lastMessage.role !== "assistant") {
            this._updateState({
              messages: [...this._state.messages, assistantMessage],
            });
          } else {
            // Update the existing assistant message without removing user messages
            const messages = [...this._state.messages];
            // Find the last assistant message and replace it
            for (let i = messages.length - 1; i >= 0; i--) {
              if (messages[i].role === "assistant") {
                messages[i] = assistantMessage;
                break;
              }
            }
            this._updateState({
              messages,
            });
          }
        } else if (delta.type === "tool_use") {
          // Add tool_use to assistant message content
          assistantMessage.content.push({
            type: "tool_use",
            name: delta.name,
            args: JSON.parse(delta.argsDelta),
            id: delta.id,
          });

          // Add assistant message if not already added
          const lastMessage =
            this._state.messages[this._state.messages.length - 1];
          if (!lastMessage || lastMessage.role !== "assistant") {
            this._updateState({
              messages: [...this._state.messages, assistantMessage],
              status: "tool-calling",
              currentToolCall: {
                id: delta.id,
                name: delta.name,
                args: JSON.parse(delta.argsDelta),
              },
            });
          } else {
            // Update the existing assistant message with tool_use without removing user messages
            const messages = [...this._state.messages];
            // Find the last assistant message and replace it
            for (let i = messages.length - 1; i >= 0; i--) {
              if (messages[i].role === "assistant") {
                messages[i] = assistantMessage;
                break;
              }
            }
            this._updateState({
              messages,
              status: "tool-calling",
              currentToolCall: {
                id: delta.id,
                name: delta.name,
                args: JSON.parse(delta.argsDelta),
              },
            });
          }
          break;
        } else if (delta.type === "done") {
          break;
        }
      }

      // Only add assistant message if it has content and wasn't already added
      if (
        assistantMessage.content.length > 0 &&
        this._state.messages.length === 1
      ) {
        this._updateState({
          messages: [...this._state.messages, assistantMessage],
        });
      }

      // Set status to idle when done
      this._updateState({
        status: "idle",
        currentToolCall: undefined,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        this._updateState({
          status: "idle",
          currentToolCall: undefined,
        });
      } else {
        this._updateState({
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
          currentToolCall: undefined,
        });
        throw error; // Re-throw the error for tests
      }
    }
  };

  runTool = async (call: {
    name: string;
    args: Record<string, unknown>;
    id: string;
  }): Promise<unknown> => {
    // Validate call
    if (!call.name || !call.id) {
      throw new Error("Tool call must have name and id");
    }

    const tool = this._tools.get(call.name);
    if (!tool) {
      throw new Error(`Tool ${call.name} not found`);
    }

    try {
      const result = await tool.execute(call.args, {
        signal: this._abortController?.signal,
      });

      // Add tool result message
      const toolResultMessage: Message = {
        id: nanoid(),
        role: "tool",
        content: [
          { type: "tool_result", name: call.name, result, forId: call.id },
        ],
        createdAt: Date.now(),
      };

      this._updateState({
        messages: [...this._state.messages, toolResultMessage],
        status: "idle",
        currentToolCall: undefined,
      });

      // Continue generation with tool result - only if there are messages to continue with
      if (this._state.messages.length > 0) {
        await this.send("Continue", {
          model: this._state.messages[0]?.meta?.model as string,
        });
      }

      return result;
    } catch (error) {
      this._updateState({
        status: "error",
        error: error instanceof Error ? error.message : "Tool execution failed",
        currentToolCall: undefined,
      });
      throw error; // Re-throw the error for tests
    }
  };

  stop = (): void => {
    if (this._abortController) {
      this._abortController.abort();
      this._abortController = undefined;
    }
    this._updateState({
      status: "idle",
      currentToolCall: undefined,
    });
  };

  reset = (): void => {
    // Stop any ongoing operations
    if (this._abortController) {
      this._abortController.abort();
      this._abortController = undefined;
    }

    this._updateState({
      messages: [],
      status: "idle",
      error: undefined,
      currentToolCall: undefined,
    });
  };

  importHistory = (msgs: Message[]): void => {
    if (!Array.isArray(msgs)) {
      throw new Error("Messages must be an array");
    }
    // Validate messages
    for (const msg of msgs) {
      if (!msg.id || !msg.role || !Array.isArray(msg.content)) {
        throw new Error("Invalid message format");
      }
    }
    this._updateState({ messages: msgs });
  };

  exportHistory = (): Message[] => {
    return [...this._state.messages];
  };

  clearHistory = (): void => {
    // Stop any ongoing operations
    if (this._abortController) {
      this._abortController.abort();
      this._abortController = undefined;
    }

    this._updateState({
      messages: [],
      status: "idle",
      error: undefined,
      currentToolCall: undefined,
    });
  };

  // Tool management
  registerTool = (tool: ToolDef): void => {
    if (!tool || typeof tool !== "object") {
      throw new Error("Tool must be an object");
    }
    if (!tool.name || typeof tool.name !== "string") {
      throw new Error("Tool must have a valid name");
    }
    if (!tool.execute || typeof tool.execute !== "function") {
      throw new Error("Tool must have an execute function");
    }
    this._tools.set(tool.name, tool);
  };

  unregisterTool = (name: string): void => {
    if (!name || typeof name !== "string") {
      throw new Error("Tool name must be a valid string");
    }
    if (!this._tools.has(name)) {
      throw new Error(`Tool ${name} not found`);
    }
    this._tools.delete(name);
  };

  getTools = (): ToolDef[] => {
    return Array.from(this._tools.values());
  };

  // Utility methods
  isToolRegistered = (name: string): boolean => {
    return this._tools.has(name);
  };

  getTool = (name: string): ToolDef | undefined => {
    return this._tools.get(name);
  };

  // Memory management
  async saveToMemory(): Promise<void> {
    if (this._memory) {
      try {
        await this._memory.set(this._state.sessionId, this._state);
      } catch (error) {
        console.error("Failed to save to memory:", error);
        throw error;
      }
    }
  }

  async loadFromMemory(): Promise<void> {
    if (this._memory) {
      try {
        const savedState = await this._memory.get(this._state.sessionId);
        if (savedState && typeof savedState === "object") {
          this._state = { ...this._state, ...savedState };
        }
      } catch (error) {
        console.error("Failed to load from memory:", error);
        throw error;
      }
    }
  }

  // Subscription management
  subscribe = (listener: (state: ChatState) => void): (() => void) => {
    if (typeof listener !== "function") {
      throw new Error("Listener must be a function");
    }
    this._listeners.add(listener);

    try {
      listener(this._state);
    } catch (error) {
      console.error("Error in initial state listener:", error);
    }

    return () => {
      this._listeners.delete(listener);
    };
  };

  private _updateState = (updates: Partial<ChatState>): void => {
    // Validate updates
    if (updates.messages && !Array.isArray(updates.messages)) {
      throw new Error("Messages must be an array");
    }
    if (
      updates.status &&
      !["idle", "streaming", "tool-calling", "error"].includes(updates.status)
    ) {
      throw new Error("Invalid status");
    }
    if (updates.sessionId && typeof updates.sessionId !== "string") {
      throw new Error("Session ID must be a string");
    }
    if (updates.error && typeof updates.error !== "string") {
      throw new Error("Error must be a string");
    }

    this._state = { ...this._state, ...updates };

    // Throttle updates to prevent infinite loops during streaming
    if (this._updateTimeout) {
      clearTimeout(this._updateTimeout);
    }

    // Use longer throttle during streaming to prevent infinite loops
    const throttleDelay = this._state.status === "streaming" ? 100 : 10;

    this._updateTimeout = setTimeout(() => {
      this._listeners.forEach((listener) => {
        try {
          listener(this._state);
        } catch (error) {
          console.error("Error in state listener:", error);
          // Remove problematic listener
          this._listeners.delete(listener);
        }
      });
    }, throttleDelay);

    // Save to memory if available
    if (this._memory) {
      this._memory
        .set(this._state.sessionId, this._state)
        .catch((error: unknown) => {
          console.error("Failed to save state to memory:", error);
        });
    }
  };
}

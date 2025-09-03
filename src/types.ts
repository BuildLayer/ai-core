export type Role = "user" | "assistant" | "system" | "tool";

export type ContentPart =
  | { type: "text"; text: string }
  | { type: "tool_use"; name: string; args: unknown; id: string }
  | { type: "tool_result"; name: string; result: unknown; forId: string }
  | {
      type: "file";
      mime: string;
      name: string;
      url?: string;
      data?: ArrayBuffer;
    };

export interface Message {
  id: string;
  role: Role;
  content: ContentPart[];
  createdAt: number;
  meta?: Record<string, unknown>;
}

export interface ToolDef<TArgs = Record<string, unknown>, TResult = unknown> {
  name: string;
  title?: string;
  description?: string;
  schema: {
    type: "object";
    properties: Record<
      string,
      {
        type: string;
        description?: string;
        enum?: unknown[];
        minimum?: number;
        maximum?: number;
        pattern?: string;
      }
    >;
    required?: string[];
  };
  execute: (args: TArgs, ctx: ToolContext) => Promise<TResult>;
  renderResult?: (result: TResult) => unknown; // Framework agnostic
}

export interface ToolContext {
  signal?: AbortSignal;
  memory?: MemoryAdapter;
  logger?: (ev: Record<string, unknown>) => void;
}

export interface MemoryAdapter {
  get: (key: string) => Promise<unknown>;
  set: (key: string, value: unknown) => Promise<void>;
  delete: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

export interface ProviderAdapter {
  chat: (
    req: ChatRequest,
    opts: { signal?: AbortSignal }
  ) => Promise<AsyncIterable<Delta>>;
  models?: () => Promise<ModelInfo[]>;
}

export interface ChatRequest {
  model: string;
  messages: Message[];
  tools?: ToolDef[];
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  contextLength?: number;
  supportsTools?: boolean;
}

export type Delta =
  | { type: "text"; chunk: string }
  | { type: "tool_use"; name: string; argsDelta: string; id: string }
  | { type: "done"; finishReason?: string };

export interface ChatState {
  sessionId: string;
  messages: Message[];
  status: "idle" | "streaming" | "tool-calling" | "error";
  currentToolCall?: { id: string; name: string; args: Record<string, unknown> };
  error?: string;
}

export interface SendOpts {
  model?: string;
  tools?: ToolDef[];
  temperature?: number;
  maxTokens?: number;
}

export interface ChatActions {
  send: (input: string | ContentPart[], opts?: SendOpts) => Promise<void>;
  runTool: (call: {
    name: string;
    args: Record<string, unknown>;
    id: string;
  }) => Promise<unknown>;
  stop: () => void;
  reset: () => void;
  importHistory: (msgs: Message[]) => void;
  exportHistory: () => Message[];
  clearHistory: () => void;
  subscribe: (listener: (state: ChatState) => void) => () => void;
  registerTool: (tool: ToolDef) => void;
  unregisterTool: (name: string) => void;
  getTools: () => ToolDef[];
}

export type ChatController = ChatState & ChatActions;

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatResponse {
  message: Message;
  model: string;
}

export interface Model {
  name: string;
  modified_at?: string;
  size?: number;
}

export interface HealthStatus {
  status: "ok" | "error";
  ollama: "running" | "stopped";
  error?: string;
}

export interface InprovLLMConfig {
  baseUrl?: string;
  apiKey?: string;
  defaultModel?: string;
  timeout?: number;
}

const DEFAULT_BASE_URL = "https://ollama.inprov.app";
const DEFAULT_MODEL = "Deepseek-Coder:latest";
const DEFAULT_TIMEOUT = 60000;

export class InprovLLM {
  private baseUrl: string;
  private apiKey?: string;
  private defaultModel: string;
  private timeout: number;

  constructor(config: InprovLLMConfig = {}) {
    this.baseUrl = config.baseUrl?.replace(/\/$/, "") || DEFAULT_BASE_URL;
    this.apiKey = config.apiKey;
    this.defaultModel = config.defaultModel || DEFAULT_MODEL;
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
  }

  private async fetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          ...headers,
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Send a chat message and get a response
   */
  async chat(
    messages: Message[],
    options: ChatOptions = {}
  ): Promise<ChatResponse> {
    const model = options.model || this.defaultModel;

    return this.fetch<ChatResponse>("/api/chat", {
      method: "POST",
      body: JSON.stringify({ model, messages }),
    });
  }

  /**
   * Simple prompt helper - sends a single user message
   */
  async prompt(content: string, options: ChatOptions = {}): Promise<string> {
    const response = await this.chat(
      [{ role: "user", content }],
      options
    );
    return response.message.content;
  }

  /**
   * List available models
   */
  async listModels(): Promise<Model[]> {
    const data = await this.fetch<{ models: Model[] }>("/api/models");
    return data.models;
  }

  /**
   * Check server health
   */
  async health(): Promise<HealthStatus> {
    return this.fetch<HealthStatus>("/api/health");
  }

  /**
   * Check if server is reachable
   */
  async isAvailable(): Promise<boolean> {
    try {
      const status = await this.health();
      return status.status === "ok";
    } catch {
      return false;
    }
  }
}

// Default instance for quick usage
export const inprovLLM = new InprovLLM();

// Convenience exports
export default InprovLLM;

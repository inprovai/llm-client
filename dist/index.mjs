// src/index.ts
var DEFAULT_BASE_URL = "https://ollama.inprov.com";
var DEFAULT_MODEL = "Deepseek-Coder:latest";
var DEFAULT_TIMEOUT = 6e4;
var InprovLLM = class {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl?.replace(/\/$/, "") || DEFAULT_BASE_URL;
    this.apiKey = config.apiKey;
    this.defaultModel = config.defaultModel || DEFAULT_MODEL;
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
  }
  async fetch(endpoint, options) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    const headers = {
      "Content-Type": "application/json"
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
          ...options?.headers
        }
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
  async chat(messages, options = {}) {
    const model = options.model || this.defaultModel;
    return this.fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ model, messages })
    });
  }
  /**
   * Simple prompt helper - sends a single user message
   */
  async prompt(content, options = {}) {
    const response = await this.chat(
      [{ role: "user", content }],
      options
    );
    return response.message.content;
  }
  /**
   * List available models
   */
  async listModels() {
    const data = await this.fetch("/api/models");
    return data.models;
  }
  /**
   * Check server health
   */
  async health() {
    return this.fetch("/api/health");
  }
  /**
   * Check if server is reachable
   */
  async isAvailable() {
    try {
      const status = await this.health();
      return status.status === "ok";
    } catch {
      return false;
    }
  }
};
var inprovLLM = new InprovLLM();
var index_default = InprovLLM;
export {
  InprovLLM,
  index_default as default,
  inprovLLM
};

interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}
interface ChatOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
}
interface ChatResponse {
    message: Message;
    model: string;
}
interface Model {
    name: string;
    modified_at?: string;
    size?: number;
}
interface HealthStatus {
    status: "ok" | "error";
    ollama: "running" | "stopped";
    error?: string;
}
interface InprovLLMConfig {
    baseUrl?: string;
    defaultModel?: string;
    timeout?: number;
}
declare class InprovLLM {
    private baseUrl;
    private defaultModel;
    private timeout;
    constructor(config?: InprovLLMConfig);
    private fetch;
    /**
     * Send a chat message and get a response
     */
    chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse>;
    /**
     * Simple prompt helper - sends a single user message
     */
    prompt(content: string, options?: ChatOptions): Promise<string>;
    /**
     * List available models
     */
    listModels(): Promise<Model[]>;
    /**
     * Check server health
     */
    health(): Promise<HealthStatus>;
    /**
     * Check if server is reachable
     */
    isAvailable(): Promise<boolean>;
}
declare const inprovLLM: InprovLLM;

export { type ChatOptions, type ChatResponse, type HealthStatus, InprovLLM, type InprovLLMConfig, type Message, type Model, InprovLLM as default, inprovLLM };

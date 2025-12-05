# @inprov/llm-client

Client library for the Inprov LLM API (Ollama-based).

## Configuration

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `INPROV_LLM_API_KEY` | **Required.** API key for authentication |

### Optional Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `INPROV_LLM_BASE_URL` | `https://ollama.inprov.app` | API base URL |
| `INPROV_LLM_MODEL` | `Deepseek-Coder:latest` | Default model to use |
| `INPROV_LLM_TIMEOUT_MS` | `60000` | Request timeout in milliseconds |
| `INPROV_LLM_ENABLED` | `false` | Enable/disable the client |

> **Note:** For inprov-platform, all environment variables are managed via [Doppler](https://doppler.com). Run `doppler setup` to configure your local environment.

## Installation

```bash
npm install inprovai/llm-client
```

## Usage

### Basic Usage

```typescript
import { InprovLLM } from "@inprov/llm-client";

const llm = new InprovLLM({
  apiKey: process.env.INPROV_LLM_API_KEY!, // Required
});

// Simple prompt
const response = await llm.prompt("Write a hello world in Python");
console.log(response);
```

### Chat Conversation

```typescript
import { InprovLLM } from "@inprov/llm-client";

const llm = new InprovLLM({
  apiKey: process.env.INPROV_LLM_API_KEY!, // Required
});

const response = await llm.chat([
  { role: "system", content: "You are a helpful coding assistant." },
  { role: "user", content: "How do I read a file in Node.js?" },
]);

console.log(response.message.content);
```

### Custom Configuration

```typescript
import { InprovLLM } from "@inprov/llm-client";

const llm = new InprovLLM({
  apiKey: process.env.INPROV_LLM_API_KEY!, // Required
  baseUrl: "https://ollama.inprov.app",    // Default
  defaultModel: "Deepseek-Coder:latest",   // Default
  timeout: 60000,                          // Default
});
```

### List Available Models

```typescript
const models = await llm.listModels();
console.log(models);
// [{ name: "Deepseek-Coder:latest", size: 776080839 }]
```

### Health Check

```typescript
const health = await llm.health();
console.log(health);
// { status: "ok", ollama: "running" }

// Or just check availability
const isUp = await llm.isAvailable();
```

## API Reference

### `InprovLLM`

#### Constructor

```typescript
new InprovLLM(config?: InprovLLMConfig)
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | string | - | **Required.** API key for authentication |
| `baseUrl` | string | `https://ollama.inprov.app` | API base URL |
| `defaultModel` | string | `Deepseek-Coder:latest` | Default model to use |
| `timeout` | number | `60000` | Request timeout in ms |

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `chat(messages, options?)` | `Promise<ChatResponse>` | Send chat messages |
| `prompt(content, options?)` | `Promise<string>` | Simple single-prompt helper |
| `listModels()` | `Promise<Model[]>` | List available models |
| `health()` | `Promise<HealthStatus>` | Check server health |
| `isAvailable()` | `Promise<boolean>` | Check if server is reachable |

### Types

```typescript
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
```

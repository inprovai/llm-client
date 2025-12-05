# @inprov/llm-client

Client library for the Inprov LLM API.

## Installation

```bash
npm install inprovai/llm-client
```

## Usage

### Basic Usage

```typescript
import { InprovLLM } from "@inprov/llm-client";

const llm = new InprovLLM({
  apiKey: process.env.INPROV_LLM_API_KEY,
});

// Simple prompt
const response = await llm.prompt("Write a hello world in Python");
console.log(response);
```

### Chat Conversation

```typescript
import { InprovLLM } from "@inprov/llm-client";

const llm = new InprovLLM();

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
  apiKey: process.env.INPROV_LLM_API_KEY, // Required if server has auth enabled
  baseUrl: "https://ollama.inprov.com",   // or http://localhost:63000
  defaultModel: "Deepseek-Coder:latest",
  timeout: 60000,
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
| `apiKey` | string | - | API key for authentication |
| `baseUrl` | string | `https://ollama.inprov.com` | API base URL |
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

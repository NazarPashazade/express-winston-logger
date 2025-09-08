### Stable Version

The current stable version of this library is `1.0.44`.

## Installation

```bash
npm i np-express-winston-logger
```

Or using yarn:

```bash
yarn add np-express-winston-logger
```

---

## 🔹 Why Use This Library

This library provides a **ready-to-use logging solution** for Express applications.

So you don’t have to deal with configuring **Winston, Elasticsearch, HTTP request logging, requestId injection, or sensitive data sanitization** manually.

It gives you a **centralized, type-safe, and configurable logger** out of the box.

### Benefits:

- Provides a **centralized logger** for your Node.js services.

- Integrates with **Elasticsearch** to store logs in a structured format.

- Allows **Sanitization** of sensitive fields (like password, token) in logs, with customizable fields.

- Returns a ready-to-use `logger` instance for application logging.

- Supports automatic **RequestId injection** to correlate logs per request.

- Written in **TypeScript** for full type safety and better IDE support.

- Configurable log levels, service name, and **Elasticsearch integration**.

- Supports **console logging** with colored output.

- Provides **Express middleware** (`httpLogger`) to log all HTTP requests with dynamic log levels:

  - `>= 400` → `error`
  - `>= 300` → `http`
  - `< 300` → `info`

- Automatically captures request and response metadata:

  ```ts
    {
        params: req.params,
        query: req.query,
        body: req.body,
        statusCode: res.statusCode
    }
  ```

- ⚠️ **Only trusted** libraries used in the background: **winston, express-winston, winston-elasticsearch, and uuid.**

  <br>

## 🔹 Usage

### ✅ Minimal Setup

How to quickly integrate the logger into an Express app.

```ts
import express from "express";
import { createLogger } from "np-express-winston-logger";

// 1. Initialize logger
const { logger, httpLogger } = createLogger({
  serviceName: "product-service",
});

const app = express();

// 2. Attach HTTP logger middleware
app.use(httpLogger);

app.get("/", (_req, res) => {
  const user = { id: 1, email: "john@example.com", password: "secret" };
  logger.info("User fetched successfully", { user });
  res.send("OK");
});

app.listen(3000, () => {
  logger.info("Server started successfully");
});
```

Console Output:

```bash
  2025-09-07T08:41:01.431Z [info] product-service: Server started successfully

  2025-09-07T08:20:18.456Z [info] product-service: User fetched successfully
  {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "password": secret
    }
  }

  2025-09-07T08:20:18.457Z [http] product-service: GET / 200 5ms
```

---

### ✅ Enable Sanitization

Enable sanitization for custom sensitive fields.

Default sensitive fields (`password`, `token`, `accessToken`, `refreshToken`) are sanitized automatically, so you don’t need to pass them explicitly.

```ts
const { logger, httpLogger } = createLogger({
  serviceName: "product-service",
  sanitize: { sensitiveFields: ["email"] },
});
```

```bash
  2025-09-07T10:15:30.123Z [info] product-service: Server started successfully

  2025-09-07T10:16:05.456Z [info] product-service: User fetched successfully
  {
    "user": {
      "id": 1,
      "email": "****",
      "password": "****"
    }
  }

  2025-09-07T10:16:05.457Z [http] product-service: GET / 200 5ms
```

---

### ✅ Enable Environment

Supported environment values: "dev" | "prod" | "test" | "stage"

It allows you to adjust log behavior, for example:

- Skip debug/verbose logs in production ("prod")

- Apply sanitization differently for sensitive data

- Enable full logging in development or testing

- Since it’s optional, if you don’t pass it, a default value ("dev") will be applied.

```ts
const { logger, httpLogger } = createLogger({
  serviceName: "product-service",
  sanitize: { sensitiveFields: ["email"] },
  env: "prod",
  enableConsole: false,
});
```

---

### ✅ Enable Elasticsearch

You can configure the logger to send logs to an Elasticsearch instance.
This allows centralized storage, searching, and visualization of logs.

Notes:

- If you don’t provide the elasticsearch field, logs will not be sent to Elasticsearch.

- Combine with console logging to see logs both locally and in Elasticsearch.

- Works with all log levels (info, debug, error, etc.).

```ts
const { logger, httpLogger } = createLogger({
  serviceName: "product-service",
  sanitize: { sensitiveFields: ["email"] },
  env: "prod",
  elasticsearch: {
    url: "http://localhost:9200",
  },
});
```

---

### ✅ Enable minLevel

minLevel defines the minimum log level that the logger will process and send to the configured transports (console, Elasticsearch, etc.).

- Logs below this level will be ignored/skipped.

- This allows you to filter out verbose/debug logs in production while still keeping info/error logs.

```ts
const { logger, httpLogger } = createLogger({
  serviceName: "product-service",
  sanitize: { sensitiveFields: ["email"] },
  env: "prod",
  elasticsearch: {
    url: "http://localhost:9200",
  },
  minLevel: LogLevel.INFO, // only INFO, WARN, ERROR and above will be logged
});
```

#### Behavior:

```bash
  logger.silly(...)	  ❌ Ignored
  logger.verbose(...) ❌ Ignored
  logger.debug(...)	  ❌ Ignored
  logger.info(...)	  ✅ Logged
  logger.warn(...)	  ✅ Logged
  logger.error(...)	  ✅ Logged
```

---

### ✅ Enable RequestId middleware

If you want all your logs (both HTTP request logs and manual logger.info, logger.error, etc.) to automatically include a unique requestId, you need to enable the requestIdMiddleware.

- Helps trace logs across services in distributed systems.

- Every request gets a unique identifier.

- You don’t need to manually pass requestId into every logger.info — it’s automatic.

```ts
import { createLogger, requestIdMiddleware } from "np-express-winston-logger";

const { logger, httpLogger } = createLogger({
  serviceName: "product-service",
});

// ✅ 1. Enable requestId per request
app.use(requestIdMiddleware);

// ✅ 2. Attach httpLogger to capture incoming requests
app.use(httpLogger);
```

Console Output:

```bash
  2025-09-07T08:41:01.431Z [info] product-service: [reqId=77d4eb31-efa2-4f44-b4c6-fab8547aa0c9] Server started successfully

  2025-09-07T08:20:18.456Z [info] product-service: [reqId=77d4eb31-efa2-4f44-b4c6-fab8547aa0c9] User fetched successfully
  {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "password": secret
    }
  }

  2025-09-07T08:20:18.457Z [http] product-service: [reqId=77d4eb31-efa2-4f44-b4c6-fab8547aa0c9] GET / 200 5ms
```

---

### ✅ Example Log Levels

Each log level is on its own line for readability.

```ts
logger.error("Something failed");

logger.warn("Check this out");

logger.info("Informational message");

logger.http("HTTP request log");

logger.debug("Debug details here");

logger.verbose("Verbose details");

logger.silly("Silly/debug level message");
```

## 🔹LoggerOptions

```ts
export interface LoggerOptions {
  serviceName: string;
  minLevel?: LogLevel;
  enableConsole?: boolean;
  elasticsearch?: ElasticsearchOptions;
  sanitize?: SanitizeOptions;
  env?: Environments;
}
```

---

#### 🔹 serviceName (required)

- Name of your service/microservice.

- Included in every log line to help identify the source.

---

#### 🔹 minLevel (optional). Type: LogLevel

- The minimum log level to capture (silly, debug, verbose, http, info, warn, error).

- Example: minLevel: LogLevel.INFO will log info, warn, error, but ignore debug/verbose.

---

#### 🔹 enableConsole (optional, default: false)

- Whether to print logs to the console with colors.

- Useful in development for quick debugging.

---

#### 🔹 elasticsearch (optional)

- Enable structured log shipping to Elasticsearch.

```ts
export type ElasticsearchOptions = { url: string };
```

---

#### 🔹 sanitize (optional)

- Automatically masks sensitive data in logs.

  - Default fields (password, token, accessToken, refreshToken) are always sanitized.

  - You can add your own fields, e.g. sanitize: { sensitiveFields: ["email"] }.

```ts
export type SanitizeOptions = { sensitiveFields: string[] };
```

---

#### 🔹 env (optional, default: "dev")

- Environment the logger is running in.

- Example behavior:

  - "prod" → hides debug/verbose logs.

  - "dev" → full verbose logging.

```ts
export type Environments = "dev" | "prod" | "test" | "stage";
```

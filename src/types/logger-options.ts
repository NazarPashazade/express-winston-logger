import { LogLevel } from "./log-level";

export type ElasticsearchOptions = { url: string };

export type SanitizeOptions = { sensitiveFields: string[] };

export type Environments = "dev" | "prod" | "test" | "stage";

export interface LoggerOptions {
  serviceName: string;
  minLevel?: LogLevel;
  enableConsole?: boolean;
  elasticsearch?: ElasticsearchOptions;
  sanitize?: SanitizeOptions;
  env?: Environments;
  requestId?: string;
}

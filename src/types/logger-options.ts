import { LogLevel } from "./log-level";

export type ElasticsearchOptions = { url: string };

export interface LoggerOptions {
  serviceName: string;
  level?: LogLevel;
  enableConsole?: boolean;
  elasticsearch?: ElasticsearchOptions;
}

import { LogLevel } from "./log-level";

export type ElasticsearchOptions =
  | { enable: false }
  | { enable: true; url: string };

export interface LoggerOptions {
  serviceName: string;
  level?: LogLevel;
  enableConsole?: boolean;
  elasticsearch?: ElasticsearchOptions;
}

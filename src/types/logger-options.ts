import { LogLevel } from "./log-level";

export interface LoggerOptions {
  serviceName: string;
  elasticsearchUrl: string;
  level?: LogLevel;
  enableConsole?: boolean;
  enableElasticsearch?: boolean;
}

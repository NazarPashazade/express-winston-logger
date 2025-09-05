export interface CustomLogData {
  timestamp: string;
  level: string;
  message: string;
  stack?: string;
  meta?: Record<string, any>;
  service?: string;
}

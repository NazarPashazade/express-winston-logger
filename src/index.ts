import { format, createLogger as winstonCreateLogger } from "winston";
import { createHttpLogger } from "./http-logger";
import { LogLevel } from "./types/log-level";
import { LoggerOptions } from "./types/logger-options";
import {
  createConsoleTransport,
  createElasticsearchTransport,
} from "./transports";

export function createLogger({
  serviceName,
  elasticsearchUrl,
  level = LogLevel.INFO,
  enableConsole = true,
  enableElasticsearch = true,
}: LoggerOptions) {
  const transportsList: any[] = [];

  if (enableConsole) {
    transportsList.push(createConsoleTransport(level));
  }

  if (enableElasticsearch) {
    transportsList.push(
      createElasticsearchTransport({
        level,
        url: elasticsearchUrl,
        serviceName,
      })
    );
  }

  const logger = winstonCreateLogger({
    level,
    defaultMeta: { service: serviceName },
    transports: transportsList,
    format: format.combine(
      format.timestamp({ format: () => new Date().toISOString() }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
  });

  const httpLogger = createHttpLogger(logger);

  return { logger, httpLogger };
}

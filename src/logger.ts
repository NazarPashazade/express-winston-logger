import { format, createLogger as winstonCreateLogger } from "winston";
import { createHttpLogger } from "./http-logger";
import { sanitizeData } from "./sanitizer";
import {
  createConsoleTransport,
  createElasticsearchTransport,
} from "./transports";
import { LogLevel } from "./types/log-level";
import { LoggerOptions } from "./types/logger-options";

export function createLogger({
  serviceName,
  minLevel = LogLevel.SILLY,
  enableConsole = true,
  env = "dev",
  sanitize,
  elasticsearch,
}: LoggerOptions) {
  const transportsList: any[] = [];

  if (enableConsole) {
    transportsList.push(createConsoleTransport(minLevel));
  }

  if (elasticsearch) {
    transportsList.push(
      createElasticsearchTransport({
        minLevel,
        url: elasticsearch.url,
        serviceName,
      })
    );
  }

  const formatOptions = format.combine(
    format((log) => {
      if (
        log.env === "prod" &&
        [LogLevel.DEBUG, LogLevel.VERBOSE].includes(log.level as LogLevel)
      ) {
        return false;
      }

      const splat = log[Symbol.for("splat")] as any[];

      if (sanitize) {
        if (log.meta) {
          log.meta = sanitizeData(log.meta, sanitize.sensitiveFields);
        }

        if (splat?.length) {
          log[Symbol.for("splat")] = splat.map((item) =>
            typeof item === "object"
              ? sanitizeData(item, sanitize.sensitiveFields)
              : item
          );
        }
      }
      return log;
    })(),
    format.timestamp({ format: () => new Date().toISOString() }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  );

  const logger = winstonCreateLogger({
    level: minLevel,
    defaultMeta: { service: serviceName, env },
    transports: transportsList,
    format: formatOptions,
  });

  const httpLogger = createHttpLogger(logger);

  return { logger, httpLogger };
}

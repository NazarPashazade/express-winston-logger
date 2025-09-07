import * as expressWinston from "express-winston";
import { Logger } from "winston";
import { LogLevel } from "./types/log-level";

const HTTP_MESSAGE_FORMAT =
  "{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms";

export const createHttpLogger = (logger: Logger) => {
  const httpLogger = expressWinston.logger({
    winstonInstance: logger,
    msg: HTTP_MESSAGE_FORMAT,
    expressFormat: true,
    colorize: true,
    level: (_req, res) => {
      const status = res.statusCode;
      if (status >= 400) return LogLevel.ERROR;
      if (status >= 300) return LogLevel.HTTP;
      return LogLevel.INFO;
    },
    ignoreRoute: () => false,
    meta: true,
    dynamicMeta: (req, res) => ({
      params: req.params,
      query: req.query,
      body: req.body,
      statusCode: res.statusCode,
    }),
  });

  return httpLogger;
};

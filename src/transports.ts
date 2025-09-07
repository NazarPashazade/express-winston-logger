import { format, transports } from "winston";
import { ElasticsearchTransport, LogData } from "winston-elasticsearch";
import { CustomLogData } from "./types/custom-log-data";
import { LogLevel } from "./types/log-level";

export const createConsoleTransport = (minLevel: LogLevel) => {
  const consoleFormat = format.combine(
    format.colorize(),
    format.timestamp({ format: () => new Date().toISOString() }),
    format.errors({ stack: true }),
    format.printf((log) => {
      const { level, message, timestamp, service, stack } = log;
      const splat = (log[Symbol.for("splat")] as any[]) || [];
      const metaString = splat.length
        ? ` ${JSON.stringify(splat[0], null, 2)}`
        : "";
      const stackString = `${stack ? `\n${stack}` : ""} `;

      const reqId = log.requestId ? `[reqId=${log.requestId}]` : "";

      return `${timestamp} [${level}] ${service}: ${reqId} ${message}: ${stackString} ${metaString}`;
    })
  );

  return new transports.Console({
    handleExceptions: true,
    level: minLevel,
    format: consoleFormat,
  });
};

export const createElasticsearchTransport = ({
  url,
  minLevel,
  serviceName,
}: any) => {
  const esTransfer = (logData: LogData) => {
    const { level, message, timestamp, service, stack } =
      logData as CustomLogData;

    const meta = (logData as any)[Symbol.for("splat")]?.[0] || logData?.meta;

    return {
      timestamp,
      message,
      stack,
      meta,
      level: level || LogLevel.INFO,
      service: service || serviceName,
    };
  };

  return new ElasticsearchTransport({
    level: minLevel,
    clientOpts: { node: url },
    indexPrefix: `${serviceName}-logs`,
    transformer: esTransfer,
  });
};

import winston from "winston";

import "winston-daily-rotate-file";

const transport = new winston.transports.DailyRotateFile({
  filename: "src/logs/application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "debug",
});

const logger = winston.createLogger({
  level: "info",
  transports: [transport],
});

export default logger;

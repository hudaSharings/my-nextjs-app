import winston from "winston";
import path from "path";
import fs from "fs";

// Ensure the logs directory exists
const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Function to get the log file name (YYYY-MM-DD.log)
const getLogFileName = () => {
  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  return path.join(logsDir, `${date}.log`);
};

// Create Winston logger instance
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
   winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
  ),
  transports: [
    new winston.transports.File({ filename: getLogFileName() }), // Daily log file
  ],
});

// Log to console in development mode
if (process.env.NODE_ENV === "development") {
  logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

// Function to log messages
export const logToFile = (level: "info" | "error" | "warn", message: string, data?: any) => {
  logger.log({ level, message, data });
};

export default logger;

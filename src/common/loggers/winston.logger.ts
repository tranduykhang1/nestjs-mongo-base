import * as fs from 'fs';
import * as path from 'path';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp } = format;

const dir = 'logs';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const customFormat = format.printf(({ timestamp, level, message, stack }) => {
  let logMessage = `${timestamp} - [%c${level.toUpperCase()}%c] - ${message}`;

  if (stack) {
    logMessage += `\n${stack}`;
  }

  if (level === 'error') {
    logMessage = logMessage.replace(/%c/g, '\x1b[31m');
  } else if (level === 'warn') {
    logMessage = logMessage.replace(/%c/g, '\x1b[33m');
  } else {
    logMessage = logMessage.replace(/%c/g, '\x1b[32m');
  }

  return logMessage + '\x1b[0m';
});

const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()).padStart(2, '0');

const formattedDate = `${year}-${month}-${day}`;

// Logger options
const options = {
  error: {
    level: 'error',
    filename: path.join(dir, `error-${formattedDate}.log`),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
  },
  combine: {
    level: 'verbose',
    filename: path.join(dir, `info-${formattedDate}.log`),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
  },
};

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    customFormat,
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      ...options.error,
      format: combine(timestamp(), format.json()),
    }),
    new transports.File({
      ...options.combine,
      format: combine(timestamp(), format.json()),
    }),
  ],
});

export default logger;

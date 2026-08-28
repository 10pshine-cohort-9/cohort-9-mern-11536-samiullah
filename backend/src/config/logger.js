const pino = require('pino');
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'app.log');

const transport = pino.transport({
  targets: [
    {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'SYS:yyyy-mm-dd HH:MM:ss' },
      level: process.env.NODE_ENV === 'test' ? 'silent' : 'info'
    },
    {
      target: 'pino/file',
      options: { destination: logFile, mkdir: true },
      level: 'info'
    }
  ]
});

const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    base: { pid: false }
  },
  transport
);

module.exports = logger;

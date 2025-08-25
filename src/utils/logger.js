import winston from 'winston';
import { fileURLToPath } from 'node:url';
import { EventEmitter } from 'node:events';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logDir = path.join(__dirname, "../logs")

export const logger = winston.createLogger({
    level: "debug",
    format: winston.format.combine(
        winston.formt.timestamp(),
        winston.format.errors({stack: true}),
        winston.format.json()
    ),
    defaultMeta: {service: 'todos-api'},
    transports: [
        new winston.transports.File({
            filename: path.join(logDir, "error.log"),
            level: 'error',
            maxsize: 5242880
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({filename: path.join(logDir, 'exceptions.log')})
    ],
    rejectionHandlers: [
        new winston.transports.File({filename: path.join(logDir, 'rejections.log')})
    ],
    exitOnError: false 
})

if (process.env){

}
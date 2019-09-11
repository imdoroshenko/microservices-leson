import { createLogger, transports, format } from 'winston'
const { combine, timestamp, printf } = format
const myFormat = printf(({ level, message, correlationId, timestamp }) => {
    return correlationId 
        ? `${timestamp} [${level}] [${correlationId}]: ${message}`
        : `${timestamp} [${level}]: ${message}`
  });
export const log = createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss.SSS'
        }),
        myFormat
    ),
    transports: [
      new transports.Console()
    ]
  })


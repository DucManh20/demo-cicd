/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { TransformableInfo } from 'winston-slack-webhook-transport';
import { TransformableInfo as LogformTransformableInfo } from 'logform';
import * as SlackHook from 'winston-slack-webhook-transport';
import * as dotenv from 'dotenv';
import * as process from 'process';
dotenv.config();

const commonLogFormat = (info: LogformTransformableInfo) => {
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const contextLog = info.context ? `[Context]: ${info.context}` : '';
  const baseLog = `[${info.timestamp}] [${info.level}] ${info.message}`;
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const traceLog = info.trace ? `\n[Trace]: ${info.trace}` : '';
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const stackLog = info.stack ? `\n[Stack]: ${info.stack}` : '';

  if (process.env.IS_SEND_NOTIFICATION_SLACK === 'true') {
    switch (info.level) {
      case 'error':
        loggerSlack.error(info);
        break;
      case 'debug':
        loggerSlack.debug(info);
        break;
    }
  }

  return `${baseLog} ${contextLog} ${traceLog} ${stackLog}`;
};

const commonLogSlackFormat = (info: TransformableInfo) => {
  const contextLog = info.context ? `\n[Context]: ${info.context}` : '';
  const baseLog = `Date: ${info.timestamp}\nLevel: ${info.level.toUpperCase()}\nMessage: ${info.message}`;
  const traceLog = info.trace ? `\n[Trace]: ${info.trace}` : '';
  const stackLog = info.stack ? `\n[Stack]: ${info.stack}` : '';

  return `${baseLog}${contextLog}${traceLog}${stackLog}`;
};

const timestampFormat = winston.format.timestamp({
  format: 'MMM-DD-YYYY HH:mm:ss',
});

export const transportsCustom = [
  new winston.transports.Console({
    level: 'debug',
    format: winston.format.combine(
      winston.format.cli(),
      winston.format.align(),
      timestampFormat,
      winston.format.printf(commonLogFormat),
    ),
  }),
  new winston.transports.DailyRotateFile({
    level: 'debug',
    filename: './logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      timestampFormat,
      winston.format.printf(commonLogFormat),
    ),
  }),
];

export const loggerSlack = winston.createLogger({
  transports: [
    new SlackHook({
      webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
      level: 'info', // Send logs with level "info" and above
      formatter: (info: TransformableInfo) => {
        const formattedMessage = commonLogSlackFormat(info);
        let color: string;
        let title: string;
        const environment = process.env.SLACK_ENVIRONMENT || 'Unknown';

        switch (info.level) {
          case 'error':
            color = '#FF0000';
            title = `*${environment} ERROR Log 🚨*`;
            break;
          case 'warn':
            color = '#FFA500';
            title = `*${environment} WARNING Log ⚠️*`;
            break;
          case 'info':
            color = '#1E90FF';
            title = `*${environment} Info Log ℹ️*`;
            break;
          case 'debug':
            color = '#8A2BE2';
            title = `*${environment} Debug Log 🔍*`;
            break;
          default:
            color = '#C0C0C0';
            title = `*${environment} Log*`;
            break;
        }

        // Format notification
        return {
          attachments: [
            {
              color: color,
              blocks: [
                {
                  type: 'header',
                  text: {
                    type: 'plain_text',
                    text: title.replace(/\*/g, ''),
                    emoji: true,
                  },
                },
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: '```' + formattedMessage + '```',
                  },
                },
              ],
            },
          ],
        };
      },
    }),
  ],
});

import { z } from 'zod';

const LoggableSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([z.string(), z.number(), z.boolean(), z.null(), z.undefined(), z.array(LoggableSchema), z.record(z.string(), LoggableSchema)])
);

const sensitiveFields = ['password', 'passwordHash', 'secret', 'token'];

function redact(obj: unknown): unknown {
  const parsed = LoggableSchema.safeParse(obj);
  if (!parsed.success) {
    return obj;
  }
  const data = parsed.data;

  if (data === null || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(redact);
  }

  const redactedObj: { [key: string]: unknown } = {};
  for (const key in data as Record<string, unknown>) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      if (sensitiveFields.includes(key.toLowerCase())) {
        redactedObj[key] = '[REDACTED]';
      } else {
        redactedObj[key] = redact((data as Record<string, unknown>)[key]);
      }
    }
  }
  return redactedObj;
}

export const logger = {
  info: (...args: unknown[]) => {
    console.log(...args.map(redact));
  },
  warn: (...args: unknown[]) => {
    console.warn(...args.map(redact));
  },
  error: (...args: unknown[]) => {
    console.error(...args.map(redact));
  },
};
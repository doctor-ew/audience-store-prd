const sensitiveFields = ['password', 'passwordHash', 'secret', 'token'];

function redact(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(redact);
  }

  const redactedObj: { [key: string]: any } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (sensitiveFields.includes(key.toLowerCase())) {
        redactedObj[key] = '[REDACTED]';
      } else {
        redactedObj[key] = redact(obj[key]);
      }
    }
  }
  return redactedObj;
}

export const logger = {
  info: (...args: any[]) => {
    console.log(...args.map(redact));
  },
  warn: (...args: any[]) => {
    console.warn(...args.map(redact));
  },
  error: (...args: any[]) => {
    console.error(...args.map(redact));
  },
};

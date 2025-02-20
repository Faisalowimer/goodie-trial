type LogMetadata = Record<string, unknown> | string | number | boolean | null | Error;

const formatMessage = (level: string, message: string, metadata?: LogMetadata) => {
    const timestamp = new Date().toISOString();
    let log = `${timestamp} [${level}] ${message}`;

    if (metadata) {
        if (metadata instanceof Error) {
            log += `\nError: ${metadata.message}`;
            if (metadata.stack) {
                log += `\nStack: ${metadata.stack}`;
            }
        } else if (typeof metadata === 'object') {
            try {
                log += `\nMetadata: ${JSON.stringify(metadata, null, 2)}`;
            } catch (_) {
                log += `\nMetadata: [Unable to stringify metadata]`;
            }
        } else {
            log += ` ${String(metadata)}`;
        }
    }
    return log;
};

export const logger = {
    info: (message: string, metadata?: LogMetadata) => {
        console.info(formatMessage('INFO', message, metadata));
    },
    warn: (message: string, metadata?: LogMetadata) => {
        console.warn(formatMessage('WARN', message, metadata));
    },
    error: (message: string, metadata?: LogMetadata) => {
        console.error(formatMessage('ERROR', message, metadata));
    },
    debug: (message: string, metadata?: LogMetadata) => {
        if (process.env.NODE_ENV === 'development') {
            console.debug(formatMessage('DEBUG', message, metadata));
        }
    }
};

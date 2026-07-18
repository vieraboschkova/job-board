export interface Logger {
  info(message: string, meta?: unknown): void;
  success(message: string, meta?: unknown): void;
  error(message: string, meta?: unknown): void;
}

class ConsoleLogger implements Logger {
  info(message: string, meta?: unknown): void {
    write(console.info, "info", message, meta);
  }

  success(message: string, meta?: unknown): void {
    write(console.info, "success", message, meta);
  }

  error(message: string, meta?: unknown): void {
    write(console.error, "error", message, meta);
  }
}

/** Process-wide singleton: this module is evaluated once, so all imports share this instance. */
export const logger: Logger = new ConsoleLogger();

function write(
  writeFn: (message?: unknown, ...optionalParams: unknown[]) => void,
  level: "info" | "success" | "error",
  message: string,
  meta?: unknown,
): void {
  if (meta === undefined) {
    writeFn(`[${level}] ${message}`);
    return;
  }

  writeFn(`[${level}] ${message}`, meta);
}

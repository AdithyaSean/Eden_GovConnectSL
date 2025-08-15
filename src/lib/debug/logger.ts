/* Minimal debug-first logger for prototype */

type Level = "debug" | "info" | "warn" | "error";

const DEBUG_ENABLED =
  (process.env.DEBUG ?? process.env.NEXT_PUBLIC_DEBUG ?? "true").toLowerCase() !==
  "false";

function fmt(level: Level, msg: string, meta?: Record<string, unknown>) {
  const prefix = `[${new Date().toISOString()}] [${level.toUpperCase()}]`;
  return meta ? `${prefix} ${msg} ${JSON.stringify(meta)}` : `${prefix} ${msg}`;
}

export const logger = {
  debug(msg: string, meta?: Record<string, unknown>) {
    if (DEBUG_ENABLED) {
      // eslint-disable-next-line no-console
      console.debug(fmt("debug", msg, meta));
    }
  },
  info(msg: string, meta?: Record<string, unknown>) {
    // eslint-disable-next-line no-console
    console.info(fmt("info", msg, meta));
  },
  warn(msg: string, meta?: Record<string, unknown>) {
    // eslint-disable-next-line no-console
    console.warn(fmt("warn", msg, meta));
  },
  error(msg: string, meta?: Record<string, unknown>) {
    // eslint-disable-next-line no-console
    console.error(fmt("error", msg, meta));
  },
};

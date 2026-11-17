import pc from "picocolors";

export const icons = {
  pass: pc.green("PASS"),
  warn: pc.yellow("WARN"),
  fail: pc.red("FAIL"),
  info: pc.cyan("INFO"),
};

export function heading(label: string): string {
  return pc.bold(pc.cyan(label));
}

export function section(label: string): string {
  return pc.bold(label);
}

export function label(name: string, value: unknown): string {
  return `${pc.dim(`${name}:`)} ${String(value)}`;
}

export function path(value: string): string {
  return pc.underline(value);
}

export function success(value: string): string {
  return pc.green(value);
}

export function warning(value: string): string {
  return pc.yellow(value);
}

export function danger(value: string): string {
  return pc.red(value);
}

export function muted(value: string): string {
  return pc.dim(value);
}

export function jsonBlock(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

type ErrorPayload = { code: string; message: string; exitCode?: number; fix?: string };

function payloadOf(error: unknown): ErrorPayload | undefined {
  const payload = (error as { payload?: ErrorPayload } | null)?.payload;
  return payload && typeof payload.code === "string" ? payload : undefined;
}

/** Turns any thrown value into a short message plus fix, without a stack trace unless debugging. */
export function formatError(
  error: unknown,
  options: { debug?: boolean } = {},
): { text: string; exitCode: number } {
  const payload = payloadOf(error);
  const message = payload?.message ?? (error instanceof Error ? error.message : String(error));
  const lines = [`${danger("Error")} ${message}`];
  if (payload?.fix) lines.push(`${muted("Fix:")} ${payload.fix}`);
  if (payload?.code) lines.push(muted(`Code: ${payload.code}`));
  if (options.debug && error instanceof Error && error.stack) lines.push("", muted(error.stack));
  else lines.push(muted("Set BEAM_DEBUG=1 to see the full trace."));
  return { text: lines.join("\n"), exitCode: payload?.exitCode ?? 1 };
}

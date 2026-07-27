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

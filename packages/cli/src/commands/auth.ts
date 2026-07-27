import {
  removeFigmaCredentials,
  saveFigmaCredentials,
  summarizeFigmaCredentials,
} from "@beam/core";

export type LoginCommandOptions = {
  token?: string;
  tokenStdin?: boolean;
  homeDir?: string;
};

export async function loginCommand(
  options: LoginCommandOptions = {},
): Promise<void> {
  const token = options.tokenStdin
    ? (await readStdin()).trim()
    : options.token?.trim();

  if (!token) {
    throw new Error("Figma token is required. Use --token or --token-stdin.");
  }

  const path = await saveFigmaCredentials(token, { homeDir: options.homeDir });
  process.stdout.write(`Beam login saved credentials at ${path}\n`);
}

export async function logoutCommand(
  options: { yes?: boolean; json?: boolean; homeDir?: string } = {},
): Promise<void> {
  if (!options.yes) {
    process.stdout.write("Pass --yes to remove local Figma credentials.\n");
    return;
  }

  await removeFigmaCredentials({ homeDir: options.homeDir });
  writeAuthOutput({ removed: true }, options.json);
}

export async function whoamiCommand(
  options: { json?: boolean; homeDir?: string } = {},
): Promise<void> {
  const summary = await summarizeFigmaCredentials({ homeDir: options.homeDir });
  writeAuthOutput(summary, options.json);
}

function writeAuthOutput(value: unknown, json = false): void {
  if (json) {
    process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
    return;
  }

  process.stdout.write(`Beam auth\n\n${JSON.stringify(value, null, 2)}\n`);
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

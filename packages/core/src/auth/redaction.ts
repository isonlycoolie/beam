export function redactAccessToken(token: string): string {
  if (token.length <= 8) {
    return "****";
  }

  return `${token.slice(0, 5)}...${token.slice(-4)}`;
}

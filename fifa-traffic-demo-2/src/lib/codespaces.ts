export function isRunningInCodespaces(): boolean {
  return (
    process.env.CODESPACES === 'true' ||
    !!process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
  );
}

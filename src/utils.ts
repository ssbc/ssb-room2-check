export function isSsbUri(input: string): boolean {
  if (!input) return false;
  if (typeof input !== 'string') return false;
  let url: URL;
  try {
    url = new URL(input);
  } catch (err) {
    return false;
  }
  if (url.protocol !== 'ssb:') return false;
  if (url.pathname !== 'experimental' && url.host !== 'experimental') {
    return false;
  }
  return true;
}

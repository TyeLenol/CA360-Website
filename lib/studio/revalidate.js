export function revalidatePublicContent() {
  return fetch('/api/studio/revalidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  })
    .then((response) => response.ok)
    .catch(() => false);
}

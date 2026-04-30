export function getUserFromRequest(req: Request): string {
  const userId = req.headers.get('x-user-id');
  return userId || 'anonymous';
}
export function getAssetUrl(path) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Tomamos la URL base de Rails desde la variable de entorno o por defecto localhost:3000
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
  try {
    const origin = new URL(apiUrl).origin;
    return `${origin}${path.startsWith('/') ? '' : '/'}${path}`;
  } catch {
    return `http://localhost:3000${path.startsWith('/') ? '' : '/'}${path}`;
  }
}


export const API_CRYPTO_BASE = 'https://criptoya.com/api';
export const API_ARG_DATOS_BASE = 'https://api.argentinadatos.com/v1';

export async function fetchJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`Fetch error for ${url}:`, err);
    return fallback;
  }
}
